import {
  Briefcase,
  Gavel,
  CalendarClock,
  TrendingDown,
} from 'lucide-react'
import { eventosMock } from '@/lib/data/agenda'
import { calcularCriticidade } from '@/lib/agenda'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { PrazosCriticosWidget } from '@/components/dashboard/prazos-criticos-widget'
import { ProximasAudienciasWidget } from '@/components/dashboard/proximas-audiencias-widget'
import { cn } from '@/lib/utils'

const HOJE_ANCORA = new Date('2026-05-09T12:00:00')

function getGreeting(hora: number) {
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function DashboardPage() {
  const hora = HOJE_ANCORA.getHours()
  const saudacao = getGreeting(hora)

  const prazos7d = eventosMock.filter((ev) => {
    if (ev.tipo !== 'prazo' || ev.status !== 'pendente') return false
    const ref = parseISO(ev.dataFim ?? ev.data)
    const diff = differenceInCalendarDays(ref, HOJE_ANCORA)
    return diff >= 0 && diff <= 7
  })

  const audienciasSemana = eventosMock.filter((ev) => {
    if (ev.tipo !== 'audiencia' || ev.status !== 'agendado') return false
    const diff = differenceInCalendarDays(parseISO(ev.data), HOJE_ANCORA)
    return diff >= 0 && diff <= 7
  })

  const temCritico = prazos7d.some((ev) => {
    const c = calcularCriticidade(ev, HOJE_ANCORA)
    return c === 'hoje' || c === 'critica'
  })

  const kpis = [
    {
      label: 'Processos Ativos',
      value: '—',
      icon: Briefcase,
      highlight: false,
    },
    {
      label: 'Audiências esta Semana',
      value: String(audienciasSemana.length),
      icon: Gavel,
      highlight: false,
    },
    {
      label: 'Prazos nos Próximos 7 Dias',
      value: String(prazos7d.length),
      icon: CalendarClock,
      highlight: temCritico,
    },
    {
      label: 'Inadimplência Total',
      value: '—',
      icon: TrendingDown,
      highlight: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Saudação */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {saudacao}
        </p>
        <h1 className="font-cinzel text-xl font-medium tracking-wide text-foreground">
          Dr. Leandro Pedrosa
        </h1>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, highlight }) => (
          <div
            key={label}
            className={cn(
              'rounded-xl border bg-card p-5 transition-colors',
              highlight
                ? 'border-red-500/30 bg-red-500/5'
                : 'border-border',
            )}
          >
            <div className="flex items-start justify-between">
              <p
                className={cn(
                  'text-xs font-medium',
                  highlight ? 'text-red-400' : 'text-muted-foreground',
                )}
              >
                {label}
              </p>
              <div
                className={cn(
                  'flex size-7 items-center justify-center rounded-lg',
                  highlight
                    ? 'bg-red-500/15 text-red-400'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className="size-3.5" />
              </div>
            </div>
            <p
              className={cn(
                'mt-3 text-2xl font-semibold',
                highlight ? 'text-red-300' : 'text-foreground',
              )}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Widgets */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Próximas Audiências
          </h2>
          <ProximasAudienciasWidget hoje={HOJE_ANCORA} />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Prazos Críticos
          </h2>
          <PrazosCriticosWidget hoje={HOJE_ANCORA} />
        </div>
      </div>

      {/* Fase processual */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Distribuição por Fase Processual
        </h2>
        <PlaceholderEmpty label="Dados disponíveis após cadastro de processos (M4)" />
      </div>
    </div>
  )
}

function PlaceholderEmpty({ label }: { label: string }) {
  return (
    <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border">
      <p className="text-sm text-muted-foreground/60">{label}</p>
    </div>
  )
}
