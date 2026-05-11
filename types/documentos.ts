export type CategoriaDocumento =
  | 'procuracao'
  | 'contrato_honorarios'
  | 'peca_inicial'
  | 'contestacao'
  | 'recurso'
  | 'decisao_judicial'
  | 'prova_documental'
  | 'laudo_pericial'
  | 'midia'

export type AcaoAcesso = 'upload' | 'visualizacao' | 'download' | 'nova_versao'

export interface DocumentoVersao {
  versao: number
  autor: string
  criadoEm: string
  tamanhoBytes: number
}

export interface AcessoLog {
  id: string
  usuarioNome: string
  acao: AcaoAcesso
  criadoEm: string
}

export interface Documento {
  id: string
  processoId: string
  titulo: string
  categoria: CategoriaDocumento
  versaoAtual: number
  sigiloso: boolean
  ultimoAcesso: string
  tamanhoBytes: number
  tipoArquivo: string
  versoes: DocumentoVersao[]
  acessoLog: AcessoLog[]
  criadoEm: string
}
