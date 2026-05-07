export type TipoParte = 'cliente' | 'reu' | 'vitima' | 'testemunha'
export type SituacaoPrisional = 'preso' | 'solto' | 'monitorado'
export type StatusParte = 'ativo' | 'arquivado'

export interface ProcessoVinculado {
  id: string
  numero: string
  papel: string
}

export interface Parte {
  id: string
  nome: string
  cpf: string
  rg?: string
  dataNascimento?: string
  filiacao?: string
  naturalidade?: string
  profissao?: string
  telefone: string
  email?: string
  endereco?: string
  tipo: TipoParte
  status: StatusParte
  situacaoPrisional?: SituacaoPrisional
  unidadePrisional?: string
  processosVinculados: ProcessoVinculado[]
  observacoes?: string
  criadoEm: string
  atualizadoEm: string
}
