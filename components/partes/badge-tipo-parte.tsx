import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TipoParte } from '@/types/partes'

const configByTipo: Record<
  TipoParte,
  { label: string; className: string; showWarning?: boolean }
> = {
  cliente: {
    label: 'Cliente',
    className: 'bg-[#1a1408] text-primary border border-[#2a1f08]',
  },
  reu: {
    label: 'Réu',
    className: 'bg-red-950 text-red-400 border border-red-900',
    showWarning: true,
  },
  vitima: {
    label: 'Vítima',
    className: 'bg-amber-950 text-amber-400 border border-amber-900',
  },
  testemunha: {
    label: 'Testemunha',
    className: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
  },
}

interface BadgeTipoParteProps {
  tipo: TipoParte
  className?: string
}

export function BadgeTipoParte({ tipo, className }: BadgeTipoParteProps) {
  const config = configByTipo[tipo]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        config.className,
        className,
      )}
    >
      {config.showWarning && <AlertTriangle className="size-3" />}
      {config.label}
    </span>
  )
}
