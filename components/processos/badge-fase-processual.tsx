import { cn } from '@/lib/utils'
import type { FaseProcessual } from '@/types/index'

export const FASE_LABELS: Record<FaseProcessual, string> = {
  pre_processual: 'Pré-processual',
  inquerito: 'Inquérito',
  denuncia_recebimento: 'Denúncia/Recebimento',
  instrucao: 'Instrução',
  memoriais: 'Memoriais',
  sentenca: 'Sentença',
  recursos: 'Recursos',
  execucao: 'Execução',
  arquivado: 'Arquivado',
}

const FASE_STYLES: Record<FaseProcessual, string> = {
  pre_processual: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  inquerito: 'bg-amber-950 text-amber-400 border-amber-900',
  denuncia_recebimento: 'bg-orange-950 text-orange-400 border-orange-900',
  instrucao: 'bg-blue-950 text-blue-400 border-blue-900',
  memoriais: 'bg-violet-950 text-violet-400 border-violet-900',
  sentenca: 'bg-indigo-950 text-indigo-400 border-indigo-900',
  recursos: 'bg-purple-950 text-purple-400 border-purple-900',
  execucao: 'bg-red-950 text-red-400 border-red-900',
  arquivado: 'bg-zinc-900 text-zinc-600 border-zinc-800 opacity-70',
}

interface BadgeFaseProcessualProps {
  fase: FaseProcessual
  className?: string
}

export function BadgeFaseProcessual({ fase, className }: BadgeFaseProcessualProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        FASE_STYLES[fase],
        className,
      )}
    >
      {FASE_LABELS[fase]}
    </span>
  )
}
