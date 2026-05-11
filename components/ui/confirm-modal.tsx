'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmModalProps {
  titulo: string
  descricao?: string
  labelConfirmar?: string
  labelCancelar?: string
  onConfirmar: () => void
  onCancelar: () => void
}

export function ConfirmModal({
  titulo,
  descricao,
  labelConfirmar = 'Confirmar',
  labelCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
}: ConfirmModalProps) {
  // Fechar com Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancelar()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onCancelar])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
        onClick={onCancelar}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl">
        {/* Ícone */}
        <div className="mb-4 flex size-10 items-center justify-center rounded-full border border-red-800 bg-red-950">
          <AlertTriangle className="size-5 text-red-400" />
        </div>

        {/* Texto */}
        <p className="text-sm font-semibold text-zinc-100">{titulo}</p>
        {descricao && (
          <p className="mt-1 text-sm text-zinc-500">{descricao}</p>
        )}

        {/* Botões */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            {labelCancelar}
          </button>
          <button
            onClick={onConfirmar}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
          >
            {labelConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
