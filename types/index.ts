export type Role = 'titular' | 'associado' | 'secretaria' | 'estagiario'

export type TipoParte = 'cliente' | 'reu' | 'vitima' | 'testemunha' | 'autoridade'

export type SituacaoPrisional = 'preso_preventivo' | 'preso_definitivo' | 'solto' | 'liberdade_provisoria'

export type FaseProcessual =
  | 'pre_processual'
  | 'inquerito'
  | 'denuncia_recebimento'
  | 'instrucao'
  | 'memoriais'
  | 'sentenca'
  | 'recursos'
  | 'execucao'
  | 'arquivado'

export type NivelSigilo = 'publico' | 'restrito' | 'segredo_de_justica'

export type TipoEvento = 'prazo' | 'audiencia' | 'visita_preso' | 'reuniao' | 'diligencia'

export type StatusPrazo = 'pendente' | 'cumprido' | 'perdido'

export type TipoAlerta = 'D-7' | 'D-3' | 'D-1' | 'dia'

export type TipoContrato = 'contratual' | 'exito' | 'pro_bono' | 'dativo'

export type StatusParcela = 'em_aberto' | 'pago' | 'atrasado'

export type FormaPagamento = 'pix' | 'transferencia' | 'dinheiro' | 'boleto'
