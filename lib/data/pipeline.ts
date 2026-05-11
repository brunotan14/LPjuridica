import type { FaseProcessual, NivelSigilo } from '@/types/index'
import type { Processo } from '@/types/processos'
import type { Evento, Criticidade } from '@/types/agenda'
import { processosMock } from '@/lib/data/processos'
import { eventosMock } from '@/lib/data/agenda'
import { calcularCriticidade } from '@/lib/agenda'

// ─── Extended fake processos to fill all 9 columns ──────────────────────────

const processosFake: Processo[] = [
  // pre_processual (existing: proc-008) + 1 more
  {
    id: 'proc-011',
    numeroCNJ: '0011122-33.2026.8.26.0224',
    numeroInterno: 'LP-2026-001',
    alcunha: 'Caso Guarulhos Norte',
    tribunal: 'TJSP',
    comarca: 'Guarulhos',
    vara: '2ª Vara Criminal',
    faseAtual: 'pre_processual',
    sigilo: 'publico',
    responsavelInterno: 'Dr. André Souza',
    tiposPenais: [
      { id: 'art_155_cp_011', artigo: 'Art. 155', descricao: 'Furto', principal: true },
    ],
    partes: [
      { parteId: 'p-101', papel: 'cliente', nome: 'Carlos Eduardo Ramos' },
    ],
    criadoEm: '2026-04-10T10:00:00Z',
    atualizadoEm: '2026-05-01T10:00:00Z',
  },

  // inquerito (existing: proc-006) + 1 more
  {
    id: 'proc-012',
    numeroCNJ: '0022233-44.2025.8.26.0602',
    numeroInterno: 'LP-2025-009',
    alcunha: 'Operação Sorocaba',
    tribunal: 'TJSP',
    comarca: 'Sorocaba',
    vara: '1ª Vara Criminal',
    faseAtual: 'inquerito',
    sigilo: 'restrito',
    responsavelInterno: 'Dra. Camila Ferreira',
    tiposPenais: [
      { id: 'art_171_cp_012', artigo: 'Art. 171', descricao: 'Estelionato', principal: true },
      { id: 'art_297_cp_012', artigo: 'Art. 297', descricao: 'Falsificação de documento público', principal: false },
    ],
    partes: [
      { parteId: 'p-102', papel: 'cliente', nome: 'Marcos Vinícius Alves' },
      { parteId: 'p-103', papel: 'vitima', nome: 'Empresa ABC Ltda.' },
    ],
    criadoEm: '2025-11-15T09:00:00Z',
    atualizadoEm: '2026-04-20T11:00:00Z',
  },

  // denuncia_recebimento (existing: proc-002) + 1 more
  {
    id: 'proc-013',
    numeroCNJ: '0033344-55.2025.8.26.0114',
    numeroInterno: 'LP-2025-014',
    alcunha: 'Caso Santos Sul',
    tribunal: 'TJSP',
    comarca: 'Santos',
    vara: '3ª Vara Criminal',
    faseAtual: 'denuncia_recebimento',
    sigilo: 'segredo_de_justica',
    responsavelInterno: 'Dr. Leandro Pedrosa',
    tiposPenais: [
      { id: 'art_33_lei11343_013', artigo: 'Art. 33 Lei 11.343/06', descricao: 'Tráfico de drogas', principal: true },
    ],
    partes: [
      { parteId: 'p-104', papel: 'cliente', nome: 'Ana Paula Ferreira' },
      { parteId: 'p-105', papel: 'reu', nome: 'João Pedro Lima' },
    ],
    criadoEm: '2025-09-20T14:00:00Z',
    atualizadoEm: '2026-03-10T16:00:00Z',
  },

  // instrucao (existing: proc-001, proc-010) + 1 more
  {
    id: 'proc-014',
    numeroCNJ: '0044455-66.2025.8.26.0100',
    numeroInterno: 'LP-2025-020',
    alcunha: 'Operação Campinas Leste',
    tribunal: 'TJSP',
    comarca: 'Campinas',
    vara: '4ª Vara Criminal',
    juiz: 'Dr. Fábio Marques Costa',
    faseAtual: 'instrucao',
    sigilo: 'publico',
    responsavelInterno: 'Dr. André Souza',
    tiposPenais: [
      { id: 'art_121_cp_014', artigo: 'Art. 121', descricao: 'Homicídio doloso', principal: true },
    ],
    partes: [
      { parteId: 'p-106', papel: 'cliente', nome: 'Roberto Nascimento' },
      { parteId: 'p-107', papel: 'vitima', nome: 'Sílvia Andrade' },
    ],
    criadoEm: '2025-07-01T10:00:00Z',
    atualizadoEm: '2026-04-15T13:00:00Z',
  },

  // memoriais (existing: proc-003) + 1 more
  {
    id: 'proc-015',
    numeroCNJ: '0055566-77.2024.8.26.0050',
    numeroInterno: 'LP-2024-019',
    alcunha: 'Caso Paulista',
    tribunal: 'TJSP',
    comarca: 'São Paulo',
    vara: '2ª Vara Criminal',
    juiz: 'Dr. Claudio Ramos Neto',
    faseAtual: 'memoriais',
    sigilo: 'restrito',
    responsavelInterno: 'Dra. Camila Ferreira',
    tiposPenais: [
      { id: 'art_312_cp_015', artigo: 'Art. 312', descricao: 'Peculato', principal: true },
    ],
    partes: [
      { parteId: 'p-108', papel: 'cliente', nome: 'Eliane Costa Matos' },
    ],
    criadoEm: '2024-08-12T10:00:00Z',
    atualizadoEm: '2026-04-28T14:00:00Z',
  },

  // sentenca (existing: proc-004) + 1 more
  {
    id: 'proc-016',
    numeroCNJ: '0066677-88.2024.8.26.0602',
    numeroInterno: 'LP-2024-022',
    alcunha: 'Caso Sorocaba Centro',
    tribunal: 'TJSP',
    comarca: 'Sorocaba',
    vara: '2ª Vara Criminal',
    faseAtual: 'sentenca',
    sigilo: 'publico',
    responsavelInterno: 'Dr. André Souza',
    tiposPenais: [
      { id: 'art_157_cp_016', artigo: 'Art. 157', descricao: 'Roubo', principal: true },
    ],
    partes: [
      { parteId: 'p-109', papel: 'cliente', nome: 'Tiago Henrique Batista' },
      { parteId: 'p-110', papel: 'vitima', nome: 'Supermercado Central Ltda.' },
    ],
    criadoEm: '2024-04-10T11:00:00Z',
    atualizadoEm: '2026-04-30T09:00:00Z',
  },

  // recursos (existing: proc-005) — already has one; add another
  {
    id: 'proc-017',
    numeroCNJ: '0077788-99.2023.8.26.0114',
    numeroInterno: 'LP-2023-030',
    alcunha: 'Caso Campinas Sul',
    tribunal: 'TJSP',
    comarca: 'Campinas',
    vara: '3ª Vara Criminal',
    juiz: 'Dra. Beatriz Nakamura',
    faseAtual: 'recursos',
    sigilo: 'restrito',
    responsavelInterno: 'Dra. Camila Ferreira',
    tiposPenais: [
      { id: 'art_129_cp_017', artigo: 'Art. 129 §9º', descricao: 'Violência doméstica', principal: true },
    ],
    partes: [
      { parteId: 'p-111', papel: 'cliente', nome: 'Fernando Oliveira Prado' },
    ],
    criadoEm: '2023-05-20T09:00:00Z',
    atualizadoEm: '2026-03-15T14:00:00Z',
  },

  // execucao (existing: proc-007) — already has one; add another
  {
    id: 'proc-018',
    numeroCNJ: '0088899-11.2022.8.26.0050',
    numeroInterno: 'LP-2022-041',
    alcunha: 'Caso Tatuapé',
    tribunal: 'TJSP',
    comarca: 'São Paulo',
    vara: '6ª Vara de Execuções',
    faseAtual: 'execucao',
    sigilo: 'publico',
    responsavelInterno: 'Dr. Leandro Pedrosa',
    tiposPenais: [
      { id: 'art_155_cp_018', artigo: 'Art. 155', descricao: 'Furto qualificado', principal: true },
    ],
    partes: [
      { parteId: 'p-112', papel: 'cliente', nome: 'Vanessa Santos Rocha' },
    ],
    criadoEm: '2022-06-10T10:00:00Z',
    atualizadoEm: '2025-12-20T11:00:00Z',
  },

  // arquivado (existing: proc-009) — already has one
]

// ─── Events for pipeline fake processos ─────────────────────────────────────
// Today = 2026-05-11

export const eventosPipelineMock: Evento[] = [
  // proc-011 (pre_processual) → event hoje (criticidade: hoje)
  {
    id: 'ev-p011',
    tipo: 'reuniao',
    titulo: 'Reunião inicial — Carlos Ramos',
    data: '2026-05-11',
    hora: '09:00',
    processoId: 'proc-011',
    processoAlcunha: 'Caso Guarulhos Norte',
    responsavel: 'Dr. André Souza',
    status: 'agendado',
    criadoEm: '2026-05-05T10:00:00Z',
  },

  // proc-012 (inquerito) → event critica (2 days)
  {
    id: 'ev-p012',
    tipo: 'prazo',
    titulo: 'Manifestação no inquérito',
    data: '2026-05-13',
    dataFim: '2026-05-13',
    processoId: 'proc-012',
    processoAlcunha: 'Operação Sorocaba',
    responsavel: 'Dra. Camila Ferreira',
    status: 'pendente',
    criadoEm: '2026-05-03T08:00:00Z',
  },

  // proc-013 (denuncia_recebimento) → event proxima (5 days)
  {
    id: 'ev-p013',
    tipo: 'audiencia',
    titulo: 'Audiência de recebimento de denúncia',
    data: '2026-05-16',
    hora: '10:00',
    processoId: 'proc-013',
    processoAlcunha: 'Caso Santos Sul',
    responsavel: 'Dr. Leandro Pedrosa',
    status: 'agendado',
    criadoEm: '2026-04-25T09:00:00Z',
  },

  // proc-014 (instrucao) → event futuro (15 days)
  {
    id: 'ev-p014',
    tipo: 'audiencia',
    titulo: 'Audiência de instrução',
    data: '2026-05-26',
    hora: '14:00',
    processoId: 'proc-014',
    processoAlcunha: 'Operação Campinas Leste',
    responsavel: 'Dr. André Souza',
    status: 'agendado',
    criadoEm: '2026-04-20T10:00:00Z',
  },

  // proc-015 (memoriais) → event critica (1 day)
  {
    id: 'ev-p015',
    tipo: 'prazo',
    titulo: 'Memoriais escritos — Caso Paulista',
    data: '2026-05-12',
    dataFim: '2026-05-12',
    processoId: 'proc-015',
    processoAlcunha: 'Caso Paulista',
    responsavel: 'Dra. Camila Ferreira',
    status: 'pendente',
    criadoEm: '2026-04-28T11:00:00Z',
  },

  // proc-016 (sentenca) → event proxima (6 days)
  {
    id: 'ev-p016',
    tipo: 'audiencia',
    titulo: 'Leitura de sentença',
    data: '2026-05-17',
    hora: '11:00',
    processoId: 'proc-016',
    processoAlcunha: 'Caso Sorocaba Centro',
    responsavel: 'Dr. André Souza',
    status: 'agendado',
    criadoEm: '2026-05-01T10:00:00Z',
  },

  // proc-017 (recursos) → event futuro (20 days)
  {
    id: 'ev-p017',
    tipo: 'prazo',
    titulo: 'Contrarrazões de apelação',
    data: '2026-05-31',
    dataFim: '2026-05-31',
    processoId: 'proc-017',
    processoAlcunha: 'Caso Campinas Sul',
    responsavel: 'Dra. Camila Ferreira',
    status: 'pendente',
    criadoEm: '2026-04-15T09:00:00Z',
  },

  // proc-018 (execucao) → event futuro (10 days)
  {
    id: 'ev-p018',
    tipo: 'diligencia',
    titulo: 'Verificação de cumprimento de pena',
    data: '2026-05-21',
    processoId: 'proc-018',
    processoAlcunha: 'Caso Tatuapé',
    responsavel: 'Dr. Leandro Pedrosa',
    status: 'agendado',
    criadoEm: '2026-05-01T10:00:00Z',
  },
]

// ─── Combined mock ───────────────────────────────────────────────────────────

export const pipelineMock: Processo[] = [...processosMock, ...processosFake]

const todosEventos: Evento[] = [...eventosMock, ...eventosPipelineMock]

// ─── Filtros type ────────────────────────────────────────────────────────────

export interface PipelineFiltros {
  responsavel: string | null
  comarca: string | null
  tipoPenal: string | null
  sigilo: NivelSigilo | null
}

// ─── Utility functions ───────────────────────────────────────────────────────

export function getProcessosPorFase(
  processos: Processo[],
  filtros?: Partial<PipelineFiltros>
): Record<FaseProcessual, Processo[]> {
  const FASES: FaseProcessual[] = [
    'pre_processual',
    'inquerito',
    'denuncia_recebimento',
    'instrucao',
    'memoriais',
    'sentenca',
    'recursos',
    'execucao',
    'arquivado',
  ]

  let filtrados = processos

  if (filtros?.responsavel) {
    filtrados = filtrados.filter((p) => p.responsavelInterno === filtros.responsavel)
  }
  if (filtros?.comarca) {
    filtrados = filtrados.filter((p) => p.comarca === filtros.comarca)
  }
  if (filtros?.tipoPenal) {
    filtrados = filtrados.filter((p) =>
      p.tiposPenais.some((t) => t.descricao === filtros.tipoPenal)
    )
  }
  if (filtros?.sigilo) {
    filtrados = filtrados.filter((p) => p.sigilo === filtros.sigilo)
  }

  const result = {} as Record<FaseProcessual, Processo[]>
  for (const fase of FASES) {
    result[fase] = filtrados.filter((p) => p.faseAtual === fase)
  }
  return result
}

export function getProximoEvento(
  processoId: string,
  eventos: Evento[],
  hoje: Date = new Date()
): { evento: Evento; criticidade: Criticidade } | null {
  const pendentes = eventos.filter(
    (ev) =>
      ev.processoId === processoId &&
      (ev.status === 'pendente' || ev.status === 'agendado')
  )

  if (pendentes.length === 0) return null

  // Sort by date ascending, pick the earliest upcoming
  const sorted = [...pendentes].sort((a, b) => {
    const da = new Date(a.dataFim ?? a.data).getTime()
    const db = new Date(b.dataFim ?? b.data).getTime()
    return da - db
  })

  const evento = sorted[0]
  const criticidade = calcularCriticidade(evento, hoje)
  return { evento, criticidade }
}

export { todosEventos }

// ─── Accent colors per fase ──────────────────────────────────────────────────
// Used by processo-card and fase-coluna for consistent color theming.

export interface FaseAccent {
  strip: string       // left border strip on card / top strip on column
  headerText: string  // column header phase name color
  tipoPenalText: string // tipo penal highlight color on card
  dateBadgeBg: string   // date badge background on column header
  dateBadgeText: string
  countBg: string     // count badge background
  countText: string
}

export const FASE_ACCENT: Record<FaseProcessual, FaseAccent> = {
  pre_processual: {
    strip: 'bg-zinc-600',
    headerText: 'text-zinc-400',
    tipoPenalText: 'text-zinc-400',
    dateBadgeBg: 'bg-zinc-800',
    dateBadgeText: 'text-zinc-400',
    countBg: 'bg-zinc-800',
    countText: 'text-zinc-500',
  },
  inquerito: {
    strip: 'bg-amber-500',
    headerText: 'text-amber-400',
    tipoPenalText: 'text-amber-400',
    dateBadgeBg: 'bg-amber-950/60',
    dateBadgeText: 'text-amber-400',
    countBg: 'bg-amber-950/40',
    countText: 'text-amber-500',
  },
  denuncia_recebimento: {
    strip: 'bg-orange-500',
    headerText: 'text-orange-400',
    tipoPenalText: 'text-orange-400',
    dateBadgeBg: 'bg-orange-950/60',
    dateBadgeText: 'text-orange-400',
    countBg: 'bg-orange-950/40',
    countText: 'text-orange-500',
  },
  instrucao: {
    strip: 'bg-blue-500',
    headerText: 'text-blue-400',
    tipoPenalText: 'text-blue-400',
    dateBadgeBg: 'bg-blue-950/60',
    dateBadgeText: 'text-blue-400',
    countBg: 'bg-blue-950/40',
    countText: 'text-blue-500',
  },
  memoriais: {
    strip: 'bg-violet-500',
    headerText: 'text-violet-400',
    tipoPenalText: 'text-violet-400',
    dateBadgeBg: 'bg-violet-950/60',
    dateBadgeText: 'text-violet-400',
    countBg: 'bg-violet-950/40',
    countText: 'text-violet-500',
  },
  sentenca: {
    strip: 'bg-[#c9a961]',
    headerText: 'text-[#c9a961]',
    tipoPenalText: 'text-[#c9a961]',
    dateBadgeBg: 'bg-[#1a1408]',
    dateBadgeText: 'text-[#c9a961]',
    countBg: 'bg-[#1a1408]',
    countText: 'text-[#c9a961]',
  },
  recursos: {
    strip: 'bg-purple-500',
    headerText: 'text-purple-400',
    tipoPenalText: 'text-purple-400',
    dateBadgeBg: 'bg-purple-950/60',
    dateBadgeText: 'text-purple-400',
    countBg: 'bg-purple-950/40',
    countText: 'text-purple-500',
  },
  execucao: {
    strip: 'bg-red-500',
    headerText: 'text-red-400',
    tipoPenalText: 'text-red-400',
    dateBadgeBg: 'bg-red-950/60',
    dateBadgeText: 'text-red-400',
    countBg: 'bg-red-950/40',
    countText: 'text-red-500',
  },
  arquivado: {
    strip: 'bg-zinc-700',
    headerText: 'text-zinc-600',
    tipoPenalText: 'text-zinc-600',
    dateBadgeBg: 'bg-zinc-800',
    dateBadgeText: 'text-zinc-600',
    countBg: 'bg-zinc-800',
    countText: 'text-zinc-600',
  },
}
