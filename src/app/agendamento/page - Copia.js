'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export default function PaginaFormularioAAAI() {
  const [loading, setLoading] = useState(false);
  const [statusEnvio, setStatusEnvio] = useState({ tipo: '', mensagem: '' });
  
  // Estados para controlo de Edição e Documentos
  const [registroId, setRegistroId] = useState(null);
  const [dadosForm, setDadosForm] = useState({
    nome_completo: '',
    data_nascimento: '',
    tipo_registro: 'Primeira Vez',
    telefone: '',
    email: '',
    tipo_nacionalidade: 'Estrangeiro',
    pais_origem: '',
    tipo_servico: 'Emissao DIRE'
  });

  // Atualizar o estado local quando o utilizador digita
  const lidarComMudanca = (e) => {
    const { name, value } = e.target;
    setDadosForm(prev => ({ ...prev, [name]: value }));
  };

  const lidarComEnvio = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    setStatusEnvio({ tipo: '', mensagem: '' });

    const form = e.target;
    const formData = new FormData(form);

    // Se já temos um ID, enviamos para o WordPress saber que é uma atualização
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
        setRegistroId(resultado.id); // Guarda o ID retornado pelo WP
        setStatusEnvio({ 
          tipo: 'sucesso', 
          mensagem: registroId 
            ? '✅ Dados atualizados com sucesso no painel administrativo!' 
            : `✅ Inscrição efetuada com sucesso! Código do Processo: AAAI-2026-${resultado.id}. Se detetar algum erro, pode corrigir os campos abaixo e submeter novamente.`
        });
      } else {
        setStatusEnvio({ 
          tipo: 'erro', 
          mensagem: `❌ Erro: ${resultado.message || 'Falha ao processar.'}` 
        });
      }
    } catch (error) {
      setStatusEnvio({ 
          tipo: 'erro', 
          mensagem: '❌ Erro de conexão com o servidor local Apache/WampServer.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FUNÇÃO A: GERAR FICHA DE INSCRIÇÃO EM PDF
  // ==========================================
  const gerarFichaPDF = () => {
    const doc = new jsPDF();
    
    // Cabeçalho Institucional
    doc.setFillColor(4, 116, 129); // Cor Emerald do tema
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('headline', 'bold');
    doc.setFontSize(14);
    doc.text('ASSOCIAÇÃO ANGOLANA DE APOIO A IMIGRANTES (AAAI)', 15, 14);
    doc.setFontSize(10);
    doc.setFont('headline', 'normal');
    doc.text('Ficha Oficial de Inscrição de Requerente — Via de Arquivo', 15, 22);

    // Corpo do PDF
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont('headline', 'bold');
    doc.text('DADOS DO PROCESSO', 15, 45);
    doc.line(15, 47, 195, 47);

    doc.setFont('headline', 'normal');
    doc.text(`Código Único do Processo: AAAI-2026-${registroId || 'TEMP'}`, 15, 55);
    doc.text(`Tipo de Inscrição: ${dadosForm.tipo_registro}`, 15, 62);
    doc.text(`Serviço Solicitado: ${dadosForm.tipo_servico}`, 15, 69);

    doc.setFont('headline', 'bold');
    doc.text('INFORMAÇÕES INICIAIS DO UTENTE', 15, 85);
    doc.line(15, 87, 195, 87);

    doc.setFont('headline', 'normal');
    doc.text(`Nome Completo: ${dadosForm.nome_completo}`, 15, 95);
    doc.text(`Data de Nascimento: ${dadosForm.data_nascimento}`, 15, 102);
    doc.text(`Nacionalidade/Estatuto: ${dadosForm.tipo_nacionalidade}`, 15, 109);
    doc.text(`País de Origem: ${dadosForm.pais_origem}`, 15, 116);

    doc.setFont('headline', 'bold');
    doc.text('CONTACTOS OFICIAIS', 15, 132);
    doc.line(15, 134, 195, 134);

    doc.setFont('headline', 'normal');
    doc.text(`Telemóvel / WhatsApp: ${dadosForm.telefone}`, 15, 142);
    doc.text(`E-mail de Registo: ${dadosForm.email}`, 15, 149);

    // Rodapé de Validação
    doc.setFillColor(245, 247, 250);
    doc.rect(15, 170, 180, 25, 'F');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Nota: Este documento é uma cópia digital da ficha submetida eletronicamente.', 20, 178);
    doc.text('A veracidade dos dados anexados será validada pela equipa jurídica da AAAI.', 20, 184);

    doc.save(`Ficha_Inscricao_AAAI_${dadosForm.nome_completo.replace(/\s+/g, '_')}.pdf`);
  };

  // ==========================================
  // FUNÇÃO B: GERAR RECIBO OFICIAL COM QR CODE
  // ==========================================
  const gerarReciboQRCode = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150] // Tamanho compacto estilo recibo/talão
    });

    const codigoProcesso = `AAAI-2026-${registroId || '000'}`;
    
    // Conteúdo em texto do QR Code
    const dadosQRCodeTexto = `Processo: ${codigoProcesso}\nUtente: ${dadosForm.nome_completo}\nServiço: ${dadosForm.tipo_servico}\nValidação: Sistema Interno AAAI`;
    
    try {
      // Gerar a imagem Base64 do QR Code a partir do texto
      const qrCodeBase64 = await QRCode.toDataURL(dadosQRCodeTexto, { margin: 1, width: 200 });

      // Desenhar o Recibo
      doc.setFontSize(10);
      doc.setFont('coupon', 'bold');
      doc.text('RECIBO DE INSCRIÇÃO', 50, 15, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('coupon', 'normal');
      doc.text('Associação Angolana de Apoio a Imigrantes', 50, 20, { align: 'center' });
      doc.line(5, 23, 95, 23);

      doc.text(`CÓDIGO: ${codigoProcesso}`, 10, 32);
      doc.text(`DATA: ${new Date().toLocaleDateString('pt-PT')}`, 10, 38);
      
      doc.setFont('coupon', 'bold');
      doc.text('REQUERENTE:', 10, 48);
      doc.setFont('coupon', 'normal');
      doc.text(dadosForm.nome_completo.substring(0, 35), 10, 53);

      doc.setFont('coupon', 'bold');
      doc.text('SERVIÇO:', 10, 63);
      doc.setFont('coupon', 'normal');
      doc.text(dadosForm.tipo_servico, 10, 68);
      doc.line(5, 75, 95, 75);

      // Inserir o QR Code gerado no centro do recibo
      doc.addImage(qrCodeBase64, 'PNG', 32, 82, 36, 36);

      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text('Apresente este QR Code no ato do atendimento.', 50, 128, { align: 'center' });
      doc.text('Obrigado pela sua cooperação.', 50, 133, { align: 'center' });

      doc.save(`Recibo_AAAI_${codigoProcesso}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
        
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white text-center">
          <h2 className="text-2xl font-bold tracking-wide">ASSOCIAÇÃO ANGOLANA DE APOIO A IMIGRANTES</h2>
          <p className="text-emerald-100 text-sm mt-1">
            {registroId ? '⚙️ Modo de Edição Ativo (A aperfeiçoar dados)' : 'Ficha Oficial de Inscrição — Guia do DIRE e Vistos'}
          </p>
        </div>

        <div className="p-8">
          {statusEnvio.mensagem && (
            <div className={`p-4 mb-6 rounded-lg font-medium text-sm border text-center ${
              statusEnvio.tipo === 'sucesso' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {statusEnvio.mensagem}
            </div>
          )}

          {/* PAINEL DE DOWNLOADS: Aparece apenas após a submissão com sucesso */}
          {registroId && (
            <div className="mb-8 p-5 bg-slate-50 rounded-xl border border-slate-200 text-center animate-fade-in">
              <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">🌟 Documentos Disponíveis para Download</h4>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button type="button" onClick={gerarFichaPDF} className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow transition flex items-center justify-center gap-2">
                  📥 Descarregar Ficha Completa (PDF)
                </button>
                <button type="button" onClick={gerarReciboQRCode} className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow transition flex items-center justify-center gap-2">
                  📱 Descarregar Recibo com QR Code
                </button>
              </div>
            </div>
          )}

          <form onSubmit={lidarComEnvio} className="space-y-6" encType="multipart/form-data">
            
            {/* Bloco 1: Informações Pessoais */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 border-b pb-1 border-slate-100">
                1. Identificação Pessoal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700">Nome Completo</label>
                  <input type="text" name="nome_completo" value={dadosForm.nome_completo} onChange={lidarComMudanca} required className="mt-1 w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-800 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Data de Nascimento</label>
                  <input type="date" name="data_nascimento" value={dadosForm.data_nascimento} onChange={lidarComMudanca} required className="mt-1 w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-800 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Tipo de Registo</label>
                  <select name="tipo_registro" value={dadosForm.tipo_registro} onChange={lidarComMudanca} required className="mt-1 w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 outline-none">
                    <option value="Primeira Vez">Primeiro Registo / Inscrição</option>
                    <option value="Renovacao">Renovação de Processo</option>
                    <option value="Atualizacao">Atualização de Dados</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bloco 2: Contacto e Comunicação */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 border-b pb-1 border-slate-100">
                2. Canais de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Telemóvel / WhatsApp</label>
                  <input type="tel" name="telefone" placeholder="+244 ..." value={dadosForm.telefone} onChange={lidarComMudanca} required className="mt-1 w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-800 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Correio Eletrónico (E-mail)</label>
                  <input type="email" name="email" value={dadosForm.email} onChange={lidarComMudanca} required className="mt-1 w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-800 outline-none" />
                </div>
              </div>
            </div>

            {/* Bloco 3: Nacionalidade e Intenção */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 border-b pb-1 border-slate-100">
                3. Enquadramento Migratório
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Estatuto Atual</label>
                  <select name="tipo_nacionalidade" value={dadosForm.tipo_nacionalidade} onChange={lidarComMudanca} required className="mt-1 w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 outline-none">
                    <option value="Estrangeiro">Cidadão Estrangeiro</option>
                    <option value="Imigrante">Imigrante Residente</option>
                    <option value="Asilado/Refugiado">Requerente de Asilo / Refugiado</option>
                    <option value="Nacional">Cidadão Nacional (Apoio)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">País de Origem</label>
                  <input type="text" name="pais_origem" placeholder="Ex: Brasil" value={dadosForm.pais_origem} onChange={lidarComMudanca} required className="mt-1 w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-800 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Serviço Pretendido</label>
                  <select name="tipo_servico" value={dadosForm.tipo_servico} onChange={lidarComMudanca} required className="mt-1 w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 outline-none">
                    <option value="Emissao DIRE">Emissão de DIRE</option>
                    <option value="Renovacao DIRE">Renovação de DIRE</option>
                    <option value="Visto de Trabalho">Prorrogação de Visto de Trabalho</option>
                    <option value="Visto de Residencia">Visto de Residência</option>
                    <option value="Apoio Juridico">Consultoria / Apoio Jurídico</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bloco 4: Arquivos Digitais */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 border-b pb-1 border-slate-100">
                4. Upload de Documentos Oficiais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Documento de Identidade (Passaporte / DIRE)</label>
                  <input type="file" name="documento_identificacao" accept=".pdf,image/*" className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition cursor-pointer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Fotografia Tipo Passe (Fundo Branco)</label>
                  <input type="file" name="foto" accept="image/*" className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Botão de Submissão Dinâmico */}
            <div className="pt-2">
              <button type="submit" disabled={loading} className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md text-base font-bold text-white transition-all transform hover:-translate-y-0.5 ${
                registroId 
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 focus:ring-amber-500' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 focus:ring-emerald-500'
              }`}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    A processar dados...
                  </span>
                ) : (
                  registroId ? '💾 Atualizar Informações da Ficha' : 'Submeter Inscrição para Análise'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}