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

import {
  CalendarClock,
  Gavel,
  Lock,
  Users,
  FileSearch,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  type LucideIcon,
} from 'lucide-react'
import { calcularCriticidade, formatarDiaLongo } from '@/lib/agenda'
import type { Evento, TipoEvento } from '@/types/agenda'
import { EventoChip } from './evento-chip'
import { CriticidadeDot } from './criticidade-dot'
import { cn } from '@/lib/utils'

const ICON_BY_TIPO: Record<TipoEvento, LucideIcon> = {
  prazo: CalendarClock,
  audiencia: Gavel,
  visita_preso: Lock,
  reuniao: Users,
  diligencia: FileSearch,
}

const ICON_COLOR: Record<TipoEvento, string> = {
  prazo: 'bg-primary/15 text-primary',
  audiencia: 'bg-amber-500/15 text-amber-400',
  visita_preso: 'bg-red-500/15 text-red-400',
  reuniao: 'bg-emerald-500/15 text-emerald-400',
  diligencia: 'bg-zinc-500/15 text-zinc-400',
}

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
      ? new Date(baseStart.getTime() + 60 * 60 * 1000)
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

      {/* Legenda */}
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-muted-foreground">Legenda:</span>
        <EventoChip tipo="prazo" />
        <EventoChip tipo="audiencia" />
        <EventoChip tipo="visita_preso" />
        <EventoChip tipo="reuniao" />
        <EventoChip tipo="diligencia" />
      </div>

      {/* Calendar + side panel — grid responsivo */}
      <div
        className={cn(
          'grid gap-4',
          selected && 'xl:grid-cols-[1fr_22rem]',
        )}
      >
        {/* Calendar — reduz altura ao abrir o painel */}
        <div className="min-w-0">
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
            style={{ height: selected ? 520 : 680 }}
          />
        </div>

        {/* Side panel — evento selecionado */}
        {selected && (
          <EventoDetailPanel
            evento={selected}
            hoje={hoje}
            onClose={() => setSelected(null)}
            onCumprir={onCumprir}
            onPerder={onPerder}
          />
        )}
      </div>
    </section>
  )
}

function EventoDetailPanel({
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
  const Icon = ICON_BY_TIPO[evento.tipo]
  const isPrazoPendente = evento.tipo === 'prazo' && evento.status === 'pendente'

  return (
    <aside className="agenda-side-panel flex flex-col rounded-xl border border-border bg-card shadow-xl shadow-black/30 xl:max-h-[520px]">
      {/* Header — sempre visível */}
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div
            className={cn(
              'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
              ICON_COLOR[evento.tipo],
            )}
          >
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-snug text-foreground">
              {evento.titulo}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <EventoChip tipo={evento.tipo} />
              <CriticidadeDot criticidade={criticidade} showLabel />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar painel"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Body — scrollável */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <dl className="space-y-2.5">
          <DetailRow
            label={evento.tipo === 'prazo' ? 'Prazo fatal' : 'Data'}
          >
            {formatarDiaLongo(evento.dataFim ?? evento.data)}
            {evento.hora && (
              <span className="ml-1.5 inline-flex items-center gap-1 text-muted-foreground">
                <Clock className="size-3" />
                {evento.hora}
              </span>
            )}
          </DetailRow>

          {evento.local && (
            <DetailRow label="Local">
              <span className="inline-flex items-start gap-1">
                <MapPin className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                {evento.local}
              </span>
            </DetailRow>
          )}

          {evento.processoAlcunha && (
            <DetailRow label="Processo">
              <span className="font-medium text-foreground">
                {evento.processoAlcunha}
              </span>
              {evento.processoNumero && (
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/60">
                  {evento.processoNumero}
                </p>
              )}
            </DetailRow>
          )}

          {evento.parteNome && (
            <DetailRow
              label={
                evento.tipo === 'visita_preso' ? 'Réu' : 'Cliente / Parte'
              }
            >
              {evento.parteNome}
            </DetailRow>
          )}

          {evento.partesPresentes && evento.partesPresentes.length > 0 && (
            <DetailRow label="Partes presentes">
              <ul className="space-y-0.5">
                {evento.partesPresentes.map((p) => (
                  <li key={p} className="text-secondary-foreground">
                    {p}
                  </li>
                ))}
              </ul>
            </DetailRow>
          )}

          <DetailRow label="Responsável">{evento.responsavel}</DetailRow>
        </dl>

        {evento.descricao && (
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
              Descrição
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {evento.descricao}
            </p>
          </div>
        )}

        {evento.status === 'cumprido' && evento.descricaoCumprimento && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-500/60">
              Cumprido
            </p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-300/80">
              {evento.descricaoCumprimento}
            </p>
          </div>
        )}

        {evento.status === 'perdido' && evento.justificativaPerdido && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-red-500/60">
              Prazo perdido
            </p>
            <p className="mt-1 text-xs leading-relaxed text-red-300/80">
              {evento.justificativaPerdido}
            </p>
          </div>
        )}
      </div>

      {/* Footer de ações — sempre visível */}
      {isPrazoPendente && (onCumprir || onPerder) && (
        <div className="flex shrink-0 items-center gap-2 border-t border-border bg-card/60 px-4 py-3">
          {onCumprir && (
            <button
              type="button"
              onClick={() => {
                onCumprir(evento)
                onClose()
              }}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs font-medium text-emerald-400 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/20"
            >
              <CheckCircle2 className="size-3.5" />
              Marcar cumprido
            </button>
          )}
          {onPerder && (
            <button
              type="button"
              onClick={() => {
                onPerder(evento)
                onClose()
              }}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/20"
            >
              <AlertTriangle className="size-3.5" />
              Marcar perdido
            </button>
          )}
        </div>
      )}
    </aside>
  )
}

function DetailRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-x-3 text-xs">
      <dt className="pt-0.5 text-muted-foreground/60">{label}</dt>
      <dd className="text-secondary-foreground">{children}</dd>
    </div>
  )
}
