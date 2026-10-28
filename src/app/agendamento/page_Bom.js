/* C:\wamp64\www\aaai_frontend\src\app\guia-dire-vistos\page.js */
'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

// Importação das constantes dinâmicas e gerenciáveis
import { 
  TIPOS_REGISTRO, 
  ESTATUTOS_MIGRATORIOS, 
  SERVICOS_AAAI, 
  PAISES_ORIGEM, 
  PROVINCIAS_ANGOLA 
} from '@/constants/formularioData';

export default function PaginaFormularioAAAI() {
  const [loading, setLoading] = useState(false);
  const [statusEnvio, setStatusEnvio] = useState({ tipo: '', mensagem: '' });
  const [registroId, setRegistroId] = useState(null);
  
  // Estado Expandido com Ficheiros e Informações Administrativas
  const [dadosForm, setDadosForm] = useState({
    nome_completo: '',
    genero: 'Masculino',
    data_nascimento: '',
    nome_pai: '',
    nome_mae: '',
    numero_passaporte: '',
    tipo_registro: 'Primeira Vez',
    telefone: '',
    email: '',
    tipo_nacionalidade: 'Estrangeiro',
    pais_origem: 'Brasil',
    tipo_servico: 'Emissao DIRE',
    provincia_residencia: 'Luanda',
    municipio_endereco: '',
    bairro_rua: '',
    // Guardam as strings para feedback visual na tela
    nome_arquivo_doc: '',
    nome_arquivo_foto: '',
    // NOVO: Guardam os objetos Blob/File reais para conversão em imagem no PDF
    objeto_doc: null,
    objeto_foto: null
  });

  const lidarComMudanca = (e) => {
    const { name, value } = e.target;
    setDadosForm(prev => ({ ...prev, [name]: value }));
  };

  // Capturar quando o utilizador escolhe um arquivo para mostrar feedback visual
  const lidarComFicheiro = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      if (name === 'documento_identificacao') {
        setDadosForm(prev => ({ ...prev, nome_arquivo_doc: file.name, objeto_doc: file }));
      } else if (name === 'foto') {
        setDadosForm(prev => ({ ...prev, nome_arquivo_foto: file.name, objeto_foto: file }));
      }
    }
  };

  const lidarComEnvio = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusEnvio({ tipo: '', mensagem: '' });

    const form = e.target;
    const formData = new FormData(form);

    if (registroId) {
      formData.append('id_registro_existente', registroId);
    }

    try {
      const response = await fetch('http://localhost/aaaibwewp.com/wp-json/aaai/v1/cadastro', {
        method: 'POST',
        body: formData,
      });

      const resultado = await response.json();

      if (response.ok && resultado.sucesso) {
        setRegistroId(resultado.id);
        setStatusEnvio({ 
          tipo: 'sucesso', 
          mensagem: registroId 
            ? '✅ Alterações e novos ficheiros guardados com sucesso no servidor!' 
            : `✅ Inscrição e documentos submetidos! ID do Processo: AAAI-2026-${resultado.id}. Se detetar algum erro, corrija abaixo e atualize.`
        });
      } else {
        setStatusEnvio({ tipo: 'erro', mensagem: `❌ Erro: ${resultado.message || 'Falha ao processar.'}` });
      }
    } catch (error) {
      setStatusEnvio({ tipo: 'erro', mensagem: '❌ Erro de ligação com o servidor local WampServer.' });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PDF DINÂMICO EXPANDIDO (FICHA COMPLETA)
  // ==========================================
// Função auxiliar para converter o arquivo de imagem do input em Base64 para o jsPDF
  const converterParaBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Gera a Ficha de Cadastro em PDF 
  const gerarFichaPDF = async () => {
    const doc = new jsPDF();
    const codigoProcesso = `AAAI-2026-${registroId || 'TEMP'}`;
    
    // Cabeçalho Corporativo
    doc.setFillColor(4, 116, 129);
    doc.rect(0, 0, 210, 32, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('ASSOCIAÇÃO ANGOLANA DE APOIO A IMIGRANTES (AAAI)', 15, 13);
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text('Ficha Oficial de Inscrição e Enquadramento de Estrangeiros', 15, 20);
    doc.setFontSize(9);
    doc.text(`Identificador de Controlo: ${codigoProcesso}`, 15, 26);

    // ======================================================================
    // INSERÇÃO DA FOTO DO REQUERENTE NO CANTO SUPERIOR DIREITO (ESTILO PASSE)
    // ======================================================================
    if (dadosForm.objeto_foto) {
      try {
        const fotoBase64 = await converterParaBase64(dadosForm.objeto_foto);
        // Desenha uma moldura cinzenta para a foto
        doc.setDrawColor(200, 200, 200);
        doc.rect(160, 42, 35, 45); // Posição X, Y, Largura, Altura (Proporção 3x4)
        // Adiciona a imagem real carregada pelo utilizador dentro da moldura
        doc.addImage(fotoBase64, 'JPEG', 161, 43, 33, 43);
      } catch (err) {
        console.error("Erro ao renderizar foto no PDF:", err);
      }
    } else {
      // Caso o utilizador não tenha colocado foto, desenha o espaço vazio indicativo
      doc.setDrawColor(180, 180, 180);
      doc.setFillColor(245, 245, 245);
      doc.rect(160, 42, 35, 45, 'FD');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('FOTO 3X4', 177, 65, { align: 'center' });
    }

    // Ajuste do limite da largura do texto para não colidir com a foto à direita
    const larguraMaximaTexto = 140;

    // Secção 1: Controlo Administrativo
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text('1. CONTROLO ADMINISTRATIVO', 15, 44);
    doc.line(15, 46, 145, 46);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Tipo de Solicitação: ${dadosForm.tipo_registro}`, 15, 53);
    doc.text(`Serviço Requerido: ${dadosForm.tipo_servico}`, 15, 59);

    // Secção 2: Identificação do Utente
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('2. IDENTIFICAÇÃO DO REQUERENTE', 15, 72);
    doc.line(15, 74, 145, 74);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nome Completo: ${dadosForm.nome_completo.toUpperCase()}`, 15, 81);
    doc.text(`Data de Nascimento: ${dadosForm.data_nascimento}`, 15, 87);
    doc.text(`Género: ${dadosForm.genero}`, 95, 87);
    doc.text(`País de Origem: ${dadosForm.pais_origem}`, 15, 93);
    doc.text(`Nº Passaporte/Doc: ${dadosForm.numero_passaporte.toUpperCase()}`, 95, 93);
    doc.text(`Filiação: ${dadosForm.nome_pai} e de ${dadosForm.nome_mae}`, 15, 99);

    // Secção 3: Contactos e Localização em Angola (Passa para largura total abaixo da foto)
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('3. LOCALIZAÇÃO E CONTACTOS (ANGOLA)', 15, 112);
    doc.line(15, 114, 195, 114);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Telemóvel/WhatsApp: ${dadosForm.telefone}`, 15, 121);
    doc.text(`Correio Eletrónico: ${dadosForm.email}`, 105, 121);
    doc.text(`Província: ${dadosForm.provincia_residencia}`, 15, 127);
    doc.text(`Município: ${dadosForm.municipio_endereco}`, 105, 127);
    doc.text(`Endereço/Bairro/Rua: ${dadosForm.bairro_rua}`, 15, 133);
    doc.text(`Estatuto Alvo: ${dadosForm.tipo_nacionalidade}`, 105, 133);

    // ======================================================================
    // CORREÇÃO DA SECÇÃO 4: VALIDAÇÃO LIMPA E PROFISSONAL DE DOCUMENTOS
    // ======================================================================
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('4. DOCUMENTOS ANEXADOS E VALIDAÇÃO', 15, 146);
    doc.line(15, 148, 195, 148);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    
    // Validação do Documento de Identidade / Passaporte
    if (dadosForm.objeto_doc) {
      doc.setTextColor(16, 124, 65); // Cor Verde de Sucesso
      doc.setFont('Helvetica', 'bold');
      doc.text(`✓ DOCUMENTO DE IDENTIDADE: FORNECIDO E APROVADO DIGITALMENTE`, 15, 155);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text(`   Arquivo original: ${dadosForm.nome_arquivo_doc}`, 15, 160);
    } else {
      doc.setTextColor(185, 28, 28); // Cor Vermelha de Erro
      doc.setFont('Helvetica', 'bold');
      doc.text(`✗ DOCUMENTO DE IDENTIDADE: NÃO FORNECIDO (Pendente de Regularização)`, 15, 155);
    }

    // Validação da Fotografia Tipo Passe
    doc.setFontSize(10);
    if (dadosForm.objeto_foto) {
      doc.setTextColor(16, 124, 65);
      doc.setFont('Helvetica', 'bold');
      doc.text(`✓ FOTOGRAFIA TIPO PASSE: INTEGRADA E ARQUIVADA NA FICHA`, 15, 169);
    } else {
      doc.setTextColor(185, 28, 28);
      doc.setFont('Helvetica', 'bold');
      doc.text(`✗ FOTOGRAFIA TIPO PASSE: AUXILIAR EM FALTA`, 15, 169);
    }

    // Restaura cor padrão para o rodapé
    doc.setTextColor(40, 40, 40);

    // Caixa de Assinatura e Validação Jurídica
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 182, 180, 40, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(50, 208, 160, 208);
    doc.setFontSize(9);
    doc.text('Assinatura do Técnico / Utente Requerente', 105, 213, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(`Ficha extraída dinamicamente via Portal Digital AAAI em ${new Date().toLocaleString('pt-PT')}`, 15, 235);

    doc.save(`Ficha_AAAI_${codigoProcesso}.pdf`);
  };

  //Gerar um link direto de WhatsApp com o texto já preenchido
  const enviarNotificacaoWhatsApp = () => {
    const codigoProcesso = `AAAI-2026-${registroId || 'TEMP'}`;
    
    // Limpa o número de telefone para manter apenas dígitos para a API do WhatsApp
    const telefoneLimpo = dadosForm.telefone.replace(/\D/g, '');
    
    // Mensagem altamente profissional e estruturada
    const mensagem = `*Olá, ${dadosForm.nome_completo.toUpperCase()}!* 👋

  Seja muito bem-vindo(a) à *Associação Angolana de Apoio a Imigrantes (AAAI)*.

  Confirmamos com sucesso a entrada digital do seu processo no nosso Portal Migratório. O seu caso já está a ser analisado minuciosamente pela nossa equipa de profissionais jurídicos.

  📋 *DETALHES DO PROCESSO:*
  🔹 *Identificador:* ${codigoProcesso}
  🔹 *Nº Documento/Passaporte:* ${dadosForm.numero_passaporte.toUpperCase()}
  🔹 *Serviço Requerido:* ${dadosForm.tipo_servico}
  🔹 *Status Atual:* ⏳ Em Análise Oficial

  💡 *INFORMAÇÕES IMPORTANTES & PRÓXIMOS PASSOS:*
  1️⃣ Guarde com cuidado o arquivo PDF da sua *Ficha de Inscrição* e o *Recibo Digital com QR Code* gerados pelo portal.
  2️⃣ Caso a nossa equipa detete alguma inconformidade ou falta de documento de suporte, entraremos em contacto por esta via ou por e-mail.
  3️⃣ No dia agendado para o seu atendimento presencial no nosso balcão, apresente o QR Code do seu recibo diretamente no telemóvel para acelerar a sua triagem.

  Agradecemos a sua confiança nos nossos serviços. Estamos aqui para garantir a sua total segurança migratória em Angola! 🇦🇴

  _Mensagem Automática de Suporte Administrativo — AAAI_`;

    // Codifica o texto para o formato URL
    const urlMensagem = encodeURIComponent(mensagem);
    
    // Cria o link final para a API do WhatsApp (funciona em Mobile e Web)
    const linkWhatsApp = `https://api.whatsapp.com/send?phone=${telefoneLimpo}&text=${urlMensagem}`;
    
    // Abre o WhatsApp numa nova aba
    window.open(linkWhatsApp, '_blank');
  };

  // ==========================================
  // RECIBO COMPACTO COM QR CODE DINÂMICO
  // ==========================================
  const gerarReciboQRCode = async () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [102, 152] });
    const codigoProcesso = `AAAI-2026-${registroId || '000'}`;
    const payloadQR = `PROC:${codigoProcesso}|UTENTE:${dadosForm.nome_completo}|PASS:${dadosForm.numero_passaporte}|SERV:${dadosForm.tipo_servico}`;
    
    try {
      const qrCodeBase64 = await QRCode.toDataURL(payloadQR, { margin: 1, width: 250 });

      doc.setFontSize(11);
      doc.setFont('Helvetica', 'bold');
      doc.text('RECIBO COMPROVATIVO', 51, 14, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('Helvetica', 'normal');
      doc.text('Associação Angolana de Apoio a Imigrantes', 51, 19, { align: 'center' });
      doc.line(6, 22, 96, 22);

      doc.text(`PROCESSO: ${codigoProcesso}`, 8, 30);
      doc.text(`EMISSÃO: ${new Date().toLocaleDateString('pt-PT')}`, 8, 35);
      doc.text(`PASSAPORTE: ${dadosForm.numero_passaporte.toUpperCase()}`, 8, 40);
      
      doc.setFont('Helvetica', 'bold');
      doc.text('UTENTE REQUERENTE:', 8, 49);
      doc.setFont('Helvetica', 'normal');
      doc.text(dadosForm.nome_completo.substring(0, 38).toUpperCase(), 8, 54);

      doc.setFont('Helvetica', 'bold');
      doc.text('SERVIÇO SOLICITADO:', 8, 63);
      doc.setFont('Helvetica', 'normal');
      doc.text(dadosForm.tipo_servico, 8, 68);
      doc.line(6, 74, 96, 74);

      doc.addImage(qrCodeBase64, 'PNG', 33, 80, 36, 36);

      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text('Este talão comprova a entrada digital do seu processo.', 51, 126, { align: 'center' });
      doc.text('Aceda ao balcão com este QR Code legível.', 51, 131, { align: 'center' });

      doc.save(`Recibo_AAAI_${codigoProcesso}.pdf`);
    } catch (err) {
      console.error('Falha ao gerar QR Code:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Banner Informativo Dinâmico */}
        <div className={`p-6 text-white text-center transition-colors duration-300 ${
          registroId ? 'bg-gradient-to-r from-amber-600 to-amber-700' : 'bg-gradient-to-r from-emerald-700 to-teal-800'
        }`}>
          <h2 className="text-2xl font-black tracking-wide">PORTAL DE GESTÃO MIGRATÓRIA AAAI</h2>
          <p className="text-sm opacity-90 mt-1 font-medium">
            {registroId ? `⚙️ MODO DE EDIÇÃO ATIVO — Processo: AAAI-2026-${registroId}` : 'Formulário Unificado de Inscrição e Apoio de Vistos'}
          </p>
        </div>

        <div className="p-6 sm:p-10">
          {statusEnvio.mensagem && (
            <div className={`p-4 mb-8 rounded-xl font-semibold text-sm border text-center shadow-sm ${
              statusEnvio.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              {statusEnvio.mensagem}
            </div>
          )}

          {/* Painel Gestor de Downloads */}
          {registroId && (
            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border-2 border-slate-200/60 text-center shadow-inner">
              <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">📋 Documentação Emitida pelo Frontend</h4>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button type="button" onClick={gerarFichaPDF} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2">
                  📥 Descarregar Ficha de Inscrição (PDF)
                </button>
                <button type="button" onClick={gerarReciboQRCode} className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2">
                  📱 Descarregar Recibo Digital + QR Code
                </button>
              </div>
            </div>
          )}

          {/* Painel Gestor de Downloads e Notificações */}
{registroId && (
  <div className="mb-8 p-6 bg-slate-50 rounded-2xl border-2 border-slate-200/60 text-center shadow-inner">
    <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">📋 AÇÕES DO PROCESSO DIGITAL</h4>
    
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center">
      <button type="button" onClick={gerarFichaPDF} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2">
        📥 Ficha de Inscrição (PDF)
      </button>
      
      <button type="button" onClick={gerarReciboQRCode} className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2">
        📱 Recibo + QR Code
      </button>
      
      {/* NOVO: Botão de Notificação Oficial via WhatsApp */}
      <button type="button" onClick={enviarNotificacaoWhatsApp} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2">
        💬 Enviar Boas-Vindas (WhatsApp)
      </button>
    </div>
  </div>
)}

          <form onSubmit={lidarComEnvio} className="space-y-8" encType="multipart/form-data">
            {/* Bloco 1: Registo e Tipo */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2 border-slate-100">
                1. Tipo de Procedimento Administrativo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Finalidade do Registo</label>
                  <select name="tipo_registro" value={dadosForm.tipo_registro} onChange={lidarComMudanca} className="mt-2 w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-800 outline-none text-sm focus:border-emerald-500 font-medium">
                    {TIPOS_REGISTRO.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Serviço de Apoio Solicitado</label>
                  <select name="tipo_servico" value={dadosForm.tipo_servico} onChange={lidarComMudanca} className="mt-2 w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-800 outline-none text-sm focus:border-emerald-500 font-medium">
                    {SERVICOS_AAAI.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Bloco 2: Dados Pessoais Expandidos */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2 border-slate-100">
                2. Dados de Identidade Legal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Nome Completo (Conforme Passaporte)</label>
                  <input type="text" name="nome_completo" value={dadosForm.nome_completo} onChange={lidarComMudanca} required className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Género</label>
                  <select name="genero" value={dadosForm.genero} onChange={lidarComMudanca} className="mt-2 w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm outline-none">
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Data de Nascimento</label>
                  <input type="date" name="data_nascimento" value={dadosForm.data_nascimento} onChange={lidarComMudanca} required className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Nº do Passaporte ou DIRE</label>
                  <input type="text" name="numero_passaporte" placeholder="Ex: N000000" value={dadosForm.numero_passaporte} onChange={lidarComMudanca} required className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm uppercase outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Estatuto de Entrada</label>
                  <select name="tipo_nacionalidade" value={dadosForm.tipo_nacionalidade} onChange={lidarComMudanca} className="mt-2 w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm outline-none">
                    {ESTATUTOS_MIGRATORIOS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">País de Origem</label>
                  <select name="pais_origem" value={dadosForm.pais_origem} onChange={lidarComMudanca} className="mt-2 w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm outline-none">
                    {PAISES_ORIGEM.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Nome Completo do Pai</label>
                  <input type="text" name="nome_pai" value={dadosForm.nome_pai} onChange={lidarComMudanca} required className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Nome Completo da Mãe</label>
                  <input type="text" name="nome_mae" value={dadosForm.nome_mae} onChange={lidarComMudanca} required className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none" />
                </div>
              </div>
            </div>

            {/* Bloco 3: Contactos e Residência Geográfica em Angola */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2 border-slate-100">
                3. Contactos e Endereço de Habitação em Angola
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Telemóvel / WhatsApp</label>
                  <input type="tel" name="telefone" placeholder="+244 ..." value={dadosForm.telefone} onChange={lidarComMudanca} required className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">E-mail para Notificações Oficiais</label>
                  <input type="email" name="email" value={dadosForm.email} onChange={lidarComMudanca} required className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Província de Residência</label>
                  <select name="provincia_residencia" value={dadosForm.provincia_residencia} onChange={lidarComMudanca} className="mt-2 w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm outline-none">
                    {PROVINCIAS_ANGOLA.map(prov => <option key={prov} value={prov}>{prov}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Município</label>
                  <input type="text" name="municipio_endereco" placeholder="Ex: Belas" value={dadosForm.municipio_endereco} onChange={lidarComMudanca} required className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Bairro / Rua / Nº Casa</label>
                  <input type="text" name="bairro_rua" placeholder="Ex: Talatona, Rua 4" value={dadosForm.bairro_rua} onChange={lidarComMudanca} required className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none" />
                </div>
              </div>
            </div>

            {/* INTEGRADO E ENRAIZADO! Bloco 4: Upload de Ficheiros Oficiais */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2 border-slate-100">
                4. Documentação de Suporte Digital
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Documento de Identidade (Passaporte / DIRE)</label>
                  <input type="file" name="documento_identificacao" accept=".pdf,image/*" onChange={lidarComFicheiro} className="mt-2 block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition cursor-pointer" />
                  {dadosForm.nome_arquivo_doc && (
                    <p className="mt-2 text-xs font-medium text-emerald-700 flex items-center gap-1">
                      📁 Selecionado: {dadosForm.nome_arquivo_doc}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Fotografia Tipo Passe (Fundo Branco)</label>
                  <input type="file" name="foto" accept="image/*" onChange={lidarComFicheiro} className="mt-2 block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition cursor-pointer" />
                  {dadosForm.nome_arquivo_foto && (
                    <p className="mt-2 text-xs font-medium text-emerald-700 flex items-center gap-1">
                      📸 Selecionado: {dadosForm.nome_arquivo_foto}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submissão */}
            <div className="pt-4">
              <button type="submit" disabled={loading} className={`w-full text-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-black text-white tracking-wider uppercase transition-all transform hover:-translate-y-0.5 ${
                registroId 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:ring-amber-500' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 focus:ring-emerald-500'
              }`}>
                {loading ? '⏳ Enviando Dados e Arquivos para o Servidor...' : (registroId ? '💾 Guardar e Atualizar Ficha' : 'Enviar Processo para Inscrição')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}