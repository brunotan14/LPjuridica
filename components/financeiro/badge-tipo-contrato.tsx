import { cn } from '@/lib/utils'
import type { TipoContrato } from '@/types/financeiro'

const CONFIG: Record<TipoContrato, { label: string; className: string }> = {
  contratual: {
    label: 'Contratual',
    className: 'bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30',
  },
  exito: {
    label: 'Êxito',
    className: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
  },
  pro_bono: {
    label: 'Pro Bono',
    className: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  },
  dativo: {
    label: 'Dativo',
    className: 'bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/30',
  },
}

export function BadgeTipoContrato({ tipo }: { tipo: TipoContrato }) {
  const { label, className } = CONFIG[tipo]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
        className,
      )}
    >
      {label}
    </span>
  )
}
