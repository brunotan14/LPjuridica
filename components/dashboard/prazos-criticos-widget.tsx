import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { eventosMock } from '@/lib/data/agenda'
import { calcularCriticidade, formatarDiaCurto } from '@/lib/agenda'
import { CriticidadeDot } from '@/components/agenda/criticidade-dot'

type Props = {
  hoje?: Date
}

export function PrazosCriticosWidget({ hoje = new Date() }: Props) {
  // Pega só prazos pendentes em criticidade hoje/critica/proxima — máximo 5.
  const prazos = eventosMock
    .filter((ev) => ev.tipo === 'prazo' && ev.status === 'pendente')
    .map((ev) => ({ ev, crit: calcularCriticidade(ev, hoje) }))
    .filter((x) => ['hoje', 'critica', 'proxima'].includes(x.crit))
    .sort((a, b) => {
      const order = { hoje: 0, critica: 1, proxima: 2 } as const
      return (
        order[a.crit as keyof typeof order] -
        order[b.crit as keyof typeof order]
      )
    })
    .slice(0, 5)

  if (prazos.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-zinc-700">
        <p className="text-sm text-zinc-600">Nenhum prazo crítico</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {prazos.map(({ ev, crit }) => (
        <Link
          key={ev.id}
          href="/agenda?view=dia"
          className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-2.5 transition-colors hover:border-primary/40 hover:bg-zinc-900"
        >
          <CriticidadeDot criticidade={crit} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-100">
              {ev.titulo}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {formatarDiaCurto(ev.dataFim ?? ev.data)}
              {ev.processoAlcunha && ` · ${ev.processoAlcunha}`}
            </p>
          </div>
        </Link>
      ))}
      <Link
        href="/agenda"
        className="mt-2 flex items-center justify-end gap-1 text-xs font-medium text-primary transition-colors hover:text-accent-foreground"
      >
        Ver agenda completa
        <ArrowRight className="size-3" />
      </Link>
    </div>
  )
}
