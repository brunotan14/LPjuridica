import { cn } from '@/lib/utils'
import {
  CalendarClock,
  Gavel,
  Lock,
  Users as UsersIcon,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'
import { calcularCriticidade } from '@/lib/agenda'
import type { Evento, TipoEvento } from '@/types/agenda'
import { EventoChip } from './evento-chip'
import { CriticidadeDot } from './criticidade-dot'

const ICON_BY_TIPO: Record<TipoEvento, LucideIcon> = {
  prazo: CalendarClock,
  audiencia: Gavel,
  visita_preso: Lock,
  reuniao: UsersIcon,
  diligencia: FileSearch,
}

type Props = {
  evento: Evento
  hoje?: Date
  onClick?: (evento: Evento) => void
  onCumprir?: (evento: Evento) => void
  onPerder?: (evento: Evento) => void
}

export function EventoRow({
  evento,
  hoje = new Date(),
  onClick,
  onCumprir,
  onPerder,
}: Props) {
  const criticidade = calcularCriticidade(evento, hoje)
  const Icon = ICON_BY_TIPO[evento.tipo]
  const isPrazoPendente = evento.tipo === 'prazo' && evento.status === 'pendente'

  return (
    <div
      onClick={() => onClick?.(evento)}
      className={cn(
        'group flex w-full items-start gap-3 rounded-lg border border-border bg-card/50 p-3 text-left transition-colors',
        onClick && 'cursor-pointer hover:border-primary/40 hover:bg-card',
        !onClick && 'hover:border-primary/30'
      )}
    >
      {/* Ícone do tipo */}
      <div
        className={cn(
          'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md',
          evento.tipo === 'prazo' && 'bg-primary/15 text-primary',
          evento.tipo === 'audiencia' && 'bg-amber-500/15 text-amber-400',
          evento.tipo === 'visita_preso' && 'bg-red-500/15 text-red-400',
          evento.tipo === 'reuniao' && 'bg-emerald-500/15 text-emerald-400',
          evento.tipo === 'diligencia' && 'bg-zinc-500/15 text-zinc-300'
        )}
      >
        <Icon className="size-4" />
      </div>

      {/* Conteúdo */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground">{evento.titulo}</p>
          <EventoChip tipo={evento.tipo} />
          {evento.status === 'perdido' && (
            <span className="rounded-md border border-red-500/40 bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
              Perdido
            </span>
          )}
          {evento.status === 'cumprido' && (
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
              Cumprido
            </span>
          )}
          {evento.status === 'realizado' && (
            <span className="rounded-md border border-zinc-600/40 bg-zinc-700/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Realizado
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {evento.hora && <span className="tabular-nums">{evento.hora}</span>}
          {evento.local && <span className="truncate">{evento.local}</span>}
          {evento.processoAlcunha && (
            <span>
              <span className="text-muted-foreground/60">Processo: </span>
              <span className="text-secondary-foreground">
                {evento.processoAlcunha}
              </span>
            </span>
          )}
          {evento.parteNome && !evento.processoAlcunha && (
            <span>
              <span className="text-muted-foreground/60">Cliente: </span>
              <span className="text-secondary-foreground">{evento.parteNome}</span>
            </span>
          )}
        </div>
      </div>

      {/* Ações + criticidade */}
      <div className="ml-2 flex shrink-0 items-center gap-2 pt-1">
        {isPrazoPendente && (onCumprir || onPerder) && (
          <div className="flex items-center gap-1">
            {onCumprir && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onCumprir(evento)
                }}
                className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-400 transition-colors hover:border-emerald-500/60 hover:bg-emerald-500/20"
                title="Marcar como cumprido"
              >
                <CheckCircle2 className="size-3.5" />
                <span className="hidden sm:inline">Cumprido</span>
              </button>
            )}
            {onPerder && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onPerder(evento)
                }}
                className="inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/20"
                title="Marcar como perdido"
              >
                <AlertTriangle className="size-3.5" />
                <span className="hidden sm:inline">Perdido</span>
              </button>
            )}
          </div>
        )}
        <CriticidadeDot criticidade={criticidade} />
      </div>
    </div>
  )
}
