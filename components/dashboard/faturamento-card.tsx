import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  mesAtual: { label: string; valor: number }
  mesAnterior: { label: string; valor: number }
}

function formatBRL(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function FaturamentoCard({ mesAtual, mesAnterior }: Props) {
  const diff = mesAtual.valor - mesAnterior.valor
  const pct =
    mesAnterior.valor > 0
      ? Math.round((Math.abs(diff) / mesAnterior.valor) * 100)
      : 0
  const positivo = diff >= 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-muted-foreground">{mesAtual.label}</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">
          {formatBRL(mesAtual.valor)}
        </p>
      </div>
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-3 py-2',
          positivo
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-red-500/10 text-red-400',
        )}
      >
        {positivo ? (
          <TrendingUp className="size-3.5 shrink-0" />
        ) : (
          <TrendingDown className="size-3.5 shrink-0" />
        )}
        <span className="text-xs font-medium">
          {positivo ? '+' : '-'}
          {pct}% vs {mesAnterior.label} ({formatBRL(mesAnterior.valor)})
        </span>
      </div>
    </div>
  )
}

export function FaturamentoCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        <div className="mt-1 h-8 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  )
}
