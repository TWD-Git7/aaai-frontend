<?php
/**
 * Plugin Name: AAAI Atendimentos
 * Description: Pedidos privados de atendimento e consulta com codigo de acesso.
 * Version: 0.7.0
 * Requires PHP: 8.0
 */
if (!defined('ABSPATH')) { exit; }

function aaai_at_key() {
    $file = __DIR__ . '/aaai-atendimento/secret.php';
    if (!is_readable($file)) { return ''; }
    $key = include $file;
    return is_string($key) && preg_match('/^[a-f0-9]{64}$/D', $key) ? $key : '';
}
function aaai_at_states() {
    return ['received'=>'Recebido', 'review'=>'Em analise', 'scheduled'=>'Agendado', 'in_progress'=>'Em atendimento', 'completed'=>'Concluido', 'cancelled'=>'Cancelado'];
}
add_action('init', function () {
    $caps = array_fill_keys(['edit_post','read_post','delete_post','edit_posts','edit_others_posts','publish_posts','read_private_posts','delete_posts','delete_private_posts','delete_published_posts','delete_others_posts','edit_private_posts','edit_published_posts'], 'manage_options');
    $caps['create_posts'] = 'do_not_allow';
    register_post_type('aaai_appointment', [
        'labels'=>['name'=>'Atendimentos AAAI','singular_name'=>'Atendimento AAAI'],
        'public'=>false,'publicly_queryable'=>false,'show_ui'=>true,'show_in_rest'=>false,
        'exclude_from_search'=>true,'rewrite'=>false,'query_var'=>false,'supports'=>[],
        'menu_icon'=>'dashicons-calendar-alt','capabilities'=>$caps,'map_meta_cap'=>false,
    ]);
});
function aaai_at_permission($request) {
    $key = aaai_at_key();
    $given = (string) $request->get_header('x-aaai-key');
    return $key !== '' && hash_equals($key, $given) ? true : new WP_Error('aaai_unauthorized','Acesso recusado.',['status'=>401]);
}
function aaai_at_reply($data, $status=200) {
    $response = new WP_REST_Response($data, $status);
    $response->header('Cache-Control','no-store, private');
    $response->header('Pragma','no-cache');
    return $response;
}
function aaai_at_error($code,$status) { return new WP_Error($code,'Nao foi possivel concluir o pedido.',['status'=>$status]); }
function aaai_at_limit($bucket, $max, $seconds) {
    $key = 'aaai_at_' . $bucket;
    $count = (int) get_transient($key);
    if ($count >= $max) { return false; }
    set_transient($key,$count+1,$seconds);
    return true;
}
function aaai_at_date($value) {
    if (!is_string($value) || !preg_match('/^(\d{4})-(\d{2})-(\d{2})$/D',$value,$m)) { return false; }
    return checkdate((int)$m[2],(int)$m[3],(int)$m[1]);
}
function aaai_at_code($idempotency) { return substr(hash_hmac('sha256',$idempotency,wp_salt('nonce')),0,32); }
function aaai_at_receipt($post,$idempotency,$status=200) {
    return aaai_at_reply(['reference'=>get_post_meta($post->ID,'_aaai_reference',true),'accessCode'=>aaai_at_code($idempotency),'state'=>get_post_meta($post->ID,'_aaai_state',true)],$status);
}
function aaai_at_create($request) {
    $data = $request->get_json_params();
    if (!is_array($data)) { return aaai_at_error('invalid',400); }
    $name = isset($data['name']) && is_string($data['name']) ? sanitize_text_field($data['name']) : '';
    $email = isset($data['email']) && is_string($data['email']) ? trim($data['email']) : '';
    $service = isset($data['service']) && is_string($data['service']) ? sanitize_text_field($data['service']) : '';
    $phone = isset($data['phone']) && is_string($data['phone']) ? sanitize_text_field($data['phone']) : '';
    $message = isset($data['message']) && is_string($data['message']) ? sanitize_textarea_field($data['message']) : '';
    $date = $data['date'] ?? null;
    $period = $data['period'] ?? null;
    $locale = $data['locale'] ?? null;
    $idem = $data['idempotencyKey'] ?? null;
    $today = (new DateTimeImmutable('now',new DateTimeZone('Africa/Luanda')))->format('Y-m-d');
    if (strlen($name)<2 || strlen($name)>300 || !is_email($email) || strlen($email)>254 || strlen($service)<2 || strlen($service)>450 || strlen($phone)>50 || strlen($message)>4800 || !aaai_at_date($date) || $date<$today || !in_array($period,['morning','afternoon'],true) || !in_array($locale,['pt','en','fr','es'],true) || ($data['consent']??false)!==true || !is_string($idem) || !preg_match('/^[a-f0-9-]{32,80}$/Di',$idem)) { return aaai_at_error('invalid',400); }
    $fingerprint = hash('sha256',wp_json_encode([$name,$email,$phone,$service,$date,$period,$locale,$message]));
    $idem_hash = hash('sha256',$idem);
    $lock = 'aaai_at_lock_' . $idem_hash;
    if (!add_option($lock,time(),'','no')) {
        $stamp = (int) get_option($lock);
        if ($stamp && $stamp < time()-120) { delete_option($lock); }
        return aaai_at_error('conflict',409);
    }
    try {
        $existing = get_posts(['post_type'=>'aaai_appointment','post_status'=>'private','numberposts'=>1,'meta_key'=>'_aaai_idempotency','meta_value'=>$idem_hash]);
        if ($existing) {
            if (!hash_equals((string)get_post_meta($existing[0]->ID,'_aaai_fingerprint',true),$fingerprint)) { return aaai_at_error('conflict',409); }
            return aaai_at_receipt($existing[0],$idem);
        }
        if (!aaai_at_limit('create',120,600)) { return aaai_at_error('rate_limited',429); }
        $reference = 'AAAI-' . gmdate('Y') . '-' . strtoupper(bin2hex(random_bytes(6)));
        $id = wp_insert_post([
            'post_type'=>'aaai_appointment','post_status'=>'private','post_title'=>$reference,
            'meta_input'=>[
                '_aaai_reference'=>$reference,'_aaai_code_hash'=>hash_hmac('sha256',aaai_at_code($idem),wp_salt('auth')),
                '_aaai_idempotency'=>$idem_hash,'_aaai_fingerprint'=>$fingerprint,'_aaai_state'=>'received',
                '_aaai_name'=>$name,'_aaai_email'=>$email,'_aaai_phone'=>$phone,'_aaai_service'=>$service,
                '_aaai_date'=>$date,'_aaai_period'=>$period,'_aaai_locale'=>$locale,'_aaai_message'=>$message,
                '_aaai_consent_at'=>gmdate('c'),'_aaai_public_message'=>'','_aaai_scheduled_at'=>'',
            ],
        ],true);
        if (is_wp_error($id)) { return aaai_at_error('unavailable',503); }
        return aaai_at_receipt(get_post($id),$idem,201);
    } finally { delete_option($lock); }
}
function aaai_at_lookup($request) {
    if (!aaai_at_limit('lookup',600,600)) { return aaai_at_error('rate_limited',429); }
    $data = $request->get_json_params();
    $reference = is_array($data) && is_string($data['reference']??null) ? strtoupper(trim($data['reference'])) : '';
    $code = is_array($data) && is_string($data['accessCode']??null) ? strtolower(trim($data['accessCode'])) : '';
    if (!preg_match('/^AAAI-\d{4}-[A-F0-9]{12}$/D',$reference) || !preg_match('/^[a-f0-9]{32}$/D',$code)) { return aaai_at_error('not_found',404); }
    $posts = get_posts(['post_type'=>'aaai_appointment','post_status'=>'private','numberposts'=>1,'meta_key'=>'_aaai_reference','meta_value'=>$reference]);
    $candidate = hash_hmac('sha256',$code,wp_salt('auth'));
    $stored = $posts ? (string) get_post_meta($posts[0]->ID,'_aaai_code_hash',true) : str_repeat('0',64);
    if (!hash_equals($stored,$candidate) || !$posts) { return aaai_at_error('not_found',404); }
    $post = $posts[0];
    $state = get_post_meta($post->ID,'_aaai_state',true);
    return aaai_at_reply([
        'reference'=>$reference,'state'=>$state,
        'scheduledAt'=>$state==='scheduled' ? get_post_meta($post->ID,'_aaai_scheduled_at',true) : '',
        'publicMessage'=>get_post_meta($post->ID,'_aaai_public_message',true),
        'updatedAt'=>get_post_modified_time('c',true,$post),
    ]);
}
add_action('rest_api_init',function () {
    $permission = 'aaai_at_permission';
    register_rest_route('aaai-atendimento/v1','/health',['methods'=>'GET','permission_callback'=>$permission,'callback'=>function () { return aaai_at_reply(['ok'=>true,'version'=>'0.7.0']); }]);
    register_rest_route('aaai-atendimento/v1','/appointments',['methods'=>'POST','permission_callback'=>$permission,'callback'=>'aaai_at_create']);
    register_rest_route('aaai-atendimento/v1','/lookup',['methods'=>'POST','permission_callback'=>$permission,'callback'=>'aaai_at_lookup']);
});
add_action('add_meta_boxes',function () {
    add_meta_box('aaai_at_details','Pedido e gestao do atendimento',function ($post) {
        if (!current_user_can('manage_options')) { return; }
        wp_nonce_field('aaai_at_save','aaai_at_nonce');
        $fields=['name'=>'Nome','email'=>'E-mail','phone'=>'Telefone','service'=>'Servico','date'=>'Data preferida','period'=>'Periodo preferido','locale'=>'Idioma','message'=>'Observacoes','consent_at'=>'Consentimento registado'];
        echo '<table class="widefat striped"><tbody>';
        foreach ($fields as $key=>$label) { echo '<tr><th>'.esc_html($label).'</th><td style="white-space:pre-wrap">'.esc_html(get_post_meta($post->ID,'_aaai_'.$key,true)).'</td></tr>'; }
        echo '</tbody></table><p>Referencia: <strong>'.esc_html(get_post_meta($post->ID,'_aaai_reference',true)).'</strong></p>';
        echo '<p><label>Estado <select name="aaai_state">';
        foreach (aaai_at_states() as $key=>$label) { echo '<option value="'.esc_attr($key).'" '.selected(get_post_meta($post->ID,'_aaai_state',true),$key,false).'>'.esc_html($label).'</option>'; }
        echo '</select></label></p><p><label>Data/hora confirmada (Angola, UTC+1) <input type="datetime-local" name="aaai_scheduled_at" value="'.esc_attr(get_post_meta($post->ID,'_aaai_scheduled_at',true)).'"></label></p>';
        echo '<p><label>Mensagem visivel ao titular (max. 1200 caracteres)<br><textarea name="aaai_public_message" rows="4" maxlength="1200" class="widefat">'.esc_textarea(get_post_meta($post->ID,'_aaai_public_message',true)).'</textarea></label></p>';
        echo '<p><label>Nota interna (nunca devolvida na consulta)<br><textarea name="aaai_internal_note" rows="4" class="widefat">'.esc_textarea(get_post_meta($post->ID,'_aaai_internal_note',true)).'</textarea></label></p>';
        echo '<p>O codigo de acesso nao e mostrado no painel. O titular deve guardar o comprovativo. Para pedidos sem codigo, valide a identidade pelos canais de atendimento.</p>';
    },'aaai_appointment','normal','high');
});
add_action('save_post_aaai_appointment',function ($id) {
    if (!current_user_can('manage_options') || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || wp_is_post_revision($id) || !isset($_POST['aaai_at_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['aaai_at_nonce'])),'aaai_at_save')) { return; }
    $state = isset($_POST['aaai_state']) ? sanitize_key(wp_unslash($_POST['aaai_state'])) : '';
    if (!array_key_exists($state,aaai_at_states())) { return; }
    $scheduled = isset($_POST['aaai_scheduled_at']) ? sanitize_text_field(wp_unslash($_POST['aaai_scheduled_at'])) : '';
    $valid_schedule = preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/D',$scheduled) && aaai_at_date(substr($scheduled,0,10)) && substr($scheduled,11,2)<='23' && substr($scheduled,14,2)<='59';
    if ($state==='scheduled' && !$valid_schedule) { set_transient('aaai_at_admin_error_'.get_current_user_id(),1,120); return; }
    $old = get_post_meta($id,'_aaai_state',true);
    update_post_meta($id,'_aaai_state',$state);
    update_post_meta($id,'_aaai_scheduled_at',$valid_schedule ? $scheduled : '');
    $public = isset($_POST['aaai_public_message']) ? sanitize_textarea_field(wp_unslash($_POST['aaai_public_message'])) : '';
    if (strlen($public)>4800) { $public=''; }
    update_post_meta($id,'_aaai_public_message',$public);
    update_post_meta($id,'_aaai_internal_note',isset($_POST['aaai_internal_note']) ? sanitize_textarea_field(wp_unslash($_POST['aaai_internal_note'])) : '');
    if ($old!==$state) { add_post_meta($id,'_aaai_history',['at'=>gmdate('c'),'from'=>$old,'to'=>$state,'user'=>get_current_user_id()]); }
});
add_filter('manage_aaai_appointment_posts_columns',function ($columns) { return ['cb'=>$columns['cb'],'title'=>'Referencia','aaai_state'=>'Estado','aaai_service'=>'Servico','aaai_date'=>'Data preferida','date'=>'Recebido em']; });
add_action('manage_aaai_appointment_posts_custom_column',function ($column,$id) {
    if ($column==='aaai_state') { echo esc_html(aaai_at_states()[get_post_meta($id,'_aaai_state',true)]??''); }
    if (in_array($column,['aaai_service','aaai_date'],true)) { echo esc_html(get_post_meta($id,'_'.$column,true)); }
},10,2);

add_action('admin_notices',function () {
 if (current_user_can('manage_options') && get_transient('aaai_at_admin_error_'.get_current_user_id())) {
  delete_transient('aaai_at_admin_error_'.get_current_user_id());
  echo '<div class="notice notice-error"><p>O estado nao foi alterado: para agendar, indique uma data/hora confirmada valida.</p></div>';
 }
});
