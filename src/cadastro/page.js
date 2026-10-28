/* C:\wamp64\www\aaai_frontend\src\cadastro/page.js*/
'use client';

import { useState } from 'react';

export default function FormularioAAAI() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [registroId, setRegistroId] = useState(null);
  const [dadosRetorno, setDadosRetorno] = useState(null);

  const lidarComEnvio = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    setMensagem('');
    setRegistroId(null);
    setDadosRetorno(null);

    const form = e.target;
    const formData = new FormData(form);

    // DEBUG: Ver o que está sendo enviado
    console.log('📝 Campos do Formulário:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    try {
      const response = await fetch('http://localhost/aaaibwewp.com/wp-json/aaai/v1/cadastro', {
        method: 'POST',
        body: formData,
      });

      const resultado = await response.json();

      if (response.ok && resultado.sucesso) {
        setMensagem('✅ Perfeito! Dados integrados com sucesso no painel.');
        setRegistroId(resultado.id_pedido);
        setDadosRetorno(resultado);
        console.log('✅ Sucesso:', resultado);
        // Não resetar o formulário para o usuário ver os dados
      } else {
        setMensagem(`❌ Erro: ${resultado.message || 'Falha no processamento'}`);
        console.error('❌ Erro:', resultado);
      }
    } catch (error) {
      setMensagem('❌ Erro de rede. Verifica o teu WampServer.');
      console.error('❌ Erro de rede:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funções para os botões
  const gerarFichaPDF = () => {
    if (dadosRetorno?.acoes?.ficha_pdf?.url) {
      window.open(dadosRetorno.acoes.ficha_pdf.url, '_blank');
    }
  };

  const gerarReciboQRCode = () => {
    if (dadosRetorno?.acoes?.recibo_qr?.url) {
      window.open(dadosRetorno.acoes.recibo_qr.url, '_blank');
    }
  };

  const enviarNotificacaoWhatsApp = () => {
    if (dadosRetorno?.acoes?.whatsapp?.url) {
      window.open(dadosRetorno.acoes.whatsapp.url, '_blank');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-center mb-6">📋 Formulário de Cadastro AAAI</h1>
      
      {mensagem && (
        <p className={`p-3 mb-4 text-center font-bold rounded ${
          mensagem.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {mensagem}
        </p>
      )}
      
      <form onSubmit={lidarComEnvio} className="space-y-4">
        {/* ===== DADOS PESSOAIS ===== */}
        <div className="border-b pb-4">
          <h2 className="font-bold text-lg mb-3">👤 Dados Pessoais</h2>
          
          <div>
            <label className="block text-sm font-bold mb-1">Nome Completo *</label>
            <input type="text" name="nome_completo" required className="w-full p-2 border rounded bg-gray-50" placeholder="Digite seu nome completo"/>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-bold mb-1">Data de Nascimento</label>
            <input type="date" name="data_nascimento" className="w-full p-2 border rounded bg-gray-50"/>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-bold mb-1">Género</label>
            <select name="genero" className="w-full p-2 border rounded bg-gray-50">
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>

        {/* ===== DOCUMENTOS ===== */}
        <div className="border-b pb-4">
          <h2 className="font-bold text-lg mb-3">📄 Documentos</h2>
          
          <div>
            <label className="block text-sm font-bold mb-1">Número do Passaporte *</label>
            <input type="text" name="numero_passaporte" required className="w-full p-2 border rounded bg-gray-50" placeholder="Ex: N1234567"/>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-bold mb-1">Tipo de Nacionalidade</label>
            <select name="tipo_nacionalidade" className="w-full p-2 border rounded bg-gray-50">
              <option value="Estrangeiro">Estrangeiro</option>
              <option value="Nacional">Nacional</option>
              <option value="Dupla Nacionalidade">Dupla Nacionalidade</option>
              <option value="Refugiado">Refugiado</option>
            </select>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-bold mb-1">País de Origem</label>
            <input 
              type="text" 
              name="pais_origem" 
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="Ex: Brasil, Angola, Portugal..."
            />
          </div>
        </div>

        {/* ===== CONTATO ===== */}
        <div className="border-b pb-4">
          <h2 className="font-bold text-lg mb-3">📞 Contacto</h2>
          
          <div>
            <label className="block text-sm font-bold mb-1">Telefone</label>
            <input 
              type="tel" 
              name="telefone" 
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="Ex: 900 000 000"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-bold mb-1">E-mail</label>
            <input 
              type="email" 
              name="email" 
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="email@exemplo.com"
            />
          </div>
        </div>

        {/* ===== FILIAÇÃO ===== */}
        <div className="border-b pb-4">
          <h2 className="font-bold text-lg mb-3">👨‍👩‍👦 Filiação</h2>
          
          <div>
            <label className="block text-sm font-bold mb-1">Nome do Pai</label>
            <input 
              type="text" 
              name="nome_pai" 
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="Nome completo do pai"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-bold mb-1">Nome da Mãe</label>
            <input 
              type="text" 
              name="nome_mae" 
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="Nome completo da mãe"
            />
          </div>
        </div>

        {/* ===== ENDEREÇO ===== */}
        <div className="border-b pb-4">
          <h2 className="font-bold text-lg mb-3">📍 Endereço</h2>
          
          <div>
            <label className="block text-sm font-bold mb-1">Província de Residência</label>
            <input 
              type="text" 
              name="provincia_residencia" 
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="Ex: Luanda, Benguela..."
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-bold mb-1">Município</label>
            <input 
              type="text" 
              name="municipio_endereco" 
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="Ex: Catumbela, Talatona..."
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-bold mb-1">Bairro / Rua</label>
            <input 
              type="text" 
              name="bairro_rua" 
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="Ex: Bairro Azul, Rua 10..."
            />
          </div>
        </div>

        {/* ===== SERVIÇO ===== */}
        <div className="border-b pb-4">
          <h2 className="font-bold text-lg mb-3">📋 Dados do Pedido</h2>
          
          <div>
            <label className="block text-sm font-bold mb-1">Tipo de Registro</label>
            <select name="tipo_registro" className="w-full p-2 border rounded bg-gray-50">
              <option value="Primeira Vez">Primeira Vez</option>
              <option value="Renovação">Renovação</option>
              <option value="Atualização">Atualização</option>
              <option value="Segunda Via">Segunda Via</option>
            </select>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-bold mb-1">Tipo de Serviço</label>
            <select name="tipo_servico" className="w-full p-2 border rounded bg-gray-50">
              <option value="Emissao DIRE">Emissão DIRE</option>
              <option value="Regularização">Regularização</option>
              <option value="Visto">Visto</option>
              <option value="Renovação">Renovação</option>
              <option value="Agendamento">Agendamento</option>
              <option value="Consulta">Consulta</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-bold mb-1">Data de Agendamento</label>
            <input 
              type="datetime-local" 
              name="data_agendamento" 
              className="w-full p-2 border rounded bg-gray-50"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-bold mb-1">Observações</label>
            <textarea 
              name="observacoes" 
              rows="3"
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="Informações adicionais sobre o pedido"
            ></textarea>
          </div>
        </div>

        {/* ===== UPLOADS ===== */}
        <div className="border-b pb-4">
          <h2 className="font-bold text-lg mb-3">📎 Documentos Digitalizados</h2>
          
          <div>
            <label className="block text-sm font-bold mb-1">Documento de Identificação (PDF/JPG/PNG)</label>
            <input 
              type="file" 
              name="documento_identificacao" 
              className="w-full p-2 border rounded bg-gray-50"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-bold mb-1">Foto Tipo Passe (JPG/PNG)</label>
            <input 
              type="file" 
              name="foto" 
              className="w-full p-2 border rounded bg-gray-50"
              accept=".jpg,.jpeg,.png"
            />
          </div>
        </div>

        {/* ===== BOTÃO SUBMIT ===== */}
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 font-bold rounded transition disabled:opacity-50"
        >
          {loading ? '⏳ A processar...' : '📝 Enviar Pedido Oficial'}
        </button>
      </form>

      {/* ===== BOTÕES PÓS-CADASTRO ===== */}
      {registroId && dadosRetorno && (
        <div className="mt-8 p-6 bg-slate-50 rounded-2xl border-2 border-slate-200/60 text-center shadow-inner">
          <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">
            📋 AÇÕES DO PROCESSO DIGITAL
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center">
            <button
              type="button"
              onClick={gerarFichaPDF}
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              📥 Ficha de Inscrição (PDF)
            </button>
            
            <button
              type="button"
              onClick={gerarReciboQRCode}
              className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              📱 Recibo + QR Code
            </button>
            
            <button
              type="button"
              onClick={enviarNotificacaoWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              💬 Enviar Boas-Vindas
            </button>
          </div>

          {dadosRetorno.numero_processo && (
            <p className="mt-4 text-sm text-gray-600">
              📌 Nº Processo: <strong className="text-blue-600">{dadosRetorno.numero_processo}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}