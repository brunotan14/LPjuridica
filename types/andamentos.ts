export type TipoAndamento =
  | 'andamento_oficial'
  | 'peca_produzida'
  | 'comunicacao_cliente'
  | 'anotacao_interna'
  | 'evento_audiencia'

export interface Andamento {
  id: string
  processoId: string
  tipo: TipoAndamento
  data: string
  descricao: string
  autor: string
  confidencial: boolean
  anexoUrl?: string
  criadoEm: string
}
