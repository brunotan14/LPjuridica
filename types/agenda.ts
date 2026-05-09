export type TipoEvento =
  | 'prazo'
  | 'audiencia'
  | 'visita_preso'
  | 'reuniao'
  | 'diligencia'

export type StatusEvento =
  | 'pendente' // prazo aguardando ação
  | 'cumprido' // prazo concluído com descrição
  | 'perdido' // prazo perdido (com justificativa)
  | 'agendado' // audiência/visita/reunião/diligência futura
  | 'realizado' // evento já ocorrido
  | 'cancelado' // evento cancelado

export type Evento = {
  id: string
  tipo: TipoEvento
  titulo: string

  // Tempo
  data: string // ISO date (data principal)
  dataFim?: string // ISO date — usado para "prazo fatal" em prazos
  hora?: string // 'HH:mm'

  // Vínculos
  processoId?: string
  processoNumero?: string // CNJ, denormalizado para display
  processoAlcunha?: string // alcunha do processo, para chips
  parteId?: string
  parteNome?: string
  partesPresentes?: string[] // para audiência

  // Local
  local?: string // genérico: comarca/vara, unidade prisional, endereço

  // Pessoas
  responsavel: string

  // Texto livre
  descricao?: string

  // Status e auditoria leve
  status: StatusEvento
  descricaoCumprimento?: string // preenchido ao marcar prazo como cumprido
  justificativaPerdido?: string // preenchido ao marcar prazo como perdido

  criadoEm: string
}

// ─── Criticidade temporal ──────────────────────────────────────────────────
// Reflete a urgência do evento em relação a hoje. Aplica a prazos
// principalmente, mas também colore listagens dos demais tipos.
export type Criticidade =
  | 'futuro' // > 7 dias
  | 'proxima' // 3 a 7 dias
  | 'critica' // < 3 dias
  | 'hoje' // dia (recebe pulse animado)
  | 'perdido' // prazo vencido sem ação
  | 'concluido' // já cumprido / realizado / cancelado

// Metadados visuais por tipo de evento
export const TIPO_META: Record<
  TipoEvento,
  { label: string; chipBg: string; chipText: string; chipBorder: string }
> = {
  prazo: {
    label: 'Prazo',
    chipBg: 'bg-primary/15',
    chipText: 'text-primary',
    chipBorder: 'border-primary/30',
  },
  audiencia: {
    label: 'Audiência',
    chipBg: 'bg-amber-500/15',
    chipText: 'text-amber-400',
    chipBorder: 'border-amber-500/30',
  },
  visita_preso: {
    label: 'Visita ao preso',
    chipBg: 'bg-red-500/15',
    chipText: 'text-red-400',
    chipBorder: 'border-red-500/30',
  },
  reuniao: {
    label: 'Reunião',
    chipBg: 'bg-emerald-500/15',
    chipText: 'text-emerald-400',
    chipBorder: 'border-emerald-500/30',
  },
  diligencia: {
    label: 'Diligência',
    chipBg: 'bg-zinc-500/15',
    chipText: 'text-zinc-300',
    chipBorder: 'border-zinc-500/30',
  },
}

export const CRITICIDADE_META: Record<
  Criticidade,
  { dotClass: string; ringClass: string; label: string }
> = {
  futuro: {
    dotClass: 'bg-emerald-500',
    ringClass: 'ring-emerald-500/30',
    label: 'Futuro',
  },
  proxima: {
    dotClass: 'bg-amber-400',
    ringClass: 'ring-amber-400/30',
    label: 'Próximo',
  },
  critica: {
    dotClass: 'bg-red-500',
    ringClass: 'ring-red-500/30',
    label: 'Crítico',
  },
  hoje: {
    dotClass: 'bg-red-400 animate-pulse-critical',
    ringClass: 'ring-red-400/40',
    label: 'Hoje',
  },
  perdido: {
    dotClass: 'bg-zinc-500',
    ringClass: 'ring-zinc-500/30',
    label: 'Perdido',
  },
  concluido: {
    dotClass: 'bg-zinc-600',
    ringClass: 'ring-zinc-600/20',
    label: 'Concluído',
  },
}
