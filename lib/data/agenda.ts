import type { Evento } from '@/types/agenda'

// Hoje (referência): 2026-05-09. Datas são relativas a essa âncora.
export const eventosMock: Evento[] = [
  // ─── PRAZO HOJE (pulsante) ───────────────────────────────────────────────
  {
    id: 'ev-001',
    tipo: 'prazo',
    titulo: 'Recurso de Apelação — prazo fatal',
    data: '2026-05-09',
    dataFim: '2026-05-09',
    processoId: 'proc-001',
    processoNumero: '0012345-67.2024.8.26.0050',
    processoAlcunha: 'Caso Tremembé',
    responsavel: 'Dr. Leandro Pedrosa',
    descricao:
      'Protocolar recurso de apelação contra sentença condenatória. Cliente preso preventivamente.',
    status: 'pendente',
    criadoEm: '2026-04-25T09:00:00Z',
  },

  // ─── PRAZO D-1 (vermelho crítico) ────────────────────────────────────────
  {
    id: 'ev-002',
    tipo: 'prazo',
    titulo: 'Contestação — Operação Lagoa Dourada',
    data: '2026-05-10',
    dataFim: '2026-05-10',
    processoId: 'proc-002',
    processoNumero: '0023456-78.2024.8.19.0001',
    processoAlcunha: 'Operação Lagoa Dourada',
    responsavel: 'Dr. Leandro Pedrosa',
    descricao: 'Resposta à acusação no prazo do art. 396 CPP.',
    status: 'pendente',
    criadoEm: '2026-04-28T14:00:00Z',
  },

  // ─── PRAZO D-3 (vermelho) ─────────────────────────────────────────────────
  {
    id: 'ev-003',
    tipo: 'prazo',
    titulo: 'Alegações Finais por memoriais',
    data: '2026-05-12',
    dataFim: '2026-05-12',
    processoId: 'proc-003',
    processoNumero: '0034567-89.2023.8.13.0024',
    processoAlcunha: 'Caso Mineração Norte',
    responsavel: 'Dr. Leandro Pedrosa',
    descricao: 'Apresentar alegações finais escritas — defesa.',
    status: 'pendente',
    criadoEm: '2026-04-30T11:30:00Z',
  },

  // ─── PRAZO D-6 (âmbar próximo) ───────────────────────────────────────────
  {
    id: 'ev-004',
    tipo: 'prazo',
    titulo: 'Memoriais finais — Caso Jardins',
    data: '2026-05-15',
    dataFim: '2026-05-15',
    processoId: 'proc-004',
    processoNumero: '0045678-12.2023.8.26.0100',
    processoAlcunha: 'Caso Jardins',
    responsavel: 'Dr. Leandro Pedrosa',
    descricao: 'Memoriais escritos antes da sentença.',
    status: 'pendente',
    criadoEm: '2026-05-01T16:20:00Z',
  },

  // ─── PRAZO D-15 (verde futuro) ───────────────────────────────────────────
  {
    id: 'ev-005',
    tipo: 'prazo',
    titulo: 'Manifestação sobre laudo pericial',
    data: '2026-05-24',
    dataFim: '2026-05-24',
    processoId: 'proc-005',
    processoNumero: '0056789-23.2022.8.26.0050',
    processoAlcunha: 'Operação Pinheiros',
    responsavel: 'Dr. Leandro Pedrosa',
    descricao:
      'Manifestar-se em 15 dias sobre laudo de exame de corpo de delito juntado.',
    status: 'pendente',
    criadoEm: '2026-05-08T10:00:00Z',
  },

  // ─── PRAZO PERDIDO ────────────────────────────────────────────────────────
  {
    id: 'ev-006',
    tipo: 'prazo',
    titulo: 'Embargos de Declaração — Caso Faria Lima',
    data: '2026-05-08',
    dataFim: '2026-05-08',
    processoId: 'proc-006',
    processoNumero: '0067890-34.2024.4.03.6100',
    processoAlcunha: 'Caso Faria Lima',
    responsavel: 'Dr. Leandro Pedrosa',
    descricao: 'Embargos contra omissão da decisão de recebimento.',
    status: 'perdido',
    justificativaPerdido:
      'Cliente solicitou suspensão da estratégia recursal por questões pessoais. Decisão registrada em ata.',
    criadoEm: '2026-04-20T08:30:00Z',
  },

  // ─── PRAZO CUMPRIDO (concluído) ──────────────────────────────────────────
  {
    id: 'ev-007',
    tipo: 'prazo',
    titulo: 'Petição inicial — Habeas Corpus',
    data: '2026-05-05',
    dataFim: '2026-05-05',
    processoId: 'proc-007',
    processoNumero: '0078901-45.2021.8.26.0114',
    processoAlcunha: 'Caso Campinas Centro',
    responsavel: 'Dr. Leandro Pedrosa',
    descricao: 'Impetrar HC liberatório no TJSP.',
    status: 'cumprido',
    descricaoCumprimento:
      'HC nº 2098765-43.2026 protocolado às 16:42. Distribuído à 7ª Câmara Criminal.',
    criadoEm: '2026-04-15T12:00:00Z',
  },

  // ─── AUDIÊNCIA D-2 ────────────────────────────────────────────────────────
  {
    id: 'ev-008',
    tipo: 'audiencia',
    titulo: 'Audiência de Instrução e Julgamento',
    data: '2026-05-11',
    hora: '14:30',
    local: 'Comarca de Belo Horizonte — 4ª Vara Criminal',
    processoId: 'proc-008',
    processoNumero: '0089012-56.2023.8.13.0079',
    processoAlcunha: 'Operação Contagem',
    partesPresentes: [
      'Marcelo Rodrigues (réu)',
      'Testemunha 1 — Carlos Andrade',
      'Testemunha 2 — Joana Lima',
    ],
    responsavel: 'Dr. Leandro Pedrosa',
    descricao: 'Inquirição de 2 testemunhas de defesa + interrogatório do réu.',
    status: 'agendado',
    criadoEm: '2026-04-10T15:00:00Z',
  },

  // ─── AUDIÊNCIA D-9 ────────────────────────────────────────────────────────
  {
    id: 'ev-009',
    tipo: 'audiencia',
    titulo: 'Sessão do Tribunal do Júri',
    data: '2026-05-18',
    hora: '09:00',
    local: 'Fórum Criminal Barra Funda — 1º Tribunal do Júri',
    processoId: 'proc-009',
    processoNumero: '0090123-67.2020.8.26.0050',
    processoAlcunha: 'Caso Consolação',
    partesPresentes: [
      'Antônio Pereira (réu)',
      'Família da vítima (assistente)',
    ],
    responsavel: 'Dr. Leandro Pedrosa',
    descricao: 'Sessão plenária — homicídio qualificado.',
    status: 'agendado',
    criadoEm: '2026-03-20T10:00:00Z',
  },

  // ─── VISITA AO PRESO D-1 ─────────────────────────────────────────────────
  {
    id: 'ev-010',
    tipo: 'visita_preso',
    titulo: 'Visita técnica — Rafael Mendonça',
    data: '2026-05-10',
    hora: '10:00',
    local: 'Penitenciária de Tremembé — Bloco A',
    parteId: 'p-001',
    parteNome: 'Rafael Augusto Mendonça',
    processoId: 'proc-001',
    processoNumero: '0012345-67.2024.8.26.0050',
    processoAlcunha: 'Caso Tremembé',
    responsavel: 'Dr. Leandro Pedrosa',
    descricao:
      'Alinhar estratégia recursal antes do prazo. Levar cópia da sentença.',
    status: 'agendado',
    criadoEm: '2026-05-05T18:00:00Z',
  },

  // ─── REUNIÃO COM CLIENTE D-4 ─────────────────────────────────────────────
  {
    id: 'ev-011',
    tipo: 'reuniao',
    titulo: 'Reunião — Fernanda Oliveira',
    data: '2026-05-13',
    hora: '16:00',
    local: 'Escritório — Sala 4',
    parteId: 'p-002',
    parteNome: 'Fernanda Cristina Oliveira',
    responsavel: 'Dr. Leandro Pedrosa',
    descricao:
      'Apresentação da minuta do contrato de honorários e discussão da denúncia recebida.',
    status: 'agendado',
    criadoEm: '2026-05-07T09:30:00Z',
  },

  // ─── DILIGÊNCIA D-7 ──────────────────────────────────────────────────────
  {
    id: 'ev-012',
    tipo: 'diligencia',
    titulo: 'Coleta de cópia integral dos autos',
    data: '2026-05-16',
    hora: '11:00',
    local: 'Fórum Criminal Central — Cartório da 9ª Vara',
    processoId: 'proc-010',
    processoNumero: '0001234-89.2024.8.26.0050',
    processoAlcunha: 'Operação Liberdade',
    responsavel: 'Dr. Leandro Pedrosa',
    descricao:
      'Solicitar carga dos autos físicos (processo anterior à digitalização).',
    status: 'agendado',
    criadoEm: '2026-05-06T13:00:00Z',
  },

  // ─── AUDIÊNCIA REALIZADA (histórico) ─────────────────────────────────────
  {
    id: 'ev-013',
    tipo: 'audiencia',
    titulo: 'Audiência preliminar — denúncia',
    data: '2026-04-28',
    hora: '13:30',
    local: 'Comarca de São Paulo — 5ª Vara Criminal',
    processoId: 'proc-002',
    processoNumero: '0023456-78.2024.8.19.0001',
    processoAlcunha: 'Operação Lagoa Dourada',
    responsavel: 'Dr. Leandro Pedrosa',
    descricao: 'Recebimento da denúncia. Defesa preliminar oferecida em ata.',
    status: 'realizado',
    criadoEm: '2026-04-01T11:00:00Z',
  },
]
