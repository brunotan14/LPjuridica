'use client'

import {
  agruparPorDia,
  eventosDaSemana,
  formatarDiaLongo,
} from '@/lib/agenda'
import type { Evento } from '@/types/agenda'
import { EventoRow } from './evento-row'
import { isSameDay, parseISO } from 'date-fns'

type Props = {
  eventos: Evento[]
  hoje?: Date
  onCumprir?: (evento: Evento) => void
  onPerder?: (evento: Evento) => void
}

export function AgendaWeekView({
  eventos,
  hoje = new Date(),
  onCumprir,
  onPerder,
}: Props) {
  const daSemana = eventosDaSemana(eventos, hoje)
  const grupos = agruparPorDia(daSemana)

  if (grupos.length === 0) {
    return (
      <section className="space-y-4">
        <Header total={0} />
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">Semana sem eventos</p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Nenhum prazo, audiência ou compromisso agendado entre domingo e sábado desta semana.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <Header total={daSemana.length} />
      {grupos.map(({ dia, items }) => {
        const isHoje = isSameDay(parseISO(dia), hoje)
        return (
          <div key={dia} className="space-y-2">
            <div className="flex items-baseline gap-2">
              <h3 className="text-sm font-semibold capitalize text-foreground">
                {formatarDiaLongo(dia)}
              </h3>
              {isHoje && (
                <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  Hoje
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                · {items.length} {items.length === 1 ? 'evento' : 'eventos'}
              </span>
            </div>
            <div className="space-y-2">
              {items.map((ev) => (
                <EventoRow
                  key={ev.id}
                  evento={ev}
                  hoje={hoje}
                  onCumprir={onCumprir}
                  onPerder={onPerder}
                />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}

function Header({ total }: { total: number }) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-base font-semibold text-foreground">Esta semana</h2>
      <p className="text-xs text-muted-foreground">
        {total} {total === 1 ? 'evento' : 'eventos'}
      </p>
    </div>
  )
}
