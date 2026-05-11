'use client'

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { FASE_LABELS } from '@/components/processos/badge-fase-processual'
import { FASE_ACCENT } from '@/lib/data/pipeline'
import type { FaseProcessual } from '@/types/index'

interface FaseColunaProps {
  fase: FaseProcessual
  processos: { id: string }[]
  children: React.ReactNode
}

export function FaseColuna({ fase, processos, children }: FaseColunaProps) {
  const { setNodeRef, isOver } = useDroppable({ id: fase })
  const accent = FASE_ACCENT[fase]

  return (
    <div
      className={cn(
        'flex w-[272px] shrink-0 flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 transition-all duration-150',
        isOver && 'border-zinc-600 bg-zinc-800/70 shadow-lg shadow-black/20',
      )}
    >
      {/* Colored top strip */}
      <div className={cn('h-[3px] w-full rounded-t-xl', accent.strip)} />

      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-semibold tracking-wide', accent.headerText)}>
            {FASE_LABELS[fase]}
          </span>
        </div>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-medium tabular-nums',
            accent.countBg,
            accent.countText,
          )}
        >
          {processos.length}
        </span>
      </div>

      {/* Droppable content area */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-[120px] flex-1 flex-col gap-2 px-2 pb-2',
          isOver && 'rounded-b-xl ring-1 ring-inset ring-zinc-600/40',
        )}
      >
        {processos.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-8">
            <span className="text-xs text-zinc-700">Nenhum processo</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
