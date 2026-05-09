'use client'

import { useMemo, useState } from 'react'
import {
  Calendar,
  dateFnsLocalizer,
  type Event as RBCEvent,
  type View,
} from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar-overrides.css'

import { calcularCriticidade } from '@/lib/agenda'
import type { Evento } from '@/types/agenda'
import { EventoChip } from './evento-chip'
import { CriticidadeDot } from './criticidade-dot'

type Props = {
  eventos: Evento[]
  hoje?: Date
  onCumprir?: (evento: Evento) => void
  onPerder?: (evento: Evento) => void
}

type CalendarEvent = RBCEvent & { resource: Evento }

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales,
})

const messages = {
  allDay: 'Dia inteiro',
  previous: '← Anterior',
  next: 'Próximo →',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Nenhum evento neste período',
  showMore: (n: number) => `+${n} mais`,
}

function toCalendarEvents(eventos: Evento[]): CalendarEvent[] {
  return eventos.map((ev) => {
    const baseStart = ev.hora
      ? new Date(`${ev.data}T${ev.hora}:00`)
      : new Date(`${ev.data}T00:00:00`)
    const baseEnd = ev.hora
      ? new Date(baseStart.getTime() + 60 * 60 * 1000) // 1h default
      : new Date(`${ev.data}T23:59:59`)
    return {
      title: ev.titulo,
      start: baseStart,
      end: baseEnd,
      allDay: !ev.hora,
      resource: ev,
    }
  })
}

export function AgendaCalendarView({
  eventos,
  hoje = new Date(),
  onCumprir,
  onPerder,
}: Props) {
  const events = useMemo(() => toCalendarEvents(eventos), [eventos])
  const [selected, setSelected] = useState<Evento | null>(null)
  const [currentDate, setCurrentDate] = useState<Date>(hoje)

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Calendário mensal
        </h2>
        <p className="text-xs text-muted-foreground">
          {events.length} eventos no acervo
        </p>
      </div>

      {/* Legenda das cores por tipo */}
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-muted-foreground">Legenda:</span>
        <EventoChip tipo="prazo" />
        <EventoChip tipo="audiencia" />
        <EventoChip tipo="visita_preso" />
        <EventoChip tipo="reuniao" />
        <EventoChip tipo="diligencia" />
      </div>

      <div className="rounded-xl">
        <Calendar
          localizer={localizer}
          culture="pt-BR"
          events={events}
          date={currentDate}
          onNavigate={(d) => setCurrentDate(d)}
          defaultView="month"
          views={['month'] as View[]}
          messages={messages}
          eventPropGetter={(event) => {
            const ev = (event as CalendarEvent).resource
            const crit = calcularCriticidade(ev, hoje)
            const classNames = [`rbc-event-${ev.tipo}`]
            if (crit === 'perdido') classNames.push('rbc-event-perdido')
            if (crit === 'concluido') classNames.push('rbc-event-concluido')
            return { className: classNames.join(' ') }
          }}
          onSelectEvent={(event) => {
            setSelected((event as CalendarEvent).resource)
          }}
          style={{ height: 680 }}
        />
      </div>

      {/* Painel de detalhe rápido — abre ao clicar em um evento.
          Substituível por drawer/modal completo na próxima etapa. */}
      {selected && (
        <EventoQuickPeek
          evento={selected}
          hoje={hoje}
          onClose={() => setSelected(null)}
          onCumprir={onCumprir}
          onPerder={onPerder}
        />
      )}
    </section>
  )
}

function EventoQuickPeek({
  evento,
  hoje,
  onClose,
  onCumprir,
  onPerder,
}: {
  evento: Evento
  hoje: Date
  onClose: () => void
  onCumprir?: (evento: Evento) => void
  onPerder?: (evento: Evento) => void
}) {
  const criticidade = calcularCriticidade(evento, hoje)
  const isPrazoPendente = evento.tipo === 'prazo' && evento.status === 'pendente'
  return (
    <div className="rounded-xl border border-primary/40 bg-popover p-4 shadow-2xl shadow-black/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {evento.titulo}
            </h3>
            <EventoChip tipo={evento.tipo} />
            <CriticidadeDot criticidade={criticidade} showLabel />
          </div>
          <dl className="grid gap-x-6 gap-y-1.5 text-xs text-muted-foreground sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground/60">Data</dt>
              <dd className="text-secondary-foreground">
                {evento.data}
                {evento.hora && ` · ${evento.hora}`}
              </dd>
            </div>
            {evento.local && (
              <div>
                <dt className="text-muted-foreground/60">Local</dt>
                <dd className="text-secondary-foreground">{evento.local}</dd>
              </div>
            )}
            {evento.processoAlcunha && (
              <div>
                <dt className="text-muted-foreground/60">Processo</dt>
                <dd className="text-secondary-foreground">
                  {evento.processoAlcunha} · {evento.processoNumero}
                </dd>
              </div>
            )}
            {evento.parteNome && (
              <div>
                <dt className="text-muted-foreground/60">Cliente / Parte</dt>
                <dd className="text-secondary-foreground">{evento.parteNome}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground/60">Responsável</dt>
              <dd className="text-secondary-foreground">{evento.responsavel}</dd>
            </div>
          </dl>
          {evento.descricao && (
            <p className="text-xs text-muted-foreground">{evento.descricao}</p>
          )}
          {isPrazoPendente && (onCumprir || onPerder) && (
            <div className="flex flex-wrap gap-2 pt-2">
              {onCumprir && (
                <button
                  type="button"
                  onClick={() => {
                    onCumprir(evento)
                    onClose()
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:border-emerald-500/60 hover:bg-emerald-500/20"
                >
                  Marcar como cumprido
                </button>
              )}
              {onPerder && (
                <button
                  type="button"
                  onClick={() => {
                    onPerder(evento)
                    onClose()
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/20"
                >
                  Marcar como perdido
                </button>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
