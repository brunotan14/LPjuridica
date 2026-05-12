'use client'

import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle, X, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Evento } from '@/types/agenda'
import { EventoChip } from './evento-chip'

const MIN_CARACTERES = 20

interface Props {
  evento: Evento | null
  onClose: () => void
  onConfirm?: (eventoId: string, justificativa: string) => void
}

export function MarcarPerdidoModal({ evento, onClose, onConfirm }: Props) {
  if (!evento) return null
  return (
    <MarcarPerdidoModalContent
      key={evento.id}
      evento={evento}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}

function MarcarPerdidoModalContent({
  evento,
  onClose,
  onConfirm,
}: {
  evento: Evento
  onClose: () => void
  onConfirm?: (eventoId: string, justificativa: string) => void
}) {
  const [justificativa, setJustificativa] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const valid = justificativa.trim().length >= MIN_CARACTERES

  function handleConfirm() {
    setSubmitted(true)
    if (!valid) return
    onConfirm?.(evento.id, justificativa.trim())
    onClose()
  }

  return (
    <Dialog.Root open onOpenChange={(o) => !o && onClose()} modal>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-red-500/40 bg-popover shadow-2xl shadow-red-950/40">
          {/* Header — tom crítico */}
          <div className="flex items-start justify-between gap-3 border-b border-red-500/20 bg-red-500/5 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <Dialog.Title className="font-cinzel text-base font-medium tracking-wide text-foreground">
                  Marcar como perdido
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-xs text-muted-foreground">
                  Justifique a perda. Esta ação é irreversível e auditada.
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
          </div>

          {/* Aviso de notificação ao Titular */}
          <div className="mx-5 mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            <Bell className="mt-0.5 size-4 shrink-0" />
            <p>
              <strong className="font-semibold">Atenção:</strong> esta ação será
              registrada em <em>audit log</em> e o Titular receberá
              notificação imediata por e-mail.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-2 px-5 py-4">
            <label
              htmlFor="perdido-justificativa"
              className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground"
            >
              Justificativa *
            </label>
            <textarea
              id="perdido-justificativa"
              rows={5}
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Descreva detalhadamente o motivo da perda do prazo, o que foi tentado, e impactos previstos para o cliente."
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/30 aria-invalid:border-red-500/60"
              aria-invalid={submitted && !valid}
              autoFocus
            />
            <div className="flex items-center justify-between text-[11px]">
              {submitted && !valid ? (
                <p className="text-red-400">
                  Mínimo de {MIN_CARACTERES} caracteres (
                  {justificativa.trim().length}/{MIN_CARACTERES})
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Mínimo {MIN_CARACTERES} caracteres
                </p>
              )}
              <p
                className={
                  justificativa.trim().length >= MIN_CARACTERES
                    ? 'text-red-400'
                    : 'text-muted-foreground/60'
                }
              >
                {justificativa.length} caracteres
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
              className="bg-red-600 text-white hover:bg-red-500"
            >
              <AlertTriangle className="mr-1.5 size-4" />
              Confirmar perda
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
