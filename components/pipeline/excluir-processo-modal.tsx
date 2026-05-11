'use client'

import { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Processo } from '@/types/processos'

interface ExcluirProcessoModalProps {
  processo: Processo | null
  onClose: () => void
  onConfirmar: (processo: Processo) => void
}

export function ExcluirProcessoModal({
  processo,
  onClose,
  onConfirmar,
}: ExcluirProcessoModalProps) {
  const open = processo !== null

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open || !processo) return null

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
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="excluir-title"
        aria-describedby="excluir-desc"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl shadow-black/60"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          <X className="size-4" />
        </button>

        {/* Icon + title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full border border-red-900/60 bg-red-950/40">
            <AlertTriangle className="size-6 text-red-400" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <h2
              id="excluir-title"
              className="font-display text-base font-semibold text-zinc-50"
            >
              Excluir processo
            </h2>
            <p id="excluir-desc" className="text-sm text-zinc-400">
              Tem certeza que deseja excluir{' '}
              <strong className="text-zinc-200">{processo.alcunha}</strong>?
            </p>
            <p className="text-xs text-zinc-600">
              Esta ação não pode ser desfeita. O processo será removido do pipeline.
            </p>
          </div>
        </div>

        {/* Info pill */}
        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-center">
          <p className="text-xs text-zinc-500">
            <span className="font-medium text-zinc-400">{processo.numeroCNJ}</span>
            {' · '}
            {processo.comarca}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className={cn(
              'flex-1 rounded-lg border border-zinc-700 py-2 text-sm font-medium text-zinc-300',
              'transition-colors hover:bg-zinc-800 hover:text-zinc-50',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500',
            )}
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirmar(processo)}
            className={cn(
              'flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-zinc-50',
              'transition-colors hover:bg-red-500',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
            )}
          >
            Excluir
          </button>
        </div>
      </div>
    </>
  )
}
