'use client'

import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { Receipt, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CategoriaDespesa } from '@/types/financeiro'

const CATEGORIAS: { value: CategoriaDespesa; label: string }[] = [
  { value: 'custas', label: 'Custas processuais' },
  { value: 'pericia', label: 'Perícia' },
  { value: 'viagem', label: 'Viagem / diária' },
  { value: 'cartorio', label: 'Cartório' },
  { value: 'outro', label: 'Outro' },
]

interface NovaDespesaPayload {
  categoria: CategoriaDespesa
  descricao: string
  valor: number
  data: string
}

interface Props {
  open: boolean
  onClose: () => void
  onConfirm?: (payload: NovaDespesaPayload) => void
}

export function NovaDespesaModal({ open, onClose, onConfirm }: Props) {
  if (!open) return null
  return (
    <NovaDespesaContent key="nova-despesa" onClose={onClose} onConfirm={onConfirm} />
  )
}

function NovaDespesaContent({
  onClose,
  onConfirm,
}: {
  onClose: () => void
  onConfirm?: (payload: NovaDespesaPayload) => void
}) {
  const hoje = new Date().toISOString().split('T')[0]
  const [categoria, setCategoria] = useState<CategoriaDespesa>('custas')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState(hoje)
  const [submitted, setSubmitted] = useState(false)

  const errors = {
    descricao: descricao.trim().length < 3,
    valor: !valor || Number(valor) <= 0,
    data: !data,
  }
  const hasErrors = Object.values(errors).some(Boolean)

  function handleConfirm() {
    setSubmitted(true)
    if (hasErrors) return
    onConfirm?.({ categoria, descricao: descricao.trim(), valor: Number(valor), data })
    console.log('[Financeiro] Nova despesa:', { categoria, descricao, valor, data })
    onClose()
  }

  return (
    <Dialog.Root open onOpenChange={(o) => !o && onClose()} modal>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-700 bg-popover shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-zinc-700/60 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                <Receipt className="size-5" />
              </div>
              <div>
                <Dialog.Title className="font-cinzel text-base font-medium tracking-wide text-foreground">
                  Nova Despesa Reembolsável
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-xs text-muted-foreground">
                  Registre a despesa para reembolso futuro
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

          <div className="space-y-4 px-5 py-4">
            {/* Categoria */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Categoria</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CATEGORIAS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategoria(c.value)}
                    className={cn(
                      'rounded-lg border px-2 py-2 text-xs font-medium transition-colors',
                      categoria === c.value
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                        : 'border-border bg-input text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-1.5">
              <label htmlFor="desp-descricao" className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Descrição *
              </label>
              <input
                id="desp-descricao"
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value.slice(0, 200))}
                placeholder="Ex.: Custas processuais — audiência de instrução"
                autoFocus
                className={cn(
                  'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all',
                  'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30',
                  submitted && errors.descricao && 'border-red-500/60',
                )}
              />
              {submitted && errors.descricao && (
                <p className="text-xs text-red-400">Descrição muito curta</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Valor */}
              <div className="space-y-1.5">
                <label htmlFor="desp-valor" className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Valor (R$) *
                </label>
                <input
                  id="desp-valor"
                  type="number"
                  min="0"
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0,00"
                  className={cn(
                    'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all',
                    'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30',
                    submitted && errors.valor && 'border-red-500/60',
                  )}
                />
                {submitted && errors.valor && (
                  <p className="text-xs text-red-400">Valor inválido</p>
                )}
              </div>

              {/* Data */}
              <div className="space-y-1.5">
                <label htmlFor="desp-data" className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Data *
                </label>
                <input
                  id="desp-data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className={cn(
                    'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none transition-all',
                    'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30',
                    submitted && errors.data && 'border-red-500/60',
                  )}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border bg-card/60 px-5 py-3">
            <Dialog.Close render={<Button variant="outline" size="sm">Cancelar</Button>} />
            <Button
              size="sm"
              onClick={handleConfirm}
              className="bg-amber-600 text-white hover:bg-amber-500"
            >
              <Receipt className="mr-1.5 size-4" />
              Registrar despesa
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
