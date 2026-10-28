import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req) {
  try {
    // Captura como FormData para ler arquivos binários de upload
    const formData = await req.formData();
    
    const nome = formData.get("nome");
    const email = formData.get("email");
    const telefone = formData.get("telefone");
    const nacionalidade = formData.get("nacionalidade");
    const documento = formData.get("documento");
    const servico = formData.get("servico");
    const atendimento = formData.get("atendimento");
    const assunto = formData.get("assunto");
    const mensagem = formData.get("mensagem");
    
    // Lista de arquivos extraídos do input "anexos"
    const files = formData.getAll("anexos");

    console.log(`NOVA SOLICITAÇÃO RECEBIDA DE: ${nome} - Ficheiros anexados: ${files.length}`);

    // ==========================================
    // PASSO A: REPASSO PARA O WORDPRESS
    // ==========================================
    let wordpressSucesso = false;
    let wpStatus = 500;
    
    try {
      // Usamos multipart/form-data no fetch do WordPress para levar os ficheiros também
      const wpRes = await fetch("http://localhost/aaaibwewp.com/wp-json/aaai/v1/atendimento", {
        method: "POST",
        body: formData, // Repassa o FormData completo (contendo texto + ficheiros)
      });

      wpStatus = wpRes.status;
      const wpResult = await wpRes.json();
      
      if (wpRes.ok && wpResult.success) {
        wordpressSucesso = true;
      } else {
        console.error("Erro retornado pelo WordPress:", wpResult);
      }
    } catch (wpError) {
      console.error("Falha de conexão com a API do WordPress:", wpError.message);
    }

    // ==========================================
    // PASSO B: ENVIO DE EMAIL VIA RESEND COM ANEXOS
    // ==========================================
    let emailSucesso = false;
    
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      // Mapeia os arquivos para o formato aceito pela API do Resend
      const emailAttachments = [];
      for (const file of files) {
        if (file instanceof File && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          emailAttachments.push({
            content: buffer,
            filename: file.name,
          });
        }
      }

      await resend.emails.send({
        from: "AAAI <geral@apoioimigrantes.com>",
        to: "contacto@apoioimigrantes.com",
        subject: `Novo pedido: ${servico} - ${assunto}`,
        attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
        html: `
          <h2>Novo Pedido de Atendimento</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${telefone}</p>
          <p><strong>Nacionalidade:</strong> ${nacionalidade}</p>
          <p><strong>Documento:</strong> ${documento}</p>
          <p><strong>Serviço:</strong> ${servico}</p>
          <p><strong>Tipo de Atendimento:</strong> ${atendimento}</p>
          <p><strong>Assunto:</strong> ${assunto}</p>
          <hr>
          <p><strong>Mensagem:</strong></p>
          <p>${mensagem ? mensagem.replace(/\n/g, '<br>') : ""}</p> 
          ${emailAttachments.length > 0 ? `<p style='color:green;'><strong>Nota:</strong> Este e-mail contém ${emailAttachments.length} anexo(s).</p>` : ""}
        `,
      });
      
      emailSucesso = true;
    } catch (emailError) {
      console.error("Falha ao disparar e-mail via Resend:", emailError.message);
    }

    if (wordpressSucesso) {
      return NextResponse.json({
        success: true,
        message: "Processado com sucesso!",
        emailEnviado: emailSucesso
      }, { status: 200 });
    } 
    
    return NextResponse.json({
      success: false,
      message: "Falha ao gravar no painel administrativo.",
      wordpressSalvo: wordpressSucesso,
      emailEnviado: emailSucesso
    }, { status: wpStatus });

  } catch (error) {
    console.error("Erro geral na API Route:", error);
    return NextResponse.json({ success: false, message: "Erro interno no servidor.", error: error.message }, { status: 500 });
  }
}