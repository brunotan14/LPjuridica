'use client'

import { useCallback, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { CalendarDays, CalendarRange, CalendarCheck, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Evento } from '@/types/agenda'
import { contarPrazosCriticosHoje } from '@/lib/agenda'
import { AgendaCalendarView } from './agenda-calendar-view'
import { AgendaWeekView } from './agenda-week-view'
import { AgendaDayView } from './agenda-day-view'
import { NovoEventoDrawer } from './novo-evento-drawer'
import { MarcarCumpridoModal } from './marcar-cumprido-modal'
import { MarcarPerdidoModal } from './marcar-perdido-modal'

type View = 'calendario' | 'semana' | 'dia'

const VIEWS: { value: View; label: string; icon: typeof CalendarDays }[] = [
  { value: 'calendario', label: 'Calendário', icon: CalendarRange },
  { value: 'semana', label: 'Semana', icon: CalendarDays },
  { value: 'dia', label: 'Dia', icon: CalendarCheck },
]

type Props = {
  eventos: Evento[]
  hoje?: Date
}

export function AgendaShell({ eventos, hoje = new Date() }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [novoEventoOpen, setNovoEventoOpen] = useState(false)
  const [eventoCumprir, setEventoCumprir] = useState<Evento | null>(null)
  const [eventoPerder, setEventoPerder] = useState<Evento | null>(null)

  const view = (searchParams.get('view') ?? 'calendario') as View

  const setView = useCallback(
    (next: View) => {
      const params = new URLSearchParams(searchParams.toString())
      if (next === 'calendario') params.delete('view')
      else params.set('view', next)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const prazosHoje = contarPrazosCriticosHoje(eventos, hoje)

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* View switcher */}
        <div className="flex items-center gap-3">
          <nav
            className="flex gap-0.5 rounded-lg border border-border bg-card/50 p-1"
            aria-label="Visualização da agenda"
          >
            {VIEWS.map((v) => {
              const isActive = view === v.value
              const Icon = v.icon
              return (
                <button
                  key={v.value}
                  onClick={() => setView(v.value)}
                  aria-pressed={isActive}
                  className={cn(
                    'relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  <Icon className="size-3.5" />
                  {v.label}
                </button>
              )
            })}
          </nav>

          {/* Alerta de prazos hoje */}
          {prazosHoje > 0 && (
            <span className="hidden items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 sm:inline-flex">
              <span className="size-1.5 animate-pulse-critical rounded-full bg-red-400" />
              {prazosHoje}{' '}
              {prazosHoje === 1 ? 'prazo crítico hoje' : 'prazos críticos hoje'}
            </span>
          )}
        </div>

        {/* Novo Evento */}
        <button
          type="button"
          onClick={() => setNovoEventoOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="size-4" />
          Novo Evento
        </button>
      </div>

      {/* ── Views ──────────────────────────────────────────────────────── */}
      {view === 'calendario' && (
        <AgendaCalendarView
          eventos={eventos}
          hoje={hoje}
          onCumprir={setEventoCumprir}
          onPerder={setEventoPerder}
        />
      )}
      {view === 'semana' && (
        <AgendaWeekView
          eventos={eventos}
          hoje={hoje}
          onCumprir={setEventoCumprir}
          onPerder={setEventoPerder}
        />
      )}
      {view === 'dia' && (
        <AgendaDayView
          eventos={eventos}
          hoje={hoje}
          onCumprir={setEventoCumprir}
          onPerder={setEventoPerder}
        />
      )}

      {/* ── Modais ─────────────────────────────────────────────────────── */}
      <NovoEventoDrawer
        open={novoEventoOpen}
        onOpenChange={setNovoEventoOpen}
      />
      <MarcarCumpridoModal
        evento={eventoCumprir}
        onClose={() => setEventoCumprir(null)}
      />
      <MarcarPerdidoModal
        evento={eventoPerder}
        onClose={() => setEventoPerder(null)}
      />
    </div>
  )
}
