# AAAI Portal — v0.7.0: gestão de pedidos de atendimento

Esta fase acrescenta registo persistente de pedidos, gestão no WordPress e consulta com referência/código. Mantém o layout v0.6.0 aprovado. O catálogo institucional continua no plugin `aaai-content` v0.3.1; não o substitui.

## Instalação

1. Mantenha o WAMP disponível e pare `npm run dev` com Ctrl+C.
2. Descarregue e execute `ACTUALIZAR_AAAI_v070_COMPLETO.cmd` com duplo clique. Não precisa extrair nem reutilizar pastas de actualizações anteriores.
3. O actualizador verifica o pacote, simula, verifica processos/ficheiros bloqueados e aplica o frontend e o módulo WordPress. A seguir instala dependências, compila e diagnostica a API. Uma falha interrompe a sequência.
4. Depois do sucesso, abra o PowerShell na pasta frontend e execute `npm.cmd run dev`.

Destinos predefinidos:

- Frontend: `C:\wamp64\www\aaai-portal-v1\frontend`
- WordPress: `C:\wamp64\www\aaai-portal-v1\wordpress`

Requer a v0.6.0 ou a v0.7.0 do frontend. A instalação verifica a existência do WordPress antes de alterar ficheiros. Não altera o `wp-config.php` nem instala uma nova versão do WordPress.

A chave servidor-a-servidor é gerada localmente e fica no `.env.local` e num ficheiro PHP reservado do módulo. Não vem incluída neste pacote, não aparece no ecrã e não usa variáveis `NEXT_PUBLIC_`. Uma chave existente é preservada; se houver divergência entre frontend e WordPress, a instalação pára antes de alterar ficheiros.

Os backups da v0.7.0 ficam em `%USERPROFILE%\AAAI_Backups`, fora da pasta publicada pelo WAMP. Contêm os ficheiros substituídos e um `restore-map.json`. Guarde-os em local privado. A protecção Apache dos ficheiros `.env*` é acrescentada ao `.htaccess` do frontend sem apagar regras existentes; depende de o Apache permitir esse ficheiro de configuração. O Next.js não publica esses ficheiros.

O novo módulo é instalado em `wp-content/mu-plugins/aaai-atendimento.php` e carregado automaticamente pelo WordPress: não existe uma etapa manual de activação. A configuração privada fica na subpasta `mu-plugins/aaai-atendimento/secret.php`. Não partilhe esse ficheiro nem o `.env.local`.

Para caminhos diferentes, extraia o ZIP de código numa pasta separada e execute cada comando apenas depois do anterior concluir com sucesso:

```powershell
node .\scripts\install-v070.mjs --project 'D:\projecto\frontend' --wordpress 'D:\projecto\wordpress' --dry-run
node .\scripts\install-v070.mjs --project 'D:\projecto\frontend' --wordpress 'D:\projecto\wordpress'
cd D:\projecto\frontend
npm.cmd ci
npm.cmd run verify
npm.cmd run diagnose
npm.cmd run dev
```

Se o código compilar mas o diagnóstico falhar, confirme WAMP, URL da API e as mensagens indicadas; não precisa reinstalar as dependências para repetir `npm.cmd run diagnose`. Uma variável `AAAI_ATENDIMENTO_API_KEY` declarada mas vazia deve ser removida do `.env.local` antes de repetir o actualizador. Não invente uma chave diferente no frontend e no WordPress.

## Experiência do utilizador

Em `/pt/agendar`, o utilizador preenche nome, e-mail, telefone opcional, serviço, data/período preferidos e observações. É obrigatório autorizar a utilização desses dados para gerir o pedido. Não são recebidos anexos.

Ao enviar, o pedido é guardado na base de dados do WordPress. A resposta mostra uma referência aleatória e um código de acesso; o utilizador pode guardar um comprovativo `.txt`. O registo do pedido não confirma automaticamente o horário. A repetição do mesmo envio, com a mesma chave técnica e os mesmos dados, devolve o mesmo comprovativo sem criar outro registo.

Em `/pt/consultar-processo`, o utilizador introduz referência e código. A consulta mostra apenas estado, data/hora confirmada quando agendado e mensagem pública da equipa. Não revela nome, e-mail, telefone, observações originais ou notas internas. Referências antigas sem código continuam a ser acompanhadas pelos canais de contacto.

O código é apresentado no comprovativo e não é mostrado ao administrador. Não há recuperação automática de código nesta fase. Pedidos sem comprovativo exigem contacto com a equipa e verificação de identidade fora desta consulta.

As páginas continuam disponíveis em PT, EN, FR e ES. `/pt/privacidade` explica o tratamento que o módulo faz dos dados; não contém declarações de certificação ou conformidade legal.

## Gestão no WordPress

1. Entre com uma conta de administrador no WordPress.
2. Abra **Atendimentos AAAI** no menu lateral.
3. Abra a referência do pedido. Os dados de contacto, serviço, preferência, idioma e observações aparecem no painel.
4. Escolha um estado: Recebido, Em análise, Agendado, Em atendimento, Concluído ou Cancelado.
5. Para marcar **Agendado**, preencha uma data/hora confirmada válida. A hora indicada é de Angola (UTC+1).
6. Escreva a mensagem que o titular deve ver no campo **Mensagem visível ao titular**. Use **Nota interna** para informação reservada.
7. Clique **Actualizar**. O titular vê o novo estado na próxima consulta com o seu código.

Uma alteração de estado fica registada no histórico interno com utilizador e data. O módulo é reservado a administradores (`manage_options`); não foram criadas novas contas ou permissões para membros. O WordPress controla o acesso ao painel. Os pedidos não são listados pela REST API pública padrão e o tipo de conteúdo não é público.

## API e verificações

O Next.js recebe os pedidos em `POST /api/appointments` e as consultas em `POST /api/appointments/lookup`, valida os campos e encaminha-os para `aaai-atendimento/v1` com a chave privada. As respostas destes endpoints usam `Cache-Control: no-store`. O código de acesso viaja no corpo do POST, não no endereço da página.

O diagnóstico continua a verificar o catálogo e acrescenta o teste autenticado de `aaai-atendimento/v1/health` quando a chave está configurada. Não imprime a chave nem dados dos pedidos.

A API limita tentativas com contadores WordPress: 120 novos pedidos e 600 consultas por intervalo de inactividade de 10 minutos, globalmente para o módulo. São limites básicos; não substituem protecção de tráfego no alojamento nem constituem garantia contra abuso concorrente. O formulário ainda não inclui CAPTCHA.

## Limites desta fase

- Gestão de pedidos com preferência de data; não há calendário de vagas, reserva automática de horários ou prevenção automática de sobreposição de agendamentos confirmados pelo administrador.
- Não envia e-mails, SMS ou WhatsApp automaticamente. A equipa pode responder manualmente ou publicar uma mensagem na consulta.
- Não cria autenticação de associados; essa área mantém a ligação/página de apoio da v0.6.0.
- Os registos são eliminados manualmente no WordPress; não há prazo automático de retenção.
- Guarde em conjunto a base de dados, a configuração privada e o `wp-config.php` nos seus backups. A alteração dos salts WordPress invalida os códigos existentes.
- A validação desta entrega não substitui o teste na instalação WAMP e com as contas reais da AAAI.

Veja `REVISAO_v070.md` para a evidência de validação.
