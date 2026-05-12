'use client'

import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Evento } from '@/types/agenda'
import { EventoChip } from './evento-chip'

const MIN_CARACTERES = 10

interface Props {
  evento: Evento | null
  onClose: () => void
  onConfirm?: (eventoId: string, descricaoCumprimento: string) => void
}

export function MarcarCumpridoModal({ evento, onClose, onConfirm }: Props) {
  if (!evento) return null
  return (
    <MarcarCumpridoModalContent
      key={evento.id}
      evento={evento}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}

function MarcarCumpridoModalContent({
  evento,
  onClose,
  onConfirm,
}: {
  evento: Evento
  onClose: () => void
  onConfirm?: (eventoId: string, descricaoCumprimento: string) => void
}) {
  const [descricao, setDescricao] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const valid = descricao.trim().length >= MIN_CARACTERES

  function handleConfirm() {
    setSubmitted(true)
    if (!valid) return
    onConfirm?.(evento.id, descricao.trim())
    onClose()
  }

  return (
    <Dialog.Root open onOpenChange={(o) => !o && onClose()} modal>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-emerald-500/30 bg-popover shadow-2xl shadow-black/60">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <Dialog.Title className="font-cinzel text-base font-medium tracking-wide text-foreground">
                  Marcar como cumprido
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-xs text-muted-foreground">
                  Registre o que foi feito. Esta ação será auditada.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close
              render={
                <button
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Fechar"
                >
                  <X className="size-4" />
                </button>
              }
            />
          </div>

          {/* Resumo */}
          <div className="space-y-3 border-b border-border px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                {evento.titulo}
              </p>
              <EventoChip tipo={evento.tipo} />
            </div>
            <dl className="grid gap-x-6 gap-y-1 text-xs text-muted-foreground sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground/60">Data fatal</dt>
                <dd className="text-secondary-foreground">
                  {evento.dataFim ?? evento.data}
                </dd>
              </div>
              {evento.processoAlcunha && (
                <div>
                  <dt className="text-muted-foreground/60">Processo</dt>
                  <dd className="text-secondary-foreground">
                    {evento.processoAlcunha}
                  </dd>
                </div>
              )}
            </dl>
            {evento.descricao && (
              <p className="text-xs text-muted-foreground">{evento.descricao}</p>
            )}
          </div>

          {/* Form */}
          <div className="space-y-2 px-5 py-4">
            <label
              htmlFor="cumprido-descricao"
              className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground"
            >
              O que foi feito? *
            </label>
            <textarea
              id="cumprido-descricao"
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder={`Ex: Petição protocolada às 16h via PJe, nº 2098765-43.2026.`}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 aria-invalid:border-red-500/60"
              aria-invalid={submitted && !valid}
              autoFocus
            />
            <div className="flex items-center justify-between text-[11px]">
              {submitted && !valid ? (
                <p className="text-red-400">
                  Mínimo de {MIN_CARACTERES} caracteres ({descricao.trim().length}/
                  {MIN_CARACTERES})
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Mínimo {MIN_CARACTERES} caracteres
                </p>
              )}
              <p
                className={
                  descricao.trim().length >= MIN_CARACTERES
                    ? 'text-emerald-400'
                    : 'text-muted-foreground/60'
                }
              >
                {descricao.length} caracteres
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border bg-card/60 px-5 py-3">
            <Dialog.Close
              render={
                <Button variant="outline" size="sm">
                  Cancelar
                </Button>
              }
            />
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={!valid && submitted}
              className="bg-emerald-600 text-white hover:bg-emerald-500"
            >
              <CheckCircle2 className="mr-1.5 size-4" />
              Confirmar cumprimento
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
