'use client'

import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarX } from 'lucide-react'
import { eventosDoDia } from '@/lib/agenda'
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

  // Separa eventos com hora (timed) de eventos de dia inteiro (prazo sem hora)
  const comHora = doDia.filter((ev) => !!ev.hora)
  const semHora = doDia.filter((ev) => !ev.hora)

  return (
    <section className="space-y-5">
      {/* Cabeçalho da view */}
      <div className="flex items-end gap-4">
        {/* Número do dia em destaque */}
        <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
          <span className="font-cinzel text-xl font-semibold leading-none text-primary">
            {format(parseISO(isoHoje), 'd')}
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-primary/70">
            {format(parseISO(isoHoje), 'MMM', { locale: ptBR })}
          </span>
        </div>

        <div>
          <p className="font-cinzel text-lg font-medium capitalize tracking-wide text-foreground">
            {format(parseISO(isoHoje), "EEEE", { locale: ptBR })}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(parseISO(isoHoje), "d 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
            {' · '}
            <span className={doDia.length > 0 ? 'text-foreground' : ''}>
              {doDia.length === 0
                ? 'sem eventos'
                : `${doDia.length} ${doDia.length === 1 ? 'evento' : 'eventos'}`}
            </span>
          </p>
        </div>
      </div>

      {doDia.length === 0 ? (
        <EmptyDay />
      ) : (
        <div className="space-y-5">
          {/* Eventos de dia inteiro (prazos sem hora) */}
          {semHora.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                Dia inteiro
              </p>
              <div className="space-y-2">
                {semHora.map((ev) => (
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
          )}

          {/* Eventos com horário — timeline */}
          {comHora.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                Com horário
              </p>
              <div className="relative space-y-2 pl-12">
                {/* Linha vertical conectora */}
                <div className="absolute left-5 top-2 bottom-2 w-px bg-border" />

                {comHora.map((ev) => (
                  <div key={ev.id} className="relative flex items-start gap-3">
                    {/* Hora + marcador */}
                    <div className="absolute -left-12 flex w-10 flex-col items-end">
                      <span className="tabular-nums text-[11px] font-medium text-muted-foreground">
                        {ev.hora}
                      </span>
                      {/* Dot na linha */}
                      <div className="absolute left-full top-1.5 ml-1.5 size-2 rounded-full border-2 border-border bg-card" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <EventoRow
                        evento={ev}
                        hoje={hoje}
                        onCumprir={onCumprir}
                        onPerder={onPerder}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function EmptyDay() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/20 px-6 py-16 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted/50">
        <CalendarX className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">Nenhum evento hoje</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Aproveite para revisar processos pendentes ou adiantar peças.
      </p>
    </div>
  )
}
