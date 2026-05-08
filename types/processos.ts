import type { FaseProcessual, NivelSigilo } from '@/types/index'

export type TipoPenal = string

export interface TipoPenalInfo {
  id: string
  artigo: string
  descricao: string
  principal: boolean
}

export interface ParteProcesso {
  parteId: string
  papel: 'cliente' | 'reu' | 'vitima' | 'testemunha'
  nome: string
}

export interface Processo {
  id: string
  numeroCNJ: string
  numeroInterno?: string
  alcunha: string
  tribunal: string
  comarca: string
  vara: string
  juiz?: string
  faseAtual: FaseProcessual
  sigilo: NivelSigilo
  responsavelInterno: string
  tiposPenais: TipoPenalInfo[]
  partes: ParteProcesso[]
  observacoes?: string
  criadoEm: string
  atualizadoEm: string
}
