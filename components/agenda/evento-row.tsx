'use client'

import { cn } from '@/lib/utils'
import {
  CalendarClock,
  Gavel,
  Lock,
  Users,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  type LucideIcon,
} from 'lucide-react'
import { calcularCriticidade } from '@/lib/agenda'
import type { Evento, TipoEvento } from '@/types/agenda'
import { CriticidadeDot } from './criticidade-dot'

const ICON_BY_TIPO: Record<TipoEvento, LucideIcon> = {
  prazo: CalendarClock,
  audiencia: Gavel,
  visita_preso: Lock,
  reuniao: Users,
  diligencia: FileSearch,
}

// Tailwind classes must be full literal strings for v4 detection
const TIPO_CLASSES: Record<TipoEvento, { strip: string; icon: string }> = {
  prazo: {
    strip: 'border-l-primary',
    icon: 'bg-primary/15 text-primary',
  },
  audiencia: {
    strip: 'border-l-amber-400',
    icon: 'bg-amber-500/15 text-amber-400',
  },
  visita_preso: {
    strip: 'border-l-red-500',
    icon: 'bg-red-500/15 text-red-400',
  },
  reuniao: {
    strip: 'border-l-emerald-500',
    icon: 'bg-emerald-500/15 text-emerald-400',
  },
  diligencia: {
    strip: 'border-l-zinc-500',
    icon: 'bg-zinc-500/15 text-zinc-400',
  },
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
  const tipo = TIPO_CLASSES[evento.tipo]
  const isPrazoPendente = evento.tipo === 'prazo' && evento.status === 'pendente'
  const isHoje = criticidade === 'hoje'
  const isConcluido =
    evento.status === 'cumprido' ||
    evento.status === 'realizado' ||
    evento.status === 'cancelado'
  const isPerdido = evento.status === 'perdido'

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={() => onClick?.(evento)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(evento)}
      className={cn(
        'group relative flex items-start gap-3 rounded-lg border border-l-4 bg-card/60 px-3 py-3 transition-all duration-150',
        tipo.strip,
        onClick &&
          'cursor-pointer hover:bg-card focus-visible:outline-2 focus-visible:outline-ring',
        isHoje && 'border-primary/25 bg-primary/[0.04]',
        criticidade === 'critica' && !isHoje && 'border-red-500/15',
        (isConcluido || isPerdido) && 'opacity-55',
      )}
    >
      {/* Ícone do tipo */}
      <div
        className={cn(
          'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md',
          tipo.icon,
        )}
      >
        <Icon className="size-3.5" />
      </div>

      {/* Corpo */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p
            className={cn(
              'text-sm font-medium leading-snug',
              isConcluido || isPerdido
                ? 'text-muted-foreground'
                : 'text-foreground',
            )}
          >
            {evento.titulo}
          </p>
          {evento.status === 'cumprido' && (
            <StatusBadge variant="success">Cumprido</StatusBadge>
          )}
          {isPerdido && <StatusBadge variant="error">Perdido</StatusBadge>}
          {evento.status === 'realizado' && (
            <StatusBadge variant="neutral">Realizado</StatusBadge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          {evento.hora && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock className="size-3 shrink-0" />
              {evento.hora}
            </span>
          )}
          {evento.local && (
            <span className="inline-flex max-w-xs items-center gap-1">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{evento.local}</span>
            </span>
          )}
          {evento.processoAlcunha && (
            <span className="text-secondary-foreground/70">
              {evento.processoAlcunha}
            </span>
          )}
          {!evento.processoAlcunha && evento.parteNome && (
            <span className="text-secondary-foreground/70">
              {evento.parteNome}
            </span>
          )}
        </div>
      </div>

      {/* Direita: ações + criticidade */}
      <div className="flex shrink-0 items-center gap-2 pt-0.5">
        {isPrazoPendente && (onCumprir || onPerder) && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            {onCumprir && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onCumprir(evento)
                }}
                className="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-400 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/20"
                title="Marcar como cumprido"
              >
                <CheckCircle2 className="size-3" />
                <span className="hidden sm:inline">Cumprir</span>
              </button>
            )}
            {onPerder && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onPerder(evento)
                }}
                className="inline-flex items-center gap-1 rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/20"
                title="Marcar como perdido"
              >
                <AlertTriangle className="size-3" />
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

function StatusBadge({
  variant,
  children,
}: {
  variant: 'success' | 'error' | 'neutral'
  children: React.ReactNode
}) {
  const cls = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    error: 'border-red-500/30 bg-red-500/10 text-red-400',
    neutral: 'border-zinc-600/30 bg-zinc-700/20 text-muted-foreground',
  }[variant]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider',
        cls,
      )}
    >
      {children}
    </span>
  )
}
