import { cn } from '@/lib/utils'
import type { StatusParcela } from '@/types/financeiro'

const CONFIG: Record<StatusParcela, { label: string; className: string }> = {
  pago: {
    label: 'Pago',
    className: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  },
  em_aberto: {
    label: 'Em aberto',
    className: 'bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/30',
  },
  atrasado: {
    label: 'Atrasado',
    className: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  },
}

export function BadgeStatusParcela({ status }: { status: StatusParcela }) {
  const { label, className } = CONFIG[status]
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
