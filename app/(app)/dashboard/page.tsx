import { eventosMock } from '@/lib/data/agenda'
import { calcularCriticidade } from '@/lib/agenda'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { PrazosCriticosWidget } from '@/components/dashboard/prazos-criticos-widget'
import { ProximasAudienciasWidget } from '@/components/dashboard/proximas-audiencias-widget'

// Âncora temporal fixa (mock M5).
const HOJE_ANCORA = new Date('2026-05-09T12:00:00')

export default function DashboardPage() {
  // Conta prazos pendentes nos próximos 7 dias (incluindo hoje).
  const prazos7d = eventosMock.filter((ev) => {
    if (ev.tipo !== 'prazo' || ev.status !== 'pendente') return false
    const ref = parseISO(ev.dataFim ?? ev.data)
    const diff = differenceInCalendarDays(ref, HOJE_ANCORA)
    return diff >= 0 && diff <= 7
  })

  const temCritico = prazos7d.some((ev) => {
    const c = calcularCriticidade(ev, HOJE_ANCORA)
    return c === 'hoje' || c === 'critica'
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Processos Ativos', value: '—' },
          { label: 'Audiências esta Semana', value: '—' },
          {
            label: 'Prazos nos Próximos 7 Dias',
            value: String(prazos7d.length),
            highlight: temCritico,
          },
          { label: 'Inadimplência Total', value: '—' },
        ].map(({ label, value, highlight }) => (
          <div
            key={label}
            className={`rounded-xl border p-5 ${
              highlight
                ? 'border-red-500/40 bg-red-500/5'
                : 'border-zinc-800 bg-zinc-900'
            }`}
          >
            <p
              className={`text-sm ${
                highlight ? 'text-red-400' : 'text-zinc-500'
              }`}
            >
              {label}
            </p>
            <p
              className={`mt-2 text-2xl font-semibold ${
                highlight ? 'text-red-300' : 'text-zinc-50'
              }`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">
            Próximas Audiências
          </h2>
          <ProximasAudienciasWidget hoje={HOJE_ANCORA} />
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">
            Prazos Críticos
          </h2>
          <PrazosCriticosWidget hoje={HOJE_ANCORA} />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-4 text-sm font-semibold text-zinc-300">
          Distribuição por Fase Processual
        </h2>
        <PlaceholderEmpty label="Dados disponíveis após cadastro de processos" />
      </div>
    </div>
  )
}

function PlaceholderEmpty({ label }: { label: string }) {
  return (
    <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-zinc-700">
      <p className="text-sm text-zinc-600">{label}</p>
    </div>
  )
}
