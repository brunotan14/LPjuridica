import Link from 'next/link'
import { ArrowRight, Gavel } from 'lucide-react'
import { eventosMock } from '@/lib/data/agenda'
import { formatarDiaCurto } from '@/lib/agenda'
import { differenceInCalendarDays, parseISO } from 'date-fns'

type Props = {
  hoje?: Date
}

export function ProximasAudienciasWidget({ hoje = new Date() }: Props) {
  const audiencias = eventosMock
    .filter((ev) => ev.tipo === 'audiencia' && ev.status === 'agendado')
    .filter((ev) => differenceInCalendarDays(parseISO(ev.data), hoje) >= 0)
    .sort((a, b) => parseISO(a.data).getTime() - parseISO(b.data).getTime())
    .slice(0, 4)

  if (audiencias.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-zinc-700">
        <p className="text-sm text-zinc-600">Nenhuma audiência próxima</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {audiencias.map((ev) => (
        <Link
          key={ev.id}
          href="/agenda"
          className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-2.5 transition-colors hover:border-amber-500/40 hover:bg-zinc-900"
        >
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-400">
            <Gavel className="size-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-100">
              {ev.titulo}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {formatarDiaCurto(ev.data)}
              {ev.hora && ` · ${ev.hora}`}
              {ev.processoAlcunha && ` · ${ev.processoAlcunha}`}
            </p>
            {ev.local && (
              <p className="mt-0.5 truncate text-[11px] text-zinc-600">
                {ev.local}
              </p>
            )}
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
