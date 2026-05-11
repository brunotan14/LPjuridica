'use client'

import { useState } from 'react'
import { Clock, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TimelineItem } from '@/components/andamentos/timeline-item'
import type { Andamento, TipoAndamento } from '@/types/andamentos'

// ─── Filtros ──────────────────────────────────────────────────────────────────

type FiltroTipo = TipoAndamento | 'todos'

const FILTROS: { id: FiltroTipo; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'andamento_oficial', label: 'Andamento oficial' },
  { id: 'peca_produzida', label: 'Peça' },
  { id: 'comunicacao_cliente', label: 'Comunicação' },
  { id: 'anotacao_interna', label: 'Anotação interna' },
  { id: 'evento_audiencia', label: 'Audiência' },
]

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onRegistrar }: { onRegistrar: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-zinc-800">
        <Clock className="size-6 text-zinc-600" />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-400">Nenhum andamento registrado</p>
      <p className="mt-1 text-xs text-zinc-600">
        Registre o primeiro andamento para iniciar a timeline deste processo.
      </p>
      <button
        onClick={onRegistrar}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        <Plus className="size-4" />
        Registrar primeiro andamento
      </button>
    </div>
  )
}

// ─── Empty state quando filtro não tem resultados ─────────────────────────────

function EmptyFiltro({ onLimpar }: { onLimpar: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm text-zinc-500">Nenhum andamento nesta categoria.</p>
      <button
        onClick={onLimpar}
        className="mt-3 text-xs text-indigo-400 underline-offset-2 hover:underline"
      >
        Ver todos
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface AndamentosTimelineProps {
  andamentos: Andamento[]
  onRegistrar: () => void
  onExcluir: (id: string) => void
}

export function AndamentosTimeline({ andamentos, onRegistrar, onExcluir }: AndamentosTimelineProps) {
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroTipo>('todos')

  const filtrados =
    filtroAtivo === 'todos' ? andamentos : andamentos.filter((a) => a.tipo === filtroAtivo)

  if (andamentos.length === 0) {
    return <EmptyState onRegistrar={onRegistrar} />
  }

  return (
    <div className="space-y-6">
      {/* Chips de filtro */}
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((filtro) => {
          const count =
            filtro.id === 'todos'
              ? andamentos.length
              : andamentos.filter((a) => a.tipo === filtro.id).length

          return (
            <button
              key={filtro.id}
              onClick={() => setFiltroAtivo(filtro.id)}
              disabled={count === 0}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                filtroAtivo === filtro.id
                  ? 'border-indigo-700 bg-indigo-950 text-indigo-300'
                  : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300',
                count === 0 && 'cursor-not-allowed opacity-40',
              )}
            >
              {filtro.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                  filtroAtivo === filtro.id ? 'bg-indigo-800 text-indigo-200' : 'bg-zinc-700 text-zinc-400',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Lista ou empty de filtro */}
      {filtrados.length === 0 ? (
        <EmptyFiltro onLimpar={() => setFiltroAtivo('todos')} />
      ) : (
        <div>
          {filtrados.map((andamento, index) => (
            <TimelineItem
              key={andamento.id}
              andamento={andamento}
              isLast={index === filtrados.length - 1}
              onExcluir={() => onExcluir(andamento.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
