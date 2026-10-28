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
  const [numeroProcesso, setNumeroProcesso] = useState(null);
  const [dadosRetorno, setDadosRetorno] = useState(null);
  
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
    profissao: '', // NOVO
    endereco_completo: '', // NOVO
    nome_arquivo_doc: '',
    nome_arquivo_foto: '',
    objeto_doc: null,
    objeto_foto: null
  });

  // Função para formatar data
  const formatarDataParaExibicao = (data) => {
    if (!data) return 'Não informado';
    const partes = data.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`; // d/m/Y
    }
    return data;
  };

  const lidarComMudanca = (e) => {
    const { name, value } = e.target;
    setDadosForm(prev => ({ ...prev, [name]: value }));
  };

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

    // Adicionar campos que podem não estar no formulário
    formData.append('estatuto', 'Pendente');
    formData.append('profissao', dadosForm.profissao || '');
    formData.append('endereco_completo', dadosForm.endereco_completo || '');

    try {
      const response = await fetch('http://localhost/aaaibwewp.com/wp-json/aaai/v1/cadastro', {
        method: 'POST',
        body: formData,
      });

      const resultado = await response.json();

      if (response.ok && resultado.sucesso) {
        setRegistroId(resultado.id_pedido);
        setNumeroProcesso(resultado.numero_processo);
        setDadosRetorno(resultado);
        
        setStatusEnvio({ 
          tipo: 'sucesso', 
          mensagem: `✅ Processo registado com sucesso! Nº: ${resultado.numero_processo}`
        });
        
        if (resultado.utente) {
          setDadosForm(prev => ({
            ...prev,
            nome_completo: resultado.utente.nome || prev.nome_completo,
            telefone: resultado.utente.telefone || prev.telefone,
          }));
        }
      } else {
        setStatusEnvio({ 
          tipo: 'erro', 
          mensagem: `❌ Erro: ${resultado.message || resultado.mensagem || 'Falha ao processar.'}` 
        });
      }
    } catch (error) {
      console.error('Erro detalhado:', error);
      setStatusEnvio({ 
        tipo: 'erro', 
        mensagem: '❌ Erro de ligação com o servidor. Verifique se o WampServer está rodando.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FUNÇÃO PARA CONVERTER ARQUIVO PARA BASE64
  // ==========================================
  const converterParaBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // ==========================================
  // GERAR FICHA DE CADASTRO EM PDF COM LOGOTIPO
  // ==========================================
  const gerarFichaPDF = async () => {
    if (!dadosRetorno && !dadosForm.nome_completo) {
      alert('❌ Nenhum dado disponível para gerar a ficha.');
      return;
    }

    const doc = new jsPDF();
    const codigoProcesso = numeroProcesso || `AAAI-2026-${registroId || 'TEMP'}`;
    
    // ========== MARCA D'ÁGUA (APENAS A IMAGEM FICA OPACA) ==========
    try {
      const logoUrl = '/images/logo-aaai.png';
      const response = await fetch(logoUrl);
      const blob = await response.blob();
      const logoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      
      // Salvar o estado atual da opacidade
      const currentOpacity = doc.internal.getGState ? doc.internal.getGState() : null;
      
      // Aplicar opacidade APENAS para a imagem da marca d'água
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.08 }));
      doc.addImage(logoBase64, 'PNG', 55, 60, 100, 100);
      doc.restoreGraphicsState();
      
      // Restaurar opacidade normal para o resto do documento
      if (currentOpacity) {
        doc.setGState(currentOpacity);
      }
    } catch (err) {
      console.warn('Erro ao carregar logo para marca d\'água:', err);
    }
    
    // ========== CABEÇALHO COM LOGOTIPO (100x100px) ==========
    try {
      const logoUrl = '/images/logo-aaai.png';
      const response = await fetch(logoUrl);
      const blob = await response.blob();
      const logoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      
      // Logotipo no canto superior esquerdo - 100x100px (convertido para mm: ~26x26mm)
      doc.addImage(logoBase64, 'PNG', 15, 5, 26, 26);
    } catch (err) {
      console.warn('Erro ao carregar logo para cabeçalho:', err);
      // Fallback: texto alternativo
      doc.setFontSize(16);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(4, 116, 129);
      doc.text('AAAI', 15, 25);
    }
    
    // ========== TÍTULO E SUBTÍTULO AO LADO DO LOGO ==========
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(4, 116, 129);
    doc.text('ASSOCIAÇÃO ANGOLANA DE APOIO A IMIGRANTES', 50, 15);
    
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('FICHA OFICIAL DE INSCRIÇÃO E ENQUADRAMENTO DE ESTRANGEIROS', 50, 22);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Nº Processo: ${codigoProcesso}`, 50, 28);
    
    // Linha separadora
    doc.setDrawColor(4, 116, 129);
    doc.setLineWidth(0.5);
    doc.line(15, 35, 195, 35);
    
    // ========== DADOS DO FORMULÁRIO ==========
    const nome = dadosRetorno?.utente?.nome || dadosForm.nome_completo || 'Não informado';
    const passaporte = dadosRetorno?.utente?.passaporte || dadosForm.numero_passaporte || 'Não informado';
    const telefone = dadosRetorno?.utente?.telefone || dadosForm.telefone || 'Não informado';
    const email = dadosRetorno?.utente?.email || dadosForm.email || 'Não informado';
    const paisOrigem = dadosRetorno?.utente?.pais_origem || dadosForm.pais_origem || 'Não informado';
    const tipoServico = dadosRetorno?.pedido?.tipo_servico || dadosForm.tipo_servico || 'Não informado';
    const tipoRegistro = dadosRetorno?.pedido?.tipo_registro || dadosForm.tipo_registro || 'Não informado';
    const profissao = dadosForm.profissao || 'Não informado';
    const enderecoCompleto = dadosForm.endereco_completo || dadosForm.bairro_rua || 'Não informado';
    
    const dataNascimento = dadosForm.data_nascimento ? 
      dadosForm.data_nascimento.split('-').reverse().join('/') : 'Não informado';
    
    let yPos = 45;
    
    // Secção 1: Controlo Administrativo
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('1. CONTROLO ADMINISTRATIVO', 15, yPos);
    yPos += 3;
    doc.line(15, yPos, 145, yPos);
    yPos += 8;
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Tipo de Solicitação: ${tipoRegistro}`, 15, yPos);
    yPos += 6;
    doc.text(`Serviço Requerido: ${tipoServico}`, 15, yPos);
    yPos += 6;
    
    const status = dadosRetorno?.pedido?.status || 'Pendente';
    doc.text(`Status Atual: ${status}`, 15, yPos);
    yPos += 10;
    
    // Secção 2: Identificação do Utente
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text('2. IDENTIFICAÇÃO DO REQUERENTE', 15, yPos);
    yPos += 3;
    doc.line(15, yPos, 145, yPos);
    yPos += 8;
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nome Completo: ${nome.toUpperCase()}`, 15, yPos);
    yPos += 6;
    doc.text(`Data de Nascimento: ${dataNascimento}`, 15, yPos);
    doc.text(`Género: ${dadosForm.genero || 'Não informado'}`, 95, yPos);
    yPos += 6;
    doc.text(`País de Origem: ${paisOrigem}`, 15, yPos);
    doc.text(`Nº Passaporte/Doc: ${passaporte.toUpperCase()}`, 95, yPos);
    yPos += 6;
    doc.text(`Filiação: ${dadosForm.nome_pai || 'N/I'} e ${dadosForm.nome_mae || 'N/I'}`, 15, yPos);
    yPos += 6;
    doc.text(`Profissão: ${profissao}`, 15, yPos);
    yPos += 10;
    
    // Secção 3: Contactos
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text('3. CONTACTOS E LOCALIZAÇÃO', 15, yPos);
    yPos += 3;
    doc.line(15, yPos, 195, yPos);
    yPos += 8;
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Telemóvel/WhatsApp: ${telefone}`, 15, yPos);
    doc.text(`Correio Eletrónico: ${email}`, 95, yPos);
    yPos += 6;
    doc.text(`Província: ${dadosForm.provincia_residencia || 'N/I'}`, 15, yPos);
    doc.text(`Município: ${dadosForm.municipio_endereco || 'N/I'}`, 95, yPos);
    yPos += 6;
    doc.text(`Endereço Completo: ${enderecoCompleto}`, 15, yPos);
    yPos += 10;
    
    // Secção 4: Documentos
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text('4. DOCUMENTOS ANEXADOS', 15, yPos);
    yPos += 3;
    doc.line(15, yPos, 195, yPos);
    yPos += 8;
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    
    if (dadosForm.objeto_doc || dadosRetorno?.pedido?.documento_url) {
      doc.setTextColor(16, 124, 65);
      doc.setFont('Helvetica', 'bold');
      doc.text('✓ DOCUMENTO DE IDENTIDADE: FORNECIDO', 15, yPos);
    } else {
      doc.setTextColor(185, 28, 28);
      doc.setFont('Helvetica', 'bold');
      doc.text('✗ DOCUMENTO DE IDENTIDADE: NÃO FORNECIDO', 15, yPos);
    }
    yPos += 6;
    
    if (dadosForm.objeto_foto || dadosRetorno?.utente?.foto_url) {
      doc.setTextColor(16, 124, 65);
      doc.setFont('Helvetica', 'bold');
      doc.text('✓ FOTOGRAFIA TIPO PASSE: INTEGRADA', 15, yPos);
    } else {
      doc.setTextColor(185, 28, 28);
      doc.setFont('Helvetica', 'bold');
      doc.text('✗ FOTOGRAFIA TIPO PASSE: EM FALTA', 15, yPos);
    }
    yPos += 10;
    
    // ========== QR CODE ==========
    if (dadosRetorno?.pedido?.qr_code) {
      try {
        const response = await fetch(dadosRetorno.pedido.qr_code);
        const blob = await response.blob();
        const qrBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        doc.addImage(qrBase64, 'PNG', 160, 170, 35, 35);
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text('QR Code de Verificação', 177, 213, { align: 'center' });
      } catch (err) {
        console.error('Erro ao carregar QR Code:', err);
      }
    }
    
    // ========== FOTO DO UTENTE ==========
    if (dadosForm.objeto_foto || dadosRetorno?.utente?.foto_url) {
      try {
        let fotoBase64;
        if (dadosForm.objeto_foto) {
          fotoBase64 = await converterParaBase64(dadosForm.objeto_foto);
        } else if (dadosRetorno?.utente?.foto_url) {
          const response = await fetch(dadosRetorno.utente.foto_url);
          const blob = await response.blob();
          fotoBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        }
        
        if (fotoBase64) {
          doc.setDrawColor(200, 200, 200);
          doc.rect(160, 45, 35, 45);
          doc.addImage(fotoBase64, 'JPEG', 161, 46, 33, 43);
          doc.setFontSize(7);
          doc.setTextColor(100, 100, 100);
          doc.text('Foto 3x4', 177, 95, { align: 'center' });
        }
      } catch (err) {
        console.error("Erro ao renderizar foto:", err);
      }
    }
    
    // ========== RODAPÉ E ASSINATURA ==========
    yPos = 240;
    doc.setFillColor(248, 250, 252);
    doc.rect(15, yPos, 180, 40, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(50, yPos + 28, 160, yPos + 28);
    doc.setFontSize(9);
    // Restaura cor padrão para o rodapé
    doc.setTextColor(40, 40, 40);
    doc.text('Assinatura do Técnico / Utente Requerente', 105, yPos + 33, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(`Documento gerado via Portal Digital AAAI em ${new Date().toLocaleString('pt-PT')}`, 105, yPos + 48, { align: 'center' });
    
    // VIA DO DOCUMENTO
    doc.setFontSize(8);
    doc.setTextColor(4, 116, 129);
    doc.text('VIA 1 - REQUERENTE', 195, yPos + 48, { align: 'right' });
    
    // Número de página
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página 1 de 1`, 105, 293, { align: 'center' });

    doc.save(`Ficha_AAAI_${codigoProcesso}.pdf`);
  };

  // ==========================================
  // GERAR RECIBO COM QR CODE E LOGOTIPO
  // ==========================================
  const gerarReciboQRCode = async () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [102, 152] });
    const codigoProcesso = numeroProcesso || `AAAI-2026-${registroId || '000'}`;
    const nome = dadosRetorno?.utente?.nome || dadosForm.nome_completo || 'Utente';
    const passaporte = dadosRetorno?.utente?.passaporte || dadosForm.numero_passaporte || 'N/I';
    const servico = dadosRetorno?.pedido?.tipo_servico || dadosForm.tipo_servico || 'Serviço';
    
    const payloadQR = `PROC:${codigoProcesso}|UTENTE:${nome}|PASS:${passaporte}|SERV:${servico}|DATA:${new Date().toISOString()}`;
    
    try {
      // ========== MARCA D'ÁGUA (APENAS A IMAGEM FICA OPACA) ==========
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
        doc.addImage(logoBase64, 'PNG', 26, 40, 50, 50);
        doc.restoreGraphicsState();
      } catch (err) {
        console.warn('Erro ao carregar logo para marca d\'água:', err);
      }
      
      // ========== CABEÇALHO COM LOGOTIPO (80x80px) ==========
      try {
        /*const logoUrl = '/images/logo-aaai.png';
        const response = await fetch(logoUrl);*/
        const blob = await response.blob();
        const logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        
        // 80x80px convertido para mm: ~21x21mm
        doc.addImage(logoBase64, 'PNG', 38, 2, 21, 21);
      } catch (err) {
        console.warn('Erro ao carregar logo:', err);
      }
      
      // Título
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(4, 116, 129);
      doc.text('RECIBO COMPROVATIVO', 51, 11, { align: 'center' });
      
      doc.setFontSize(7);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text('Associação Angolana de Apoio a Imigrantes', 51, 16, { align: 'center' });
      doc.line(6, 19, 96, 19);
      
      // Dados do processo
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 40);
      doc.text(`PROCESSO: ${codigoProcesso}`, 8, 27);
      doc.text(`EMISSÃO: ${new Date().toLocaleDateString('pt-PT')}`, 8, 32);
      doc.text(`PASSAPORTE: ${passaporte.toUpperCase()}`, 8, 37);
      
      // Nome do utente
      doc.setFont('Helvetica', 'bold');
      doc.text('UTENTE REQUERENTE:', 8, 45);
      doc.setFont('Helvetica', 'normal');
      doc.text(nome.substring(0, 38).toUpperCase(), 8, 50);
      
      // Serviço
      doc.setFont('Helvetica', 'bold');
      doc.text('SERVIÇO SOLICITADO:', 8, 58);
      doc.setFont('Helvetica', 'normal');
      doc.text(servico, 8, 63);
      doc.line(6, 67, 96, 67);
      
      // QR Code
      let qrCodeBase64 = null;
      if (dadosRetorno?.pedido?.qr_code) {
        try {
          const response = await fetch(dadosRetorno.pedido.qr_code);
          const blob = await response.blob();
          qrCodeBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.warn('Erro ao carregar QR Code da API:', err);
        }
      }
      
      if (!qrCodeBase64) {
        qrCodeBase64 = await QRCode.toDataURL(payloadQR, { margin: 1, width: 250 });
      }
      
      doc.addImage(qrCodeBase64, 'PNG', 33, 73, 36, 36);
      
      // ========== RODAPÉ ==========
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      doc.text('Este talão comprova a entrada digital do seu processo.', 51, 119, { align: 'center' });
      doc.text('Aceda ao balcão com este QR Code legível.', 51, 124, { align: 'center' });
      
      // Via do documento
      doc.setFontSize(7);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(4, 116, 129);
      doc.text('VIA 1 - REQUERENTE', 51, 134, { align: 'center' });
      
      // Linha de corte entre vias
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.setLineDashPattern([1, 2]);
      doc.line(6, 141, 96, 141);
      doc.setLineDashPattern([]);
      
      doc.setFontSize(5);
      doc.setTextColor(150, 150, 150);
      doc.text('Documento gerado eletronicamente - AAAI', 51, 146, { align: 'center' });

      doc.save(`Recibo_AAAI_${codigoProcesso}.pdf`);
    } catch (err) {
      console.error('Falha ao gerar QR Code:', err);
      alert('❌ Erro ao gerar o recibo. Tente novamente.');
    }
  };

  // ==========================================
  // GERAR RECIBO VIA 2 (ARQUIVO AAAI)
  // ==========================================
  const gerarReciboVia2 = async () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [102, 152] });
    const codigoProcesso = numeroProcesso || `AAAI-2026-${registroId || '000'}`;
    const nome = dadosRetorno?.utente?.nome || dadosForm.nome_completo || 'Utente';
    const passaporte = dadosRetorno?.utente?.passaporte || dadosForm.numero_passaporte || 'N/I';
    const servico = dadosRetorno?.pedido?.tipo_servico || dadosForm.tipo_servico || 'Serviço';
    
    const payloadQR = `PROC:${codigoProcesso}|UTENTE:${nome}|PASS:${passaporte}|SERV:${servico}`;
    
    try {
      // ========== MARCA D'ÁGUA (APENAS A IMAGEM FICA OPACA) ==========
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
        doc.addImage(logoBase64, 'PNG', 26, 40, 50, 50);
        doc.restoreGraphicsState();
      } catch (err) {
        console.warn('Erro ao carregar logo para marca d\'água:', err);
      }
      
      // ========== CABEÇALHO COM LOGOTIPO (80x80px) ==========
      try {
        /*const logoUrl = '/images/logo-aaai.png';
        const response = await fetch(logoUrl);*/
        const blob = await response.blob();
        const logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        
        // 80x80px convertido para mm: ~21x21mm
        doc.addImage(logoBase64, 'PNG', 38, 2, 21, 21);
      } catch (err) {
        console.warn('Erro ao carregar logo:', err);
      }
      
      // Título com destaque para via 2
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(220, 53, 69);
      doc.text('VIA 2 - ARQUIVO AAAI', 51, 11, { align: 'center' });
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(7);
      doc.setFont('Helvetica', 'normal');
      doc.text('Associação Angolana de Apoio a Imigrantes', 51, 16, { align: 'center' });
      doc.line(6, 19, 96, 19);
      
      // Dados
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 40);
      doc.text(`PROCESSO: ${codigoProcesso}`, 8, 27);
      doc.text(`EMISSÃO: ${new Date().toLocaleDateString('pt-PT')}`, 8, 32);
      doc.text(`PASSAPORTE: ${passaporte.toUpperCase()}`, 8, 37);
      
      doc.setFont('Helvetica', 'bold');
      doc.text('UTENTE REQUERENTE:', 8, 45);
      doc.setFont('Helvetica', 'normal');
      doc.text(nome.substring(0, 38).toUpperCase(), 8, 50);
      
      doc.setFont('Helvetica', 'bold');
      doc.text('SERVIÇO SOLICITADO:', 8, 58);
      doc.setFont('Helvetica', 'normal');
      doc.text(servico, 8, 63);
      doc.line(6, 67, 96, 67);
      
      // QR Code
      let qrCodeBase64 = null;
      if (dadosRetorno?.pedido?.qr_code) {
        try {
          const response = await fetch(dadosRetorno.pedido.qr_code);
          const blob = await response.blob();
          qrCodeBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.warn('Erro ao carregar QR Code:', err);
        }
      }
      
      if (!qrCodeBase64) {
        qrCodeBase64 = await QRCode.toDataURL(payloadQR, { margin: 1, width: 250 });
      }
      
      doc.addImage(qrCodeBase64, 'PNG', 33, 73, 36, 36);
      
      // Rodapé - Arquivo interno
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      doc.text('ARQUIVO INTERNO - Esta via fica em poder da AAAI.', 51, 119, { align: 'center' });
      doc.text('Para controle e histórico do processo.', 51, 124, { align: 'center' });
      
      doc.setFontSize(7);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(220, 53, 69);
      doc.text('VIA 2 - ARQUIVO', 51, 134, { align: 'center' });
      
      // Linha de corte
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.setLineDashPattern([1, 2]);
      doc.line(6, 141, 96, 141);
      doc.setLineDashPattern([]);
      
      doc.setFontSize(5);
      doc.setTextColor(150, 150, 150);
      doc.text('Documento gerado eletronicamente - AAAI', 51, 146, { align: 'center' });

      doc.save(`Recibo_Via2_AAAI_${codigoProcesso}.pdf`);
    } catch (err) {
      console.error('Falha ao gerar recibo via 2:', err);
      alert('❌ Erro ao gerar o recibo. Tente novamente.');
    }
  };

  // ==========================================
  // ENVIAR NOTIFICAÇÃO VIA WHATSAPP
  // ==========================================
  const enviarNotificacaoWhatsApp = () => {
    const codigoProcesso = numeroProcesso || `AAAI-2026-${registroId || 'TEMP'}`;
    const nome = dadosRetorno?.utente?.nome || dadosForm.nome_completo || 'Utente';
    const telefone = dadosRetorno?.utente?.telefone || dadosForm.telefone || '';
    const servico = dadosRetorno?.pedido?.tipo_servico || dadosForm.tipo_servico || 'Serviço';
    const passaporte = dadosRetorno?.utente?.passaporte || dadosForm.numero_passaporte || 'N/I';
    
    if (!telefone) {
      alert('❌ Número de telefone não disponível para enviar notificação.');
      return;
    }

    const telefoneLimpo = telefone.replace(/\D/g, '');
    
    const mensagem = `*Olá, ${nome.toUpperCase()}!* 👋

Seja muito bem-vindo(a) à *Associação Angolana de Apoio a Imigrantes (AAAI)*.

Confirmamos com sucesso a entrada digital do seu processo no nosso Portal Migratório.

📋 *DETALHES DO PROCESSO:*
🔹 *Identificador:* ${codigoProcesso}
🔹 *Nº Documento/Passaporte:* ${passaporte.toUpperCase()}
🔹 *Serviço Requerido:* ${servico}
🔹 *Status Atual:* ⏳ Em Análise Oficial

💡 *INFORMAÇÕES IMPORTANTES:*
1️⃣ Guarde o PDF da sua *Ficha de Inscrição* e o *Recibo Digital com QR Code*
2️⃣ Apresente o QR Code no dia do seu atendimento
3️⃣ Acompanhe seu processo pelo portal de consulta

Agradecemos a sua confiança nos nossos serviços. Estamos aqui para garantir a sua total segurança migratória em Angola! 🇦🇴

_Mensagem Automática de Suporte Administrativo — AAAI_`;

    const urlMensagem = encodeURIComponent(mensagem);
    const linkWhatsApp = `https://api.whatsapp.com/send?phone=${telefoneLimpo}&text=${urlMensagem}`;
    
    window.open(linkWhatsApp, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* ===== LOGOTIPO E CABEÇALHO ===== */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-4">
            {/* Logotipo - Substitua pelo caminho da sua imagem */}
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-emerald-700">AAAI</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Associação Angolana de Apoio a Imigrantes</h1>
              <p className="text-sm text-slate-500">Portal de Gestão Migratória</p>
            </div>
          </div>
          {registroId && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full whitespace-nowrap">
              ✅ Processo Ativo
            </span>
          )}
        </div>

        {/* Banner Informativo Dinâmico */}
        <div className={`p-6 text-white text-center transition-colors duration-300 ${
          registroId ? 'bg-gradient-to-r from-amber-600 to-amber-700' : 'bg-gradient-to-r from-emerald-700 to-teal-800'
        }`}>
          <h2 className="text-2xl font-black tracking-wide">PORTAL DE GESTÃO MIGRATÓRIA AAAI</h2>
          <p className="text-sm opacity-90 mt-1 font-medium">
            {registroId 
              ? `⚙️ PROCESSO REGISTADO — Nº: ${numeroProcesso || `AAAI-2026-${registroId}`}` 
              : 'Formulário Unificado de Inscrição e Apoio de Vistos'}
          </p>
        </div>

        <div className="p-6 sm:p-10">
          {/* Status Message */}
          {statusEnvio.mensagem && (
            <div className={`p-4 mb-8 rounded-xl font-semibold text-sm border text-center shadow-sm ${
              statusEnvio.tipo === 'sucesso' 
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              {statusEnvio.mensagem}
            </div>
          )}

          {/* Painel de Ações do Processo Digital - 3 BOTÕES */}
          {registroId && dadosRetorno && (
            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border-2 border-slate-200/60 text-center shadow-inner">
              <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">📋 AÇÕES DO PROCESSO DIGITAL</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button type="button" onClick={gerarFichaPDF} 
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  📥 Ficha de Inscrição (PDF)
                </button>
                
                <button type="button" onClick={gerarReciboQRCode} 
                  className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2">
                  📱 Recibo + QR Code
                </button>
                
                <button type="button" onClick={enviarNotificacaoWhatsApp} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2">
                  💬 Enviar Boas-Vindas (WhatsApp)
                </button>
              </div>
              
              {/* Botão Via 2 */}
              <div className="mt-3 pt-3 border-t border-slate-200">
                <button  type="button" onClick={gerarReciboVia2} 
                  className="text-slate-500 hover:text-slate-700 text-xs font-medium transition-all">
                  📄 Baixar Via 2 (Arquivo AAAI)
                </button>
              </div>
              
              {numeroProcesso && (
                <p className="mt-4 text-sm text-gray-600">
                  📌 Nº Processo: <strong className="text-blue-600">{numeroProcesso}</strong>
                </p>
              )}
            </div>
          )}

          {/* Formulário */}
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

            {/* Bloco 2: Dados Pessoais */}
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
                  <input type="date" name="data_nascimento" value={dadosForm.data_nascimento} onChange={lidarComMudanca} required className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none"/>
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
                  <label className="block text-xs font-bold text-slate-700 uppercase">Nome do Pai</label>
                  <input type="text" name="nome_pai" value={dadosForm.nome_pai} onChange={lidarComMudanca} className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Nome da Mãe</label>
                  <input type="text" name="nome_mae" value={dadosForm.nome_mae} onChange={lidarComMudanca} className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none"/>
                </div>
                {/* NOVO CAMPO: PROFISSÃO */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Profissão</label>
                  <input 
                    type="text" 
                    name="profissao" 
                    placeholder="Ex: Engenheiro, Professor..." 
                    value={dadosForm.profissao} 
                    onChange={lidarComMudanca} 
                    className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
              </div>
            </div>

            {/* Bloco 3: Contactos e Endereço */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2 border-slate-100">
                3. Contactos e Endereço em Angola
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Telemóvel / WhatsApp</label>
                  <input type="tel" name="telefone" placeholder="+244 ..." value={dadosForm.telefone} onChange={lidarComMudanca} required className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">E-mail para Notificações</label>
                  <input type="email" name="email" value={dadosForm.email} onChange={lidarComMudanca} required className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Província</label>
                  <select name="provincia_residencia" value={dadosForm.provincia_residencia} onChange={lidarComMudanca} className="mt-2 w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm outline-none">
                    {PROVINCIAS_ANGOLA.map(prov => <option key={prov} value={prov}>{prov}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Município</label>
                  <input type="text" name="municipio_endereco" placeholder="Ex: Belas" value={dadosForm.municipio_endereco} onChange={lidarComMudanca} className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Bairro / Rua</label>
                  <input type="text" name="bairro_rua" placeholder="Ex: Talatona, Rua 4" value={dadosForm.bairro_rua} onChange={lidarComMudanca} className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none" />
                </div>
              </div>
              
              {/* NOVO CAMPO: ENDEREÇO COMPLETO */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 uppercase">Endereço/Morada Completa</label>
                <textarea 
                  name="endereco_completo" 
                  rows="2"
                  placeholder="Ex: Rua dos Combatentes, Nº 123, Bairro Azul, Luanda"
                  value={dadosForm.endereco_completo} 
                  onChange={lidarComMudanca} 
                  className="mt-2 w-full p-3 border border-slate-300 rounded-xl text-slate-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                ></textarea>
                <p className="mt-1 text-xs text-slate-400">Informe o endereço completo para correspondência</p>
              </div>
            </div>

            {/* Bloco 4: Uploads */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2 border-slate-100">
                4. Documentação de Suporte Digital
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Documento de Identidade</label>
                  <input type="file" name="documento_identificacao" accept=".pdf,image/*" onChange={lidarComFicheiro} className="mt-2 block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition cursor-pointer" />
                  {dadosForm.nome_arquivo_doc && (
                    <p className="mt-2 text-xs font-medium text-emerald-700 flex items-center gap-1">
                      📁 {dadosForm.nome_arquivo_doc}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Foto Tipo Passe</label>
                  <input type="file" name="foto" accept="image/*" onChange={lidarComFicheiro} className="mt-2 block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition cursor-pointer" />
                  {dadosForm.nome_arquivo_foto && (
                    <p className="mt-2 text-xs font-medium text-emerald-700 flex items-center gap-1">
                      📸 {dadosForm.nome_arquivo_foto}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button type="submit" disabled={loading} className={`w-full text-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-black text-white tracking-wider uppercase transition-all transform hover:-translate-y-0.5 ${
                registroId 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800'
              }`}>
                {loading ? '⏳ Enviando...' : (registroId ? '💾 Atualizar Processo' : '📝 Enviar para Inscrição')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}