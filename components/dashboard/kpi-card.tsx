import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type Props = {
  label: string
  value: string
  icon: LucideIcon
  highlight?: boolean
}

export function KpiCard({ label, value, icon: Icon, highlight = false }: Props) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-5 transition-colors',
        highlight ? 'border-red-500/30 bg-red-500/5' : 'border-border',
      )}
    >
      <div className="flex items-start justify-between">
        <p
          className={cn(
            'text-xs font-medium',
            highlight ? 'text-red-400' : 'text-muted-foreground',
          )}
        >
          {label}
        </p>
        <div
          className={cn(
            'flex size-7 items-center justify-center rounded-lg',
            highlight
              ? 'bg-red-500/15 text-red-400'
              : 'bg-muted text-muted-foreground',
          )}
        >
          <Icon className="size-3.5" />
        </div>
      </div>
      <p
        className={cn(
          'mt-3 text-2xl font-semibold',
          highlight ? 'text-red-300' : 'text-foreground',
        )}
      >
        {value}
      </p>
    </div>
  )
}

export function KpiCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="size-7 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="mt-3 h-8 w-16 animate-pulse rounded bg-muted" />
    </div>
  )
}
