// src/constants/formularioData.js

export const TIPOS_REGISTRO = [
  { id: 'Primeira Vez', label: '📝 Primeiro Registo / Inscrição' },
  { id: 'Renovacao', label: '🔄 Renovação de Processo' },
  { id: 'Atualizacao', label: '📋 Atualização de Dados Legais' },
  { id: 'Segunda Via', label: '📄 Segunda Via' }
];

export const ESTATUTOS_MIGRATORIOS = [
  { id: 'Estrangeiro', label: '🌍 Estrangeiro (Turista/Negócios)' },
  { id: 'Imigrante', label: '🚀 Imigrante Residente' },
  { id: 'Asilado/Refugiado', label: '🏳️ Requerente de Asilo / Refugiado' },
  { id: 'Nacional', label: '🇦🇴 Nacional (Apoio Interno)' },
  { id: 'Dupla', label: '🔀 Dupla Nacionalidade' }
];

export const SERVICOS_AAAI = [
  { id: 'Agendamento', label: '📅 Agendamento' },
  { id: 'Apoio Juridico', label: '⚖️ Consultoria Jurídica e Contencioso' },
  { id: 'Consulta', label: '🔍 Consulta' },
  { id: 'Emissao DIRE', label: '📇 Emissão de DIRE (Documento de Identidade de Residente Estrangeiro)' },
  { id: 'Renovacao DIRE', label: '📇 Renovação de DIRE' },
  { id: 'Regularização', label: '📋 Regularização' },
  { id: 'Renovação', label: '🔄 Renovação' },
  { id: 'Visto', label: '🛂 Visto' },
  { id: 'Visto Trabalho', label: '🛂 Prorrogação de Visto de Trabalho' },
  { id: 'Visto Residencia', label: '🛂 Pedido de Visto de Residência' },
  { id: 'Permanencia', label: '🤝 Autorização de Permanência Provisória' },
  { id: 'Outro', label: '📌 Outro' },
];

export const PAISES_ORIGEM = [
  'Angola', 'Guiné-Bissau', 'Brasil', 'Portugal', 'República Democrática do Congo', 'Congo-Brazzaville', 
  'China', 'Vietname', 'Líbano', 'Guiné-Conacri', 'Nigéria', 'Cabo Verde', 'Alemanha', 'Espanha',
  'São Tomé e Príncipe', 'Moçambique', 'Cuba', 'França',  'Timor-Leste', 'Macau',
  'África do Sul', 'Namíbia', 'Zâmbia', 'República Dominicana',
  'Niger', 'Gana', 'Senegal', 'Mali', 'Costa do Marfim',
  'Filipinas', 'Reino Unido', 'Estados Unidos', 'Canadá', 'Chile',
  'Índia', 'Bolívia', 'Colômbia', 'Venezuela', 'Marrocos',
  'Rússia', 'Ucrânia', 'Argentina', 'Equador', 'Itália',
  'Japão', 'Coreia do Sul', 'Austrália', 'Nova Zelândia', '-- Outros --'
  // Adicione outros países conforme necessário 
].sort();

export const PROVINCIAS_ANGOLA = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", "Cuanza Norte", 
  "Cuanza Sul", "Cunene", "Huambo", "Huíla", "Luanda", "Lunda Norte", 
  "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"
];
/*export const PROVINCIAS_ANGOLA = [
  'Luanda', 'Benguela', 'Huíla', 'Huambo', 'Bié', 'Malanje',
  'Uíge', 'Zaire', 'Cabinda', 'Cuanza Norte', 'Cuanza Sul',
  'Cuando Cubango', 'Moxico', 'Lunda Norte', 'Lunda Sul',
  'Namibe', 'Bengo', 'Luanda Sul'
];*/


