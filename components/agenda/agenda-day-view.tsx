'use client'

import { eventosDoDia, formatarDiaLongo } from '@/lib/agenda'
import type { Evento } from '@/types/agenda'
import { EventoRow } from './evento-row'

type Props = {
  eventos: Evento[]
  hoje?: Date
  onCumprir?: (evento: Evento) => void
  onPerder?: (evento: Evento) => void
}

export function AgendaDayView({
  eventos,
  hoje = new Date(),
  onCumprir,
  onPerder,
}: Props) {
  const doDia = eventosDoDia(eventos, hoje)
  const isoHoje = hoje.toISOString().slice(0, 10)

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold capitalize text-foreground">
          {formatarDiaLongo(isoHoje)}
        </h2>
        <p className="text-xs text-muted-foreground">
          {doDia.length} {doDia.length === 1 ? 'evento' : 'eventos'}
        </p>
      </div>

      {doDia.length === 0 ? (
        <EmptyState
          title="Nenhum evento hoje"
          subtitle="Aproveite para revisar processos pendentes ou adiantar peças."
        />
      ) : (
        <div className="space-y-2">
          {doDia.map((ev) => (
            <EventoRow
              key={ev.id}
              evento={ev}
              hoje={hoje}
              onCumprir={onCumprir}
              onPerder={onPerder}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{subtitle}</p>
    </div>
  )
}
