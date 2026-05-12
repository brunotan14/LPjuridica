'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BadgeSigilo } from '@/components/processos/badge-sigilo'
import { FASE_LABELS } from '@/components/processos/badge-fase-processual'
import type { Processo } from '@/types/processos'
import type { FaseProcessual } from '@/types/index'

interface MoverFaseModalProps {
  open: boolean
  onClose: () => void
  processo: Processo | null
  faseAtual: FaseProcessual | null
  novaFase: FaseProcessual | null
  onConfirmar: (observacao: string) => void
}

export function MoverFaseModal({
  open,
  onClose,
  processo,
  faseAtual,
  novaFase,
  onConfirmar,
}: MoverFaseModalProps) {
  if (!open || !processo || !faseAtual || !novaFase) return null
  return (
    <MoverFaseModalContent
      key={`${processo.id}-${faseAtual}-${novaFase}`}
      onClose={onClose}
      processo={processo}
      faseAtual={faseAtual}
      novaFase={novaFase}
      onConfirmar={onConfirmar}
    />
  )
}

function MoverFaseModalContent({
  onClose,
  processo,
  faseAtual,
  novaFase,
  onConfirmar,
}: {
  onClose: () => void
  processo: Processo
  faseAtual: FaseProcessual
  novaFase: FaseProcessual
  onConfirmar: (observacao: string) => void
}) {
  const [observacao, setObservacao] = useState('')

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleConfirmar() {
    const payload = {
      processoId: processo.id,
      alcunha: processo.alcunha,
      faseAnterior: faseAtual,
      novaFase,
      observacao: observacao.trim(),
      timestamp: new Date().toISOString(),
    }
    console.log('[Pipeline] Mudança de fase:', payload)
    onConfirmar(observacao.trim())
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mover-fase-title"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl shadow-black/60"
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2
            id="mover-fase-title"
            className="font-display text-base font-semibold text-zinc-50"
          >
            Mover processo de fase
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <p className="text-sm text-zinc-300">
            Mover{' '}
            <strong className="text-zinc-50">{processo.alcunha}</strong> de{' '}
            <strong className="text-zinc-50">{FASE_LABELS[faseAtual]}</strong>{' '}
            para{' '}
            <strong className="text-zinc-50">{FASE_LABELS[novaFase]}</strong>?
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <BadgeSigilo sigilo={processo.sigilo} />
            <span className="text-xs text-zinc-500">{processo.responsavelInterno}</span>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="observacao-transicao"
              className="text-xs font-medium text-zinc-400"
            >
              Observação sobre a transição{' '}
              <span className="text-zinc-600">(opcional)</span>
            </label>
            <textarea
              id="observacao-transicao"
              autoFocus
              value={observacao}
              onChange={(e) => setObservacao(e.target.value.slice(0, 300))}
              placeholder="Observação sobre a transição"
              maxLength={300}
              rows={3}
              className={cn(
                'w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2',
                'text-sm text-zinc-200 placeholder:text-zinc-600',
                'transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
              )}
            />
            <p className="text-right text-xs text-zinc-600">
              {observacao.length}/300
            </p>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className={cn(
              'rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300',
              'transition-colors hover:bg-zinc-800 hover:text-zinc-50',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
            )}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            className={cn(
              'rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-zinc-50',
              'transition-colors hover:bg-indigo-500',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
            )}
          >
            Confirmar Mudança
          </button>
        </div>
      </div>
    </>
  )
}
