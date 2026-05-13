export type TipoContrato = 'contratual' | 'exito' | 'pro_bono' | 'dativo'

export type GatilhoExito =
  | 'absolvicao'
  | 'desclassificacao'
  | 'reducao_de_pena'

export type StatusParcela = 'em_aberto' | 'pago' | 'atrasado'

export type FormaPagamento = 'pix' | 'transferencia' | 'dinheiro' | 'boleto'

export type IntervaloParcela = 'mensal' | 'quinzenal'

export type CategoriaDespesa =
  | 'custas'
  | 'pericia'
  | 'viagem'
  | 'cartorio'
  | 'outro'

export type StatusDespesa = 'pendente' | 'reembolsado'

export interface Parcela {
  id: string
  contratoId: string
  processoId: string
  processoAlcunha: string
  clienteNome: string
  numero: number
  valor: number
  vencimento: string
  status: StatusParcela
  pago?: {
    data: string
    forma: FormaPagamento
    observacoes?: string
  }
}

export interface ContratoHonorarios {
  id: string
  processoId: string
  tipo: TipoContrato
  parteContratanteId: string
  parteContratanteNome: string
  criadoEm: string
  // Contratual
  valorTotal?: number
  quantidadeParcelas?: number
  dataPrimeiraParcela?: string
  intervalo?: IntervaloParcela
  parcelas?: Parcela[]
  // Êxito
  gatilho?: GatilhoExito
  percentual?: number
  valorEstimado?: number
}

export interface Despesa {
  id: string
  processoId: string
  categoria: CategoriaDespesa
  descricao: string
  valor: number
  data: string
  status: StatusDespesa
  comprovante?: string
  reembolsadoEm?: string
}
