'use client';

import { useState } from 'react';

export default function ConsultaStatus() {
  const [documento, setDocumento] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleConsulta = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    setResultado(null);

    try {
      // Substitua pelo IP/URL real do seu WampServer local
      const res = await fetch(`http://localhost/aaaibwewp.com/wp-json/aaai/v1/consulta-status?documento=${documento}`);
      const data = await res.json();

      if (!res.ok || data.sucesso === false) {
        throw new Error(data.mensagem || 'Ocorreu um erro na consulta.');
      }

      setResultado(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#007cba' }}>🔍 Consultar Estado do Agendamento</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>Insira o número do seu Passaporte ou Processo para verificar o status.</p>

      <form onSubmit={handleConsulta} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <input
          type="text"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          placeholder="Ex: N9876543"
          required
          style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button
          type="submit"
          disabled={carregando}
          style={{ padding: '10px 20px', background: '#007cba', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {carregando ? 'A pesquisar...' : 'Consultar'}
        </button>
      </form>

      {erro && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#fcebea', color: '#cc1818', borderRadius: '4px', borderLeft: '4px solid #cc1818' }}>
          {erro}
        </div>
      )}

      {resultado && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#0369a1' }}>Processo Localizado!</h4>
          <p style={{ margin: '5px 0' }}><strong>Documento:</strong> {resultado.documento}</p>
          <p style={{ margin: '5px 0' }}>
            <strong>Estado Atual:</strong> <span style={{ padding: '3px 8px', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontWeight: 'bold' }}>{resultado.status}</span>
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>Última atualização do sistema: {resultado.data_atualizacao}</p>
        </div>
      )}
    </div>
  );
}


// ==========================================
// IMPRIMIR FICHA DE CONSULTA COM LOGOTIPO
// ==========================================
const imprimirFicha = async () => {
  if (!resultado) return;
  
  const doc = new jsPDF();
  const codigoProcesso = resultado.processo?.numero || 'N/A';
  const nome = resultado.utente?.nome || 'Não informado';
  const passaporte = resultado.utente?.passaporte || 'Não informado';
  const telefone = resultado.utente?.telefone || 'Não informado';
  const email = resultado.utente?.email || 'Não informado';
  const paisOrigem = resultado.utente?.pais_origem || 'Não informado';
  const servico = resultado.processo?.servico || 'Não informado';
  const status = resultado.processo?.status || 'Pendente';
  const dataAtualizacao = resultado.processo?.data_atualizacao || 'Não informado';
  const genero = resultado.utente?.genero || 'Não informado';
  const endereco = resultado.utente?.endereco || 'Não informado';
  const profissao = resultado.utente?.profissao || 'Não informado';
  
  // ========== MARCA D'ÁGUA ==========
  try {
    const logoUrl = '/images/logo-aaai.png';
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const logoBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.06 }));
    doc.addImage(logoBase64, 'PNG', 55, 60, 100, 100);
    doc.restoreGraphicsState();
  } catch (err) {
    console.warn('Erro ao carregar logo para marca d\'água:', err);
  }
  
  // ========== CABEÇALHO ==========
  doc.setFillColor(4, 116, 129);
  doc.rect(0, 0, 210, 38, 'F');
  
  try {
    const logoUrl = '/images/logo-aaai.png';
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const logoBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    
    doc.addImage(logoBase64, 'PNG', 15, 8, 21, 21);
  } catch (err) {
    console.warn('Erro ao carregar logo:', err);
    doc.setFontSize(18);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('AAAI', 15, 22);
  }
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('Helvetica', 'bold');
  doc.text('ASSOCIAÇÃO ANGOLANA DE APOIO A IMIGRANTES', 45, 16);
  
  doc.setFontSize(10);
  doc.setFont('Helvetica', 'normal');
  doc.text('CONSULTA DE STATUS - FICHA RESUMIDA DO PROCESSO', 45, 24);
  
  doc.setFontSize(8);
  doc.setTextColor(200, 225, 235);
  doc.text(`Consulta realizada em: ${new Date().toLocaleString('pt-PT')}`, 45, 31);
  
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 2]);
  doc.line(15, 40, 195, 40);
  doc.setLineDashPattern([]);
  
  // ========== DADOS DO PROCESSO ==========
  let yPos = 55;
  
  doc.setFontSize(13);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(4, 116, 129);
  doc.text('📋 DETALHES DO PROCESSO', 15, yPos);
  yPos += 3;
  doc.setDrawColor(4, 116, 129);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, 100, yPos);
  yPos += 10;
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  
  const col1X = 15;
  const col2X = 110;
  let lineHeight = 8;
  
  const escreverLinha = (label, value, x, y) => {
    doc.setFont('Helvetica', 'bold');
    doc.text(label, x, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(value, x + 50, y);
  };
  
  escreverLinha('Nº Processo:', codigoProcesso, col1X, yPos);
  yPos += lineHeight;
  
  doc.setFont('Helvetica', 'bold');
  doc.text('Status:', col1X, yPos);
  const statusColors = {
    'Pendente': [255, 193, 7],
    'Em Analise': [23, 162, 184],
    'Aprovado': [40, 167, 69],
    'Rejeitado': [220, 53, 69],
    'Concluido': [40, 167, 69],
    'Cancelado': [108, 117, 125],
    'Confirmado': [102, 16, 242]
  };
  const color = statusColors[status] || [40, 40, 40];
  doc.setTextColor(color[0], color[1], color[2]);
  doc.setFont('Helvetica', 'bold');
  doc.text(status, col1X + 50, yPos);
  doc.setTextColor(40, 40, 40);
  yPos += lineHeight;
  
  escreverLinha('Serviço:', servico, col1X, yPos);
  yPos += lineHeight;
  escreverLinha('Data Atualização:', dataAtualizacao, col1X, yPos);
  yPos += lineHeight;
  
  let yPos2 = 55;
  yPos2 += 10;
  
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  escreverLinha('Tipo Registro:', resultado.processo?.tipo_registro || 'N/A', col2X, yPos2);
  yPos2 += lineHeight;
  escreverLinha('Data Agendamento:', resultado.processo?.data_agendamento || 'Não agendado', col2X, yPos2);
  yPos2 += lineHeight;
  escreverLinha('Data Criação:', resultado.processo?.data_criacao || 'N/A', col2X, yPos2);
  yPos2 += lineHeight;
  
  yPos = Math.max(yPos, yPos2) + 8;
  
  // ========== DADOS DO UTENTE ==========
  doc.setFontSize(13);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(4, 116, 129);
  doc.text('👤 DADOS DO UTENTE', 15, yPos);
  yPos += 3;
  doc.setDrawColor(4, 116, 129);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, 100, yPos);
  yPos += 10;
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  
  const utenteDados = [
    ['Nome:', nome],
    ['Passaporte:', passaporte],
    ['Género:', genero],
    ['Profissão:', profissao],
    ['Telefone:', telefone],
    ['E-mail:', email],
    ['País de Origem:', paisOrigem],
    ['Endereço:', endereco || 'Não informado']
  ];
  
  let yUtente = yPos;
  for (let i = 0; i < utenteDados.length; i += 2) {
    const [label1, value1] = utenteDados[i];
    escreverLinha(label1, value1, col1X, yUtente);
    
    if (i + 1 < utenteDados.length) {
      const [label2, value2] = utenteDados[i + 1];
      escreverLinha(label2, value2, col2X, yUtente);
    }
    yUtente += lineHeight;
  }
  
  // ========== FOTO (se disponível) ==========
  if (resultado.utente?.foto_url) {
    try {
      const response = await fetch(resultado.utente.foto_url);
      const blob = await response.blob();
      const fotoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(248, 248, 248);
      doc.rect(165, 55, 35, 45, 'FD');
      doc.addImage(fotoBase64, 'JPEG', 166, 56, 33, 43);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text('Foto 3x4', 182, 105, { align: 'center' });
    } catch (err) {
      console.warn('Erro ao carregar foto:', err);
    }
  }
  
  // ========== QR CODE ==========
  if (resultado.processo?.qr_code) {
    try {
      const response = await fetch(resultado.processo.qr_code);
      const blob = await response.blob();
      const qrBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      
      doc.addImage(qrBase64, 'PNG', 165, 120, 35, 35);
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text('QR Code', 182, 162, { align: 'center' });
      doc.text('de Verificação', 182, 167, { align: 'center' });
    } catch (err) {
      console.warn('Erro ao carregar QR Code:', err);
    }
  }
  
  // ========== RODAPÉ ==========
  const rodapeY = 268;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(15, rodapeY, 195, rodapeY);
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Este documento é uma ficha resumo da consulta de status do processo.', 105, rodapeY + 8, { align: 'center' });
  doc.text('Para mais detalhes ou informações adicionais, entre em contato com a AAAI.', 105, rodapeY + 14, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setTextColor(4, 116, 129);
  doc.setFont('Helvetica', 'bold');
  doc.text('VIA 1 - REQUERENTE', 195, rodapeY + 8, { align: 'right' });
  
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.setFont('Helvetica', 'normal');
  doc.text('Página 1 de 1', 105, rodapeY + 22, { align: 'center' });
  
  doc.save(`Consulta_Status_${codigoProcesso}.pdf`);
};


// ==========================================
// IMPRIMIR FICHA DE CONSULTA - CORRIGIDA
// ==========================================
const imprimirFicha = async () => {
  if (!resultado) return;



const imprimirFicha = async () => {
  if (!resultado) return;
  
  // ========== CONFIGURAÇÃO INICIAL COM SUPORTE UNICODE ==========
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true
  });
  
  const codigoProcesso = resultado.processo?.numero || 'N/A';
  const nome = resultado.utente?.nome || 'Não informado';
  const passaporte = resultado.utente?.passaporte || 'Não informado';
  const telefone = resultado.utente?.telefone || 'Não informado';
  const email = resultado.utente?.email || 'Não informado';
  const paisOrigem = resultado.utente?.pais_origem || 'Não informado';
  const servico = resultado.processo?.servico || 'Não informado';
  const status = resultado.processo?.status || 'Pendente';
  const dataAtualizacao = resultado.processo?.data_atualizacao || 'Não informado';
  const genero = resultado.utente?.genero || 'Não informado';
  const endereco = resultado.utente?.endereco || 'Não informado';
  const profissao = resultado.utente?.profissao || 'Não informado';
  const tipoRegistro = resultado.processo?.tipo_registro || 'Não informado';
  const dataAgendamento = resultado.processo?.data_agendamento || 'Não agendado';
  const dataCriacao = resultado.processo?.data_criacao || 'Não informado';
  
  // ========== FUNÇÃO PARA REMOVER ACENTOS (FALLBACK) ==========
  const removerAcentos = (texto) => {
    if (!texto) return 'Nao informado';
    const acentos = {
      'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'ä': 'a',
      'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
      'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
      'ó': 'o', 'ò': 'o', 'õ': 'o', 'ô': 'o', 'ö': 'o',
      'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
      'ç': 'c', 'ñ': 'n',
      'Á': 'A', 'À': 'A', 'Ã': 'A', 'Â': 'A', 'Ä': 'A',
      'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
      'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I',
      'Ó': 'O', 'Ò': 'O', 'Õ': 'O', 'Ô': 'O', 'Ö': 'O',
      'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U',
      'Ç': 'C', 'Ñ': 'N'
    };
    return texto.replace(/[áàãâäéèêëíìîïóòõôöúùûüçñÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÔÖÚÙÛÜÇÑ]/g, match => acentos[match] || match);
  };
  
  // Aplicar remoção de acentos para evitar caracteres estranhos
  const nomeClean = removerAcentos(nome);
  const passaporteClean = removerAcentos(passaporte);
  const telefoneClean = removerAcentos(telefone);
  const emailClean = removerAcentos(email);
  const paisOrigemClean = removerAcentos(paisOrigem);
  const servicoClean = removerAcentos(servico);
  const statusClean = removerAcentos(status);
  const dataAtualizacaoClean = removerAcentos(dataAtualizacao);
  const generoClean = removerAcentos(genero);
  const enderecoClean = removerAcentos(endereco);
  const profissaoClean = removerAcentos(profissao);
  const tipoRegistroClean = removerAcentos(tipoRegistro);
  const dataAgendamentoClean = removerAcentos(dataAgendamento);
  const dataCriacaoClean = removerAcentos(dataCriacao);
  
  // ========== MARCA D'ÁGUA ==========
  try {
    const logoUrl = '/images/logo-aaai.png';
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const logoBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.04 })); // Opacidade sutil para um visual mais elegante
    doc.addImage(logoBase64, 'PNG', 55, 80, 100, 100);
    doc.restoreGraphicsState();
  } catch (err) {
    console.warn('Erro ao carregar logo:', err);
  }
  
  // ========== CABEÇALHO ==========
  doc.setFillColor(4, 116, 129);
  doc.rect(0, 0, 210, 42, 'F');
  
  // Logotipo
  try {
    const logoUrl = '/images/logo-aaai.png';
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const logoBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    doc.addImage(logoBase64, 'PNG', 15, 10, 22, 22);
  } catch (err) {
    doc.setFontSize(22);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('AAAI', 15, 25);
  }
  
  // Texto do cabeçalho - SEM ACENTOS
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('Helvetica', 'bold');
  doc.text('ASSOCIACAO ANGOLANA DE APOIO A IMIGRANTES', 44, 17);
  
  doc.setFontSize(9);
  doc.setFont('Helvetica', 'normal');
  doc.text('CONSULTA DE STATUS - FICHA RESUMIDA DO PROCESSO', 44, 24);
  
  doc.setFontSize(7.5);
  doc.setTextColor(200, 230, 240);
  doc.text('Consulta realizada em: ' + new Date().toLocaleString('pt-PT'), 44, 31);
  
  // ========== FOTO DO UTENTE (FIXADA NO TOPO DIREITO) ==========
  const fotoX = 160;
  const fotoY = 55;
  const fotoW = 35;
  const fotoH = 45;
  
  doc.setDrawColor(215, 220, 220);
  doc.setFillColor(248, 250, 250);
  doc.rect(fotoX, fotoY, fotoW, fotoH, 'FD');
  
  let fotoCarregada = false;
  if (resultado.utente?.foto_url) {
    try {
      const response = await fetch(resultado.utente.foto_url);
      const blob = await response.blob();
      const fotoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      doc.addImage(fotoBase64, 'JPEG', fotoX + 0.5, fotoY + 0.5, fotoW - 1, fotoH - 1);
      fotoCarregada = true;
    } catch (err) {
      console.warn('Erro ao carregar foto:', err);
    }
  }
  
  if (!fotoCarregada) {
    doc.setFontSize(14);
    doc.text('📷', fotoX + fotoW / 2, fotoY + fotoH / 2 + 2, { align: 'center' });
    doc.setFontSize(7.5);
    doc.setTextColor(160, 160, 160);
    doc.text('Foto 3x4', fotoX + fotoW / 2, fotoY + fotoH / 2 + 9, { align: 'center' });
  }
  
  // ========== ESTRUTURA RESPONSIVA DE COLUNAS ==========
  let yPos = 60;
  const col1X = 15;
  const col2X = 85;
  const maxCol1W = 65; // Largura maxima dinamica para a coluna 1 para nao colidir com a coluna 2
  const maxCol2W = 65; // Largura maxima dinamica para a coluna 2 para nao colidir com a foto/borda
  const lineHeight = 7.5;
  
  // Funcao dinamica que evita colisao de texto quebrando linhas se necessario
  const escreverLinhaResponsiva = (label, value, x, maxXWidth, y) => {
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text(label, x, y);
    
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    
    const labelWidth = doc.getStringUnitWidth(label) * (doc.internal.getFontSize() / doc.internal.scaleFactor) + 3;
    const valueX = x + labelWidth;
    const disponivelWidth = maxXWidth - labelWidth;
    
    const linhasTexto = doc.splitTextToSize(String(value), disponivelWidth);
    doc.text(linhasTexto, valueX, y);
    
    return (linhasTexto.length - 1) * 4; // Retorna acrescimo se houver quebra de linha
  };
  
  // ========== DADOS DO PROCESSO ==========
  doc.setFontSize(10.5);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(4, 116, 129);
  doc.text('DADOS DO PROCESSO', col1X, yPos);
  yPos += 2.5;
  
  doc.setFillColor(4, 116, 129);
  doc.rect(col1X, yPos, 135, 0.6, 'F'); // Divisor minimalista moderno
  yPos += 7;
  
  doc.setFontSize(9);
  
  // Primeira linha
  let extraY1 = escreverLinhaResponsiva('Nº Processo:', codigoProcesso, col1X, maxCol1W, yPos);
  let extraY2 = escreverLinhaResponsiva('Servico:', servicoClean, col2X, maxCol2W, yPos);
  yPos += lineHeight + Math.max(extraY1, extraY2);
  
  // Segunda linha
  extraY1 = escreverLinhaResponsiva('Tipo Registro:', tipoRegistroClean, col1X, maxCol1W, yPos);
  
  // Status Estilizado com Cor Dinâmica
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Status:', col2X, yPos);
  const labelWStatus = doc.getStringUnitWidth('Status:') * (9 / doc.internal.scaleFactor) + 3;
  
  const statusColors = {
    'Pendente': '#FFC107',
    'Em Analise': '#17A2B8',
    'Aprovado': '#28A745',
    'Rejeitado': '#DC3545',
    'Concluido': '#28A745',
    'Cancelado': '#6C757D',
    'Confirmado': '#6610F2'
  };
  const statusColor = statusColors[status] || '#000000';
  doc.setTextColor(statusColor);
  doc.setFont('Helvetica', 'bold');
  doc.text(statusClean, col2X + labelWStatus, yPos);
  
  yPos += lineHeight + extraY1;
  
  // Terceira linha
  extraY1 = escreverLinhaResponsiva('Data Agendam.:', dataAgendamentoClean, col1X, maxCol1W, yPos);
  extraY2 = escreverLinhaResponsiva('Data Criacao:', dataCriacaoClean, col2X, maxCol2W, yPos);
  yPos += lineHeight + Math.max(extraY1, extraY2);
  
  // Quarta linha
  extraY1 = escreverLinhaResponsiva('Data Atualiz.:', dataAtualizacaoClean, col1X, maxCol1W, yPos);
  yPos += 14 + extraY1;
  
  // Assegurar posicionamento correto caso a foto seja maior que o bloco superior
  if (yPos < 108) yPos = 108;
  
  // ========== DADOS DO UTENTE ==========
  doc.setFontSize(10.5);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(4, 116, 129);
  doc.text('DADOS DO UTENTE', col1X, yPos);
  yPos += 2.5;
  
  doc.setFillColor(4, 116, 129);
  doc.rect(col1X, yPos, 180, 0.6, 'F');
  yPos += 7;
  
  doc.setFontSize(9);
  
  const dadosUtente = [
    ['Nome:', nomeClean, 'Genero:', generoClean],
    ['Passaporte:', passaporteClean, 'Profissao:', profissaoClean],
    ['Telefone:', telefoneClean, 'Pais de Origem:', paisOrigemClean],
    ['E-mail:', emailClean, 'Endereco:', enderecoClean || 'Nao informado']
  ];
  
  dadosUtente.forEach(([label1, value1, label2, value2]) => {
    // Redefine larguras totais uma vez que nao ha mais a caixa de foto ao lado lateral
    let exY1 = escreverLinhaResponsiva(label1, value1, col1X, 80, yPos);
    let exY2 = escreverLinhaResponsiva(label2, value2, col2X, 110, yPos);
    yPos += lineHeight + Math.max(exY1, exY2);
  });
  
  yPos += 6;
  
  // ========== QR CODE - REALOCADO DINAMICAMENTE ==========
  let possuiQR = false;
  if (resultado.processo?.qr_code) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(resultado.processo.qr_code, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const blob = await response.blob();
        const qrBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
        
        if (qrBase64) {
          const qrX = 160;
          const qrY = yPos;
          const qrSize = 35;
          
          doc.setDrawColor(215, 220, 220);
          doc.setFillColor(255, 255, 255);
          doc.rect(qrX, qrY, qrSize, qrSize, 'FD');
          doc.addImage(qrBase64, 'PNG', qrX + 1, qrY + 1, qrSize - 2, qrSize - 2);
          
          doc.setFontSize(6.5);
          doc.setTextColor(120, 120, 120);
          doc.text('QR Code Autenticidade', qrX + qrSize / 2, qrY + qrSize + 4, { align: 'center' });
          possuiQR = true;
        }
      }
    } catch (err) {
      console.warn('Erro ao carregar QR Code:', err);
    }
  }
  
  if (!possuiQR) {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('QR Code nao disponivel', 160, yPos + 15);
  }
  
  // ========== DADOS COMPLEMENTARES ==========
  doc.setFontSize(10.5);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(4, 116, 129);
  doc.text('DADOS COMPLEMENTARES', col1X, yPos);
  yPos += 2.5;
  
  doc.setFillColor(4, 116, 129);
  doc.rect(col1X, yPos, 135, 0.6, 'F');
  yPos += 7;
  
  doc.setFontSize(9);
  
  const dadosComplementares = [
    ['Nome do Pai:', removerAcentos(resultado.utente?.nome_pai || 'Nao informado'), 'Nome da Mae:', removerAcentos(resultado.utente?.nome_mae || 'Nao informado')],
    ['Provincia:', removerAcentos(resultado.utente?.provincia_residencia || 'Nao informado'), 'Municipio:', removerAcentos(resultado.utente?.municipio_endereco || 'Nao informado')],
    ['Bairro/Rua:', removerAcentos(resultado.utente?.bairro_rua || 'Nao informado'), 'Tipo Nac.:', removerAcentos(resultado.utente?.tipo_nacionalidade || 'Nao informado')],
    ['Estatuto:', removerAcentos(resultado.utente?.estatuto || 'Pendente'), 'Prioridade:', removerAcentos(resultado.processo?.prioridade || 'Normal')]
  ];
  
  dadosComplementares.forEach(([label1, value1, label2, value2]) => {
    let exY1 = escreverLinhaResponsiva(label1, value1, col1X, 65, yPos);
    let exY2 = escreverLinhaResponsiva(label2, value2, col2X, 65, yPos);
    yPos += lineHeight + Math.max(exY1, exY2);
  });
  
  yPos += 12;
  
  // ========== HISTÓRICO DE PEDIDOS ==========
  if (resultado.ultimos_pedidos && resultado.ultimos_pedidos.length > 0) {
    // Tratamento nativo e responsivo para quebra de pagina
    if (yPos > 210) {
      doc.addPage();
      yPos = 25;
    }
    
    doc.setFontSize(10.5);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(4, 116, 129);
    doc.text('ULTIMOS PEDIDOS', col1X, yPos);
    yPos += 2.5;
    
    doc.setFillColor(4, 116, 129);
    doc.rect(col1X, yPos, 180, 0.6, 'F');
    yPos += 6;
    
    // Cabeçalho da tabela zebrada
    doc.setFillColor(242, 247, 247);
    doc.rect(col1X, yPos - 4, 180, 6.5, 'F');
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text('Data', col1X + 3, yPos);
    doc.text('Processo', col1X + 30, yPos);
    doc.text('Servico', col1X + 70, yPos);
    doc.text('Status', col1X + 140, yPos);
    
    yPos += 4.5;
    
    const pedidosMostrar = resultado.ultimos_pedidos.slice(0, 5);
    pedidosMostrar.forEach((pedido, index) => {
      // Nova verificacao de quebra de fluxo de itens na tabela
      if (yPos > 260) {
        doc.addPage();
        yPos = 25;
      }
      
      // Zebra striping para melhor leitura de tabelas profissionais
      if (index % 2 === 1) {
        doc.setFillColor(249, 251, 251);
        doc.rect(col1X, yPos - 3.5, 180, 5.5, 'F');
      }
      
      const statusText = removerAcentos(pedido.status || 'Pendente');
      const statusColorsTbl = {
        'Pendente': '#FFC107',
        'Em Analise': '#17A2B8',
        'Aprovado': '#28A745',
        'Rejeitado': '#DC3545',
        'Concluido': '#28A745',
        'Cancelado': '#6C757D'
      };
      const color = statusColorsTbl[statusText] || '#000000';
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      doc.text(pedido.data || 'N/A', col1X + 3, yPos);
      doc.text(pedido.processo || 'N/A', col1X + 30, yPos);
      
      // Controla truncamento caso o servico na tabela seja muito longo
      const servicoTblClean = removerAcentos(pedido.servico || 'N/A');
      const servicoCortado = doc.splitTextToSize(servicoTblClean, 65)[0];
      doc.text(servicoCortado, col1X + 70, yPos);
      
      doc.setTextColor(color);
      doc.setFont('Helvetica', 'bold');
      doc.text(statusText, col1X + 140, yPos);
      
      yPos += 5.5;
    });
  }
  
  // ========== RODAPÉ FIXO NA PARTE INFERIOR ==========
  const rodapeY = 272;
  doc.setDrawColor(210, 215, 215);
  doc.setLineWidth(0.4);
  doc.line(15, rodapeY, 195, rodapeY);
  
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  doc.setFont('Helvetica', 'normal');
  doc.text('Este documento e uma ficha resumo da consulta de status do processo.', 105, rodapeY + 5, { align: 'center' });
  doc.text('Para mais detalhes ou informacoes adicionais, entre em contato com a AAAI.', 105, rodapeY + 10, { align: 'center' });
  
  doc.setFontSize(6.5);
  doc.setTextColor(4, 116, 129);
  doc.setFont('Helvetica', 'bold');
  doc.text('VIA 1 - REQUERENTE', 195, rodapeY + 5, { align: 'right' });
  
  doc.setFontSize(6.5);
  doc.setTextColor(160, 160, 160);
  doc.setFont('Helvetica', 'normal');
  doc.text('Pagina 1 de 1', 105, rodapeY + 18, { align: 'center' });
  
  doc.save('Consulta_Status_' + codigoProcesso + '.pdf');
};
