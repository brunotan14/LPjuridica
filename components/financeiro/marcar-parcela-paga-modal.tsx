'use client'

import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Parcela, FormaPagamento } from '@/types/financeiro'

const FORMAS: { value: FormaPagamento; label: string }[] = [
  { value: 'pix', label: 'PIX' },
  { value: 'transferencia', label: 'Transferência' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'boleto', label: 'Boleto' },
]

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface Props {
  parcela: Parcela | null
  onClose: () => void
  onConfirm?: (parcelaId: string, data: string, forma: FormaPagamento, obs: string) => void
}

export function MarcarParcelaPagaModal({ parcela, onClose, onConfirm }: Props) {
  if (!parcela) return null
  return (
    <MarcarParcelaPagaContent
      key={parcela.id}
      parcela={parcela}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}

function MarcarParcelaPagaContent({
  parcela,
  onClose,
  onConfirm,
}: {
  parcela: Parcela
  onClose: () => void
  onConfirm?: (parcelaId: string, data: string, forma: FormaPagamento, obs: string) => void
}) {
  const hoje = new Date().toISOString().split('T')[0]
  const [dataPagamento, setDataPagamento] = useState(hoje)
  const [forma, setForma] = useState<FormaPagamento>('pix')
  const [observacoes, setObservacoes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const valid = dataPagamento.trim().length > 0

  function handleConfirm() {
    setSubmitted(true)
    if (!valid) return
    onConfirm?.(parcela.id, dataPagamento, forma, observacoes.trim())
    onClose()
  }

  return (
    <Dialog.Root open onOpenChange={(o) => !o && onClose()} modal>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-700 bg-popover shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-zinc-700/60 bg-emerald-500/5 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <CheckCircle className="size-5" />
              </div>
              <div>
                <Dialog.Title className="font-cinzel text-base font-medium tracking-wide text-foreground">
                  Marcar parcela como paga
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-xs text-muted-foreground">
                  Parcela {parcela.numero} · {formatBRL(parcela.valor)}
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

          {/* Form */}
          <div className="space-y-4 px-5 py-4">
            {/* Data */}
            <div className="space-y-1.5">
              <label htmlFor="data-pagamento" className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Data do pagamento *
              </label>
              <input
                id="data-pagamento"
                type="date"
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
                className={cn(
                  'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none transition-all',
                  'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30',
                  submitted && !valid && 'border-red-500/60',
                )}
                autoFocus
              />
              {submitted && !valid && (
                <p className="text-xs text-red-400">Informe a data do pagamento</p>
              )}
            </div>

            {/* Forma de pagamento */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Forma de pagamento
              </p>
              <div className="grid grid-cols-2 gap-2">
                {FORMAS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setForma(f.value)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                      forma === f.value
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                        : 'border-border bg-input text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-1.5">
              <label htmlFor="obs-pagamento" className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Observações <span className="normal-case tracking-normal text-muted-foreground/60">(opcional)</span>
              </label>
              <textarea
                id="obs-pagamento"
                rows={2}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value.slice(0, 200))}
                placeholder="Ex.: pago com 2 dias de atraso"
                className="w-full resize-none rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
              <p className="text-right text-[11px] text-muted-foreground/60">{observacoes.length}/200</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border bg-card/60 px-5 py-3">
            <Dialog.Close render={<Button variant="outline" size="sm">Cancelar</Button>} />
            <Button
              size="sm"
              onClick={handleConfirm}
              className="bg-emerald-600 text-white hover:bg-emerald-500"
            >
              <CheckCircle className="mr-1.5 size-4" />
              Confirmar pagamento
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
