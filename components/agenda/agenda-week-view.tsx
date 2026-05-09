'use client'

import { format, isSameDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarX } from 'lucide-react'
import { agruparPorDia, eventosDaSemana } from '@/lib/agenda'
import type { Evento } from '@/types/agenda'
import { EventoRow } from './evento-row'

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

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-foreground">Esta semana</h2>
        <p className="text-xs text-muted-foreground">
          {daSemana.length}{' '}
          {daSemana.length === 1 ? 'evento' : 'eventos'}
        </p>
      </div>

      {grupos.length === 0 ? (
        <EmptyWeek />
      ) : (
        <div className="space-y-6">
          {grupos.map(({ dia, items }) => {
            const isHoje = isSameDay(parseISO(dia), hoje)
            const diaSemana = format(parseISO(dia), 'EEEE', { locale: ptBR })
            const diaNum = format(parseISO(dia), 'd')
            const mes = format(parseISO(dia), 'MMM', { locale: ptBR })

            return (
              <div key={dia} className="space-y-2">
                {/* Cabeçalho do dia */}
                <div className="flex items-center gap-3">
                  {/* Círculo com número do dia */}
                  <div
                    className={
                      isHoje
                        ? 'flex size-9 shrink-0 flex-col items-center justify-center rounded-full bg-primary shadow-sm shadow-primary/30'
                        : 'flex size-9 shrink-0 flex-col items-center justify-center rounded-full border border-border bg-card'
                    }
                  >
                    <span
                      className={
                        isHoje
                          ? 'font-cinzel text-sm font-semibold leading-none text-primary-foreground'
                          : 'font-cinzel text-sm font-medium leading-none text-secondary-foreground'
                      }
                    >
                      {diaNum}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-semibold capitalize text-foreground">
                      {diaSemana}
                    </h3>
                    <span className="text-xs capitalize text-muted-foreground">
                      {mes}
                    </span>
                    {isHoje && (
                      <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        Hoje
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground/50">
                      · {items.length}{' '}
                      {items.length === 1 ? 'evento' : 'eventos'}
                    </span>
                  </div>
                </div>

                {/* Separador horizontal */}
                <div className="h-px bg-border/50" />

                {/* Eventos do dia */}
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
        </div>
      )}
    </section>
  )
}

function EmptyWeek() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/20 px-6 py-16 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted/50">
        <CalendarX className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">Semana sem eventos</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Nenhum prazo, audiência ou compromisso agendado entre domingo e sábado
        desta semana.
      </p>
    </div>
  )
}
