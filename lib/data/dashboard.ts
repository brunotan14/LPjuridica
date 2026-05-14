import { parcelasMock } from './financeiro'
import { processosMock } from './processos'

export const processosAtivos = processosMock.filter(
  (p) => p.faseAtual !== 'arquivado',
).length

export const inadimplenciaTotal = parcelasMock
  .filter((p) => p.status === 'atrasado')
  .reduce((sum, p) => sum + p.valor, 0)

const FASES: { key: string; label: string }[] = [
  { key: 'pre_processual', label: 'Pré-Processual' },
  { key: 'inquerito', label: 'Inquérito' },
  { key: 'denuncia_recebimento', label: 'Denúncia/Recebimento' },
  { key: 'instrucao', label: 'Instrução' },
  { key: 'memoriais', label: 'Memoriais' },
  { key: 'sentenca', label: 'Sentença' },
  { key: 'recursos', label: 'Recursos' },
  { key: 'execucao', label: 'Execução' },
]

export const distribuicaoFase = FASES.map(({ key, label }) => ({
  fase: label,
  total: processosMock.filter((p) => p.faseAtual === key).length,
}))

// Placeholder — substituir por queries Supabase na fase de backend do M10
export const faturamentoMock = {
  mesAtual: { label: 'Maio/2026', valor: 15000 },
  mesAnterior: { label: 'Abril/2026', valor: 22500 },
}
