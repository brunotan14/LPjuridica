import {
  Briefcase,
  Gavel,
  CalendarClock,
  TrendingDown,
  DollarSign,
} from 'lucide-react'
import { eventosMock } from '@/lib/data/agenda'
import {
  processosAtivos,
  inadimplenciaTotal,
  distribuicaoFase,
  faturamentoMock,
} from '@/lib/data/dashboard'
import { calcularCriticidade } from '@/lib/agenda'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { PrazosCriticosWidget } from '@/components/dashboard/prazos-criticos-widget'
import { ProximasAudienciasWidget } from '@/components/dashboard/proximas-audiencias-widget'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { DistribuicaoFaseChart } from '@/components/dashboard/distribuicao-fase-chart'
import { FaturamentoCard } from '@/components/dashboard/faturamento-card'
import { AtalhosRapidos } from '@/components/dashboard/atalhos-rapidos'

const HOJE_ANCORA = new Date('2026-05-14T12:00:00')

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

  const inadimplenciaFmt = inadimplenciaTotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })

  return (
    <div className="space-y-6">
      {/* Saudação + Atalhos */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {saudacao}
          </p>
          <h1 className="font-cinzel text-xl font-medium tracking-wide text-foreground">
            Dr. Leandro Pedrosa
          </h1>
        </div>
        <AtalhosRapidos />
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Processos Ativos"
          value={String(processosAtivos)}
          icon={Briefcase}
        />
        <KpiCard
          label="Audiências esta Semana"
          value={String(audienciasSemana.length)}
          icon={Gavel}
        />
        <KpiCard
          label="Prazos nos Próximos 7 Dias"
          value={String(prazos7d.length)}
          icon={CalendarClock}
          highlight={temCritico}
        />
        <KpiCard
          label="Inadimplência Total"
          value={inadimplenciaFmt}
          icon={TrendingDown}
          highlight={inadimplenciaTotal > 0}
        />
      </div>

      {/* Próximas Audiências + Prazos Críticos */}
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

      {/* Distribuição por Fase + Faturamento */}
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Distribuição por Fase Processual
          </h2>
          <DistribuicaoFaseChart data={distribuicaoFase} />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <DollarSign className="size-3.5 text-muted-foreground" />
            Faturamento do Mês
          </h2>
          <FaturamentoCard
            mesAtual={faturamentoMock.mesAtual}
            mesAnterior={faturamentoMock.mesAnterior}
          />
        </div>
      </div>
    </div>
  )
}
