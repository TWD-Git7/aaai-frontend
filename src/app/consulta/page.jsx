'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

// =========================================================
// FUNÇÃO GLOBAL DE FORMATAÇÃO DE DATA (Coloque no topo do arquivo)
// =========================================================
const formatarDataAgendamento = (dataRaw) => {
  if (!dataRaw) return 'Não agendado';
  try {
    const dataObjeto = new Date(dataRaw);
    if (isNaN(dataObjeto.getTime())) return dataRaw;
    
    const dia    = String(dataObjeto.getDate()).padStart(2, '0');
    const mes    = String(dataObjeto.getMonth() + 1).padStart(2, '0');
    const ano    = dataObjeto.getFullYear();
    const hora   = String(dataObjeto.getHours()).padStart(2, '0');
    const minuto = String(dataObjeto.getMinutes()).padStart(2, '0');
    
    return `${dia}/${mes}/${ano} ás ${hora}:${minuto}`;
  } catch (e) {
    return dataRaw;
  }
};

export default function ConsultaStatus() {
  const [documento, setDocumento] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [ultimaConsulta, setUltimaConsulta] = useState(null);

  const WORDPRESS_API_URL = 'http://localhost/aaaibwewp.com/wp-json/aaai/v1/consulta-status';

  const handleConsulta = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    setCarregando(true);

    const documentoLimpo = documento.trim();
    if (!documentoLimpo) {
      setErro('Por favor, insira o número do processo ou passaporte.');
      setCarregando(false);
      return;
    }

    try {
      const response = await fetch(
        `${WORDPRESS_API_URL}?documento=${encodeURIComponent(documentoLimpo)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensagem || data.message || 'Erro ao consultar os dados.');
      }

      setResultado(data);
      setUltimaConsulta(new Date().toLocaleString('pt-PT'));
    } catch (err) {
      setErro(err.message || 'Não foi possível realizar a consulta. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Função para baixar recibo (se disponível)
  const baixarRecibo = (via = 1) => {
    if (resultado?.processo?.recibo_url) {
      const url = resultado.processo.recibo_url.replace('&via=1', `&via=${via}`);
      window.open(url, '_blank');
    }
  };

  // ==========================================
  // FUNÇÃO PARA IMPRIMIR FICHA DE CONSULTA - DESIGN PREMIUM
  // ==========================================
  const imprimirFicha = async () => {
    if (!resultado) return;

    // No seu page.jsx dentro da função imprimirFicha():
    if (resultado.utente?.foto_base64) {
      try {
        // Adiciona direto a string Base64 enviada nativamente pelo PHP
        doc.addImage(resultado.utente.foto_base64, 'JPEG', fotoX + 0.5, fotoY + 0.5, fotoW - 1, fotoH - 1);
        fotoCarregada = true;
      } catch (err) {
        console.warn('Falha ao acoplar string nativa:', err);
      }
    }
    
    // ========== CONFIGURAÇÃO INICIAL COM SUPORTE UNICODE ==========
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true
    });
    
    // ========== MAPEAMENTO EXATO COM BASE NOS LOGS REAIS DO BACKEND ==========
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
    const profissao = resultado.utente?.profissao || 'Não informado';
    const tipoRegistro = resultado.processo?.tipo_registro || 'Não informado';
    const dataAgendamento = resultado.processo?.data_agendamento || 'Não agendado';
    const dataCriacao = resultado.processo?.data_criacao || 'Não informado';
    
    // Mapeamento correto dos Dados Complementares limpos retornados pelo WP para o jsPDF no seu page.jsx:
    const nomePai   = resultado.utente?.nome_pai || 'Não informado';
    const nomeMae   = resultado.utente?.nome_mae || 'Não informado';
    const endereco  = resultado.utente?.endereco || 'Não informado'; // <-- Nome exclusivo!
    const provincia = resultado.utente?.provincia || 'Não informado'; // <-- Nome exclusivo!
    const municipio = resultado.utente?.municipio || 'Não informado'; // <-- Nome exclusivo!
    const bairroRua = resultado.utente?.bairro_rua || 'Não informado';
    const tipoNac   = resultado.utente?.tipo_nacionalidade || 'Não informado';
    const prioridade = resultado.processo?.prioridade || 'Normal';
    const estVal = resultado.utente?.estatuto || 'Pendente';

    const fotoUrlFinal = resultado.utente?.foto_url || null;

    // Dentro da função imprimirFicha:
    const dataAgendamentoFormatada = formatarDataAgendamento(resultado.processo?.data_agendamento);

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
    
    // Aplicar remoção de acentos para evitar caracteres estranhos no PDF
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
      doc.setGState(new doc.GState({ opacity: 0.04 }));
      doc.addImage(logoBase64, 'PNG', 55, 80, 100, 100);
      doc.restoreGraphicsState();
    } catch (err) {
      console.warn('Erro ao carregar logo na marca dágua:', err);
    }
    
    // ========== CABEÇALHO ==========
    doc.setFillColor(4, 116, 129);
    doc.rect(0, 0, 210, 42, 'F');
    
    // Logotipo AAAI no topo esquerdo
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
    
    // ========== FOTO DO UTENTE (DIRETO VIA BASE64 DO BACKEND - BLINDADO) ==========
      const fotoX = 160;
      const fotoY = 55;
      const fotoW = 35;
      const fotoH = 45;
      
      doc.setDrawColor(215, 220, 220);
      doc.setFillColor(248, 250, 250);
      doc.rect(fotoX, fotoY, fotoW, fotoH, 'FD');
      
      let fotoCarregada = false;

      // Injeta diretamente a string de texto Base64 que o PHP processou no HD do servidor
      if (resultado?.utente?.foto_base64) {
        try {
          console.log("Injetando foto em Base64 nativo no PDF...");
          doc.addImage(resultado.utente.foto_base64, 'JPEG', fotoX + 0.5, fotoY + 0.5, fotoW - 1, fotoH - 1);
          fotoCarregada = true;
          console.log("Pleno: Foto renderizada com sucesso no PDF via Base64!");
        } catch (err) {
          console.warn('Erro ao renderizar string Base64 no jsPDF:', err);
        }
      }
      
      if (!fotoCarregada) {
        doc.setFontSize(11);
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor(150, 150, 150);
        doc.text('FOTO 3X4', fotoX + fotoW / 2, fotoY + fotoH / 2 + 1, { align: 'center' });
        doc.setFontSize(7);
        doc.setFont('Helvetica', 'normal');
        doc.text('Não informada', fotoX + fotoW / 2, fotoY + fotoH / 2 + 7, { align: 'center' });
      }

    
    // ========== ESTRUTURA RESPONSIVA DE COLUNAS ==========
    let yPos = 60;
    const col1X = 15;
    const col2X = 85;
    const maxCol1W = 65;
    const maxCol2W = 65;
    const lineHeight = 7.5;
    
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
      
      return (linhasTexto.length - 1) * 4;
    };
    
    // ========== DADOS DO PROCESSO ==========
    doc.setFontSize(10.5);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(4, 116, 129);
    doc.text('DADOS DO PROCESSO', col1X, yPos);
    yPos += 2.5;
    
    doc.setFillColor(4, 116, 129);
    doc.rect(col1X, yPos, 135, 0.6, 'F');
    yPos += 7;
    
    doc.setFontSize(9);
    
    let extraY1 = escreverLinhaResponsiva('Nº Processo:', codigoProcesso, col1X, maxCol1W, yPos);
    let extraY2 = escreverLinhaResponsiva('Servico:', servicoClean, col2X, maxCol2W, yPos);
    yPos += lineHeight + Math.max(extraY1, extraY2);
    
    extraY1 = escreverLinhaResponsiva('Tipo Registro:', tipoRegistroClean, col1X, maxCol1W, yPos);
    
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
    // Linha que desenha no seu jsPDF (mantenha a linha que você já usa, apenas mude a variável):
    doc.text(`Data Agendam.: ${dataAgendamentoFormatada}`, 15, 84);
    
    yPos += lineHeight + extraY1;
    
    //extraY1 = escreverLinhaResponsiva('Data Agendam.:', dataAgendamentoClean, col1X, maxCol1W, yPos);
    extraY2 = escreverLinhaResponsiva('Data Criacao:', dataCriacaoClean, col2X, maxCol2W, yPos);
    yPos += lineHeight + Math.max(extraY1, extraY2);
    
    extraY1 = escreverLinhaResponsiva('Data Atualiz.:', dataAtualizacaoClean, col1X, maxCol1W, yPos);
    yPos += 14 + extraY1;
    
    if (yPos < 108) yPos = 108;
    
    // ========== DADOS DO UTENTE ==========
    doc.setFontSize(10.5);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(4, 116, 129);
    doc.text('DADOS DO UTENTE', col1X, yPos);

          // Linhas de texto do jsPDF:
    //doc.text(`Nome do Pai: ${nomePai}`, coluna1X, linhaY);
    //doc.text(`Nome da Mãe: ${coluna2X}`, linhaY);
    // Na seção DADOS DO UTENTE do jsPDF:
    //doc.text(`Endereço: ${enderecoUtente}`, coluna1X, linhaEnderecoY);

    yPos += 2.5;
    
    doc.setFillColor(4, 116, 129);
    doc.rect(col1X, yPos, 180, 0.6, 'F');
    yPos += 7;
    
    doc.setFontSize(9);
    
    const dadosUtente = [
      ['Nome:', nomeClean, 'Genero:', generoClean],
      ['Passaporte:', passaporteClean, 'Profissao:', profissaoClean],
      ['Telefone:', telefoneClean, 'Pais de Origem:', paisOrigemClean],
      ['E-mail:', emailClean, 'Endereco:', enderecoClean]
    ];
    
    dadosUtente.forEach(([label1, value1, label2, value2]) => {
      let exY1 = escreverLinhaResponsiva(label1, value1, col1X, 80, yPos);
      let exY2 = escreverLinhaResponsiva(label2, value2, col2X, 110, yPos);
      yPos += lineHeight + Math.max(exY1, exY2);
    });
    
    yPos += 6;
    
    // ========== QR CODE ==========
    let possuiQR = false;
    if (resultado.processo?.qr_code) {
      try {
        const qrX = 160;
        const qrY = yPos;
        const qrSize = 35;
        
        doc.setDrawColor(215, 220, 220);
        doc.setFillColor(255, 255, 255);
        doc.rect(qrX, qrY, qrSize, qrSize, 'FD');
        
        // Injeta diretamente o link do QR code nativamente para evitar bloqueios do localhost
        doc.addImage(resultado.processo.qr_code, 'PNG', qrX + 1, qrY + 1, qrSize - 2, qrSize - 2);
        
        doc.setFontSize(6.5);
        doc.setTextColor(120, 120, 120);
        doc.text('QR Code Autenticidade', qrX + qrSize / 2, qrY + qrSize + 4, { align: 'center' });
        possuiQR = true;
      } catch (err) {
        console.warn('Erro ao processar injeção direta do QR Code:', err);
      }
    }
    
    if (!possuiQR) {
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('QR Code nao disponivel', 160, yPos + 15);
    }
    
    // ========== DADOS COMPLEMENTARES CORRIGIDOS ==========
    doc.setFontSize(10.5);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(4, 116, 129);
    doc.text('DADOS COMPLEMENTARES', col1X, yPos);

    // ========== DADOS COMPLEMENTARES ==========
    /* const yDadosComp1 = 140; // Linha para Pai e Mãe
     const yDadosComp2 = 148; // Linha para Província e Município
     const yDadosComp3 = 156; // Linha para Bairro e Tipo Nac.

     doc.text(`Nome do Pai: ${nomePai}`, 15, yDadosComp1);
     doc.text(`Nome da Mãe: ${nomeMae}`, 110, yDadosComp1);

    doc.text(`Província: ${provincia}`, 15, yDadosComp2);
     doc.text(`Município: ${municipio}`, 110, yDadosComp2);
  */
    yPos += 2.5;
    
    doc.setFillColor(4, 116, 129);
    doc.rect(col1X, yPos, 135, 0.6, 'F');
    yPos += 7;
    
    doc.setFontSize(9);

    const dadosComplementares = [
      ['Nome do Pai:', removerAcentos(nomePai), 'Nome da Mae:', removerAcentos(nomeMae)],
      ['Provincia:', removerAcentos(provincia), 'Municipio:', removerAcentos(municipio)],
      ['Bairro/Rua:', removerAcentos(bairroRua), 'Tipo Nac.:', removerAcentos(tipoNac)],
      ['Estatuto:', removerAcentos(estVal), 'Prioridade:', removerAcentos(prioridade)]
    ];
    
    dadosComplementares.forEach(([label1, value1, label2, value2]) => {
      let exY1 = escreverLinhaResponsiva(label1, value1, col1X, 65, yPos);
      let exY2 = escreverLinhaResponsiva(label2, value2, col2X, 65, yPos);
      yPos += lineHeight + Math.max(exY1, exY2);
    });
    
    yPos += 12;
    
    // ========== HISTÓRICO DE PEDIDOS ==========
    if (resultado.ultimos_pedidos && resultado.ultimos_pedidos.length > 0) {
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
        if (yPos > 260) {
          doc.addPage();
          yPos = 25;
        }
        
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
        
        const servicoTblClean = removerAcentos(pedido.servico || 'N/A');
        const servicoCortado = doc.splitTextToSize(servicoTblClean, 65)[0];
        doc.text(servicoCortado, col1X + 70, yPos);
        
        doc.setTextColor(color);
        doc.setFont('Helvetica', 'bold');
        doc.text(statusText, col1X + 140, yPos);
        
        yPos += 5.5;
      });
    }
    
    // ========== RODAPÉ FIXO MANTIDO ==========
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

  // Função para obter cor do status
  const getStatusColor = (status) => {
    const colors = {
      'Pendente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Em Analise': 'bg-blue-100 text-blue-800 border-blue-300',
      'Aprovado': 'bg-green-100 text-green-800 border-green-300',
      'Rejeitado': 'bg-red-100 text-red-800 border-red-300',
      'Concluido': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'Cancelado': 'bg-gray-100 text-gray-800 border-gray-300',
      'Confirmado': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Função para obter ícone do status
  const getStatusIcon = (status) => {
    const icons = {
      'Pendente': '⏳',
      'Em Analise': '🔍',
      'Aprovado': '✅',
      'Rejeitado': '❌',
      'Concluido': '🎯',
      'Cancelado': '🚫',
      'Confirmado': '📌',
    };
    return icons[status] || '📋';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho com Logo 
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-md border border-slate-200">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-emerald-700">AAAI</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Associação Angolana de Apoio a Imigrantes</h1>
              <p className="text-sm text-slate-500">Portal de Consulta de Processos</p>
            </div>
          </div>
        </div>
        */}

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-emerald-700 to-teal-800">
            <h2 className="text-2xl font-bold text-white text-center">
              🇦🇴 Portal de Consultar Processo AAAI
            </h2>
            <p className="text-sm text-emerald-100 text-center mt-1">
              Insira o número do seu processo ou passaporte para verificar o estado atual
            </p>
          </div>

          <div className="p-6">
            {/* Formulário */}
            <form onSubmit={handleConsulta} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Número do Processo ou Passaporte
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    🔍
                  </span>
                  <input
                    type="text"
                    required
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    placeholder="Ex: AAAI-2026-00001 ou N123456"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-800"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Digite o número do processo (formato: AAAI-ANO-MÊS-NÚMERO) ou o número do passaporte
                </p>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition disabled:bg-emerald-300 flex items-center justify-center gap-2">
                {carregando ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    A Consultar...
                  </>
                ) : (
                  '📋 Consultar Status'
                )}
              </button>
            </form>

            {/* Mensagem de Erro */}
            {erro && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                <span className="text-lg">⚠️</span>
                <div>
                  <p className="font-medium">Erro na consulta</p>
                  <p className="text-red-600">{erro}</p>
                </div>
              </div>
            )}

            {/* Última consulta */}
            {ultimaConsulta && !erro && (
              <p className="mt-4 text-xs text-slate-400 text-center">
                Última consulta: {ultimaConsulta}
              </p>
            )}
          </div>
        </div>

        {/* Resultado da Consulta */}
        {resultado && resultado.sucesso && (
          <div className="mt-6 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fadeIn">
            {/* Banner de Status */}
            <div className={`p-4 border-b ${getStatusColor(resultado.processo?.status || 'Pendente')}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getStatusIcon(resultado.processo?.status)}</span>
                  <div>
                    <h3 className="font-bold text-slate-800">
                      Processo: {resultado.processo?.numero || 'N/A'}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {resultado.utente?.nome || 'Utente não identificado'}
                    </p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 ${getStatusColor(resultado.processo?.status)}`}>
                  {resultado.processo?.status || 'Pendente'}
                </span>
              </div>
            </div>

            {/* Conteúdo do Resultado */}
            <div className="p-6 space-y-6">
              {/* Grid de Informações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Coluna Esquerda - Dados do Processo */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    📋 Dados do Processo
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Nº Processo:</span>
                      <span className="font-medium text-slate-800">{resultado.processo?.numero || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Serviço:</span>
                      <span className="font-medium text-slate-800">{resultado.processo?.servico || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Tipo Registro:</span>
                      <span className="font-medium text-slate-800">{resultado.processo?.tipo_registro || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Data Agendamento:</span>
                      <span className="font-medium text-slate-800">{formatarDataAgendamento(resultado.processo?.data_agendamento)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Última Atualização:</span>
                      <span className="font-medium text-slate-800">{resultado.processo?.data_atualizacao || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Coluna Direita - Dados do Utente */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    👤 Dados do Utente
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Nome:</span>
                      <span className="font-medium text-slate-800">{resultado.utente?.nome || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Passaporte:</span>
                      <span className="font-medium text-slate-800">{resultado.utente?.passaporte || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Telefone:</span>
                      <span className="font-medium text-slate-800">{resultado.utente?.telefone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">E-mail:</span>
                      <span className="font-medium text-slate-800">{resultado.utente?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">País Origem:</span>
                      <span className="font-medium text-slate-800">{resultado.utente?.pais_origem || 'N/A'}</span>
                    </div>
                    {resultado.utente?.foto_url && (
                      <div className="mt-2">
                        <img 
                          src={resultado.utente.foto_url} 
                          alt="Foto do Utente" 
                          className="w-16 h-16 object-cover rounded-full border-2 border-slate-200 mx-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* QR Code do Processo */}
              {resultado.processo?.qr_code && (
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    🔍 QR Code do Processo
                  </h4>
                  <div className="flex justify-center">
                    <img 
                      src={resultado.processo.qr_code} 
                      alt="QR Code do Processo" 
                      className="w-32 h-32 border-2 border-slate-200 rounded-lg p-2 bg-white"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Digitalize o QR Code para verificar a autenticidade do processo
                  </p>
                </div>
              )}

              {/* Últimos Pedidos (se disponível) */}
              {resultado.ultimos_pedidos && resultado.ultimos_pedidos.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    📋 Histórico de Pedidos
                  </h4>
                  <div className="space-y-2">
                    {resultado.ultimos_pedidos.map((pedido, index) => (
                      <div key={index} className="flex justify-between items-center text-sm border-b border-slate-200 pb-2 last:border-0">
                        <span className="text-slate-600">{pedido.data}</span>
                        <span className="font-medium text-slate-800">{pedido.servico}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          pedido.status === 'publish' ? 'bg-green-100 text-green-800' :
                          pedido.status === 'draft' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pedido.status === 'publish' ? '✅ Concluído' :
                           pedido.status === 'draft' ? '❌ Cancelado' :
                           '⏳ Pendente'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                {resultado.processo?.recibo_url && (
                  <>
                    <button
                      onClick={() => baixarRecibo(1)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
                    >
                      📱 Recibo Via 1
                    </button>
                    <button
                      onClick={() => baixarRecibo(2)}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
                    >
                      📄 Recibo Via 2
                    </button>
                  </>
                )}
                <button
                  onClick={imprimirFicha}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
                >
                  📥 Baixar Ficha
                </button>
              </div>

              {/* WhatsApp - Notificação */}
              {resultado.utente?.telefone && (
                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      const telefoneLimpo = resultado.utente.telefone.replace(/\D/g, '');
                      const mensagem = `*Consulta de Status - AAAI*

                      Olá, ${resultado.utente.nome}! 👋

                      📋 *Status do seu Processo:*
                      🔹 *Processo:* ${resultado.processo?.numero || 'N/A'}
                      🔹 *Status:* ${resultado.processo?.status || 'Pendente'}
                      🔹 *Serviço:* ${resultado.processo?.servico || 'N/A'}
                      🔹 *Última Atualização:* ${resultado.processo?.data_atualizacao || 'N/A'}

                      Para mais informações, entre em contato conosco.

                      _Associação Angolana de Apoio a Imigrantes_ 🇦🇴`;
                      
                      window.open(
                        `https://api.whatsapp.com/send?phone=${telefoneLimpo}&text=${encodeURIComponent(mensagem)}`,
                        '_blank'
                      );
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
                  >
                    💬 Notificar via WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nenhum resultado encontrado */}
        {resultado && !resultado.sucesso && (
          <div className="mt-6 p-6 bg-white rounded-2xl shadow-xl border border-slate-200 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhum processo encontrado</h3>
            <p className="text-slate-500">
              Não encontramos nenhum processo com o documento informado.
            </p>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg text-left text-sm">
              <p className="text-slate-600 font-medium mb-2">📌 Dicas:</p>
              <ul className="text-slate-500 space-y-1 list-disc list-inside">
                <li>Verifique se o número do processo está correto (Ex: AAAI-2026-06-00001)</li>
                <li>Verifique se o número do passaporte está correto</li>
                <li>Certifique-se de que o processo já foi registado no sistema</li>
                <li>Caso tenha dúvidas, entre em contato com a AAAI</li>
              </ul>
            </div>
          </div>
        )}

        {/* Utente encontrado sem pedidos */}
        {resultado && resultado.sucesso && resultado.utente && !resultado.processo && (
          <div className="mt-6 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-yellow-100 border-b border-yellow-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👤</span>
                <div>
                  <h3 className="font-bold text-slate-800">Utente Encontrado</h3>
                  <p className="text-sm text-slate-600">{resultado.utente.nome}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <p className="text-yellow-800">
                  📌 <strong>Utente encontrado</strong>, mas ainda não possui nenhum pedido registado no sistema.
                </p>
                <p className="text-sm text-yellow-700 mt-2">
                  Para iniciar um processo, dirija-se ao balcão da AAAI ou faça o cadastro pelo portal.
                </p>
              </div>
              
              {/* Dados do Utente */}
              <div className="mt-4 bg-slate-50 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  👤 Dados do Utente
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Nome:</span>
                    <span className="font-medium text-slate-800">{resultado.utente.nome}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Passaporte:</span>
                    <span className="font-medium text-slate-800">{resultado.utente.passaporte}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Telefone:</span>
                    <span className="font-medium text-slate-800">{resultado.utente.telefone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">E-mail:</span>
                    <span className="font-medium text-slate-800">{resultado.utente.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}