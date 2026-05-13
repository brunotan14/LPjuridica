'use client'

import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { TipoContrato, IntervaloParcela, GatilhoExito } from '@/types/financeiro'
import type { ParteProcesso } from '@/types/processos'

const TIPOS: { value: TipoContrato; label: string }[] = [
  { value: 'contratual', label: 'Contratual' },
  { value: 'exito', label: 'Êxito' },
  { value: 'pro_bono', label: 'Pro Bono' },
  { value: 'dativo', label: 'Dativo' },
]

const GATILHOS: { value: GatilhoExito; label: string }[] = [
  { value: 'absolvicao', label: 'Absolvição' },
  { value: 'desclassificacao', label: 'Desclassificação' },
  { value: 'reducao_de_pena', label: 'Redução de pena' },
]

const INTERVALOS: { value: IntervaloParcela; label: string }[] = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'quinzenal', label: 'Quinzenal' },
]

interface NovoContratoPayload {
  tipo: TipoContrato
  parteContratanteId: string
  valorTotal?: number
  quantidadeParcelas?: number
  dataPrimeiraParcela?: string
  intervalo?: IntervaloParcela
  gatilho?: GatilhoExito
  percentual?: number
  valorEstimado?: number
}

interface Props {
  open: boolean
  onClose: () => void
  partes: ParteProcesso[]
  onConfirm?: (payload: NovoContratoPayload) => void
}

export function NovoContratoModal({ open, onClose, partes, onConfirm }: Props) {
  if (!open) return null
  return (
    <NovoContratoContent
      key="novo-contrato"
      onClose={onClose}
      partes={partes}
      onConfirm={onConfirm}
    />
  )
}

function NovoContratoContent({
  onClose,
  partes,
  onConfirm,
}: {
  onClose: () => void
  partes: ParteProcesso[]
  onConfirm?: (payload: NovoContratoPayload) => void
}) {
  const hoje = new Date().toISOString().split('T')[0]
  const [tipo, setTipo] = useState<TipoContrato>('contratual')
  const [parteId, setParteId] = useState(partes[0]?.parteId ?? '')
  const [valorTotal, setValorTotal] = useState('')
  const [qtdParcelas, setQtdParcelas] = useState('1')
  const [dataPrimeira, setDataPrimeira] = useState(hoje)
  const [intervalo, setIntervalo] = useState<IntervaloParcela>('mensal')
  const [gatilho, setGatilho] = useState<GatilhoExito>('absolvicao')
  const [percentual, setPercentual] = useState('')
  const [valorEstimado, setValorEstimado] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const clientePartes = partes.filter((p) => p.papel === 'cliente')
  const partesOpcoes = clientePartes.length > 0 ? clientePartes : partes

  const errors = {
    parte: !parteId,
    valorTotal: tipo === 'contratual' && (!valorTotal || Number(valorTotal) <= 0),
    parcelas: tipo === 'contratual' && (!qtdParcelas || Number(qtdParcelas) < 1),
    dataPrimeira: tipo === 'contratual' && !dataPrimeira,
    percentual: tipo === 'exito' && (!percentual || Number(percentual) <= 0),
  }
  const hasErrors = Object.values(errors).some(Boolean)

  function handleConfirm() {
    setSubmitted(true)
    if (hasErrors) return

    const payload: NovoContratoPayload = {
      tipo,
      parteContratanteId: parteId,
      ...(tipo === 'contratual' && {
        valorTotal: Number(valorTotal),
        quantidadeParcelas: Number(qtdParcelas),
        dataPrimeiraParcela: dataPrimeira,
        intervalo,
      }),
      ...(tipo === 'exito' && {
        gatilho,
        percentual: Number(percentual),
        valorEstimado: valorEstimado ? Number(valorEstimado) : undefined,
      }),
    }

    console.log('[Financeiro] Novo contrato:', payload)
    onConfirm?.(payload)
    onClose()
  }

  return (
    <Dialog.Root open onOpenChange={(o) => !o && onClose()} modal>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-700 bg-popover shadow-2xl overflow-y-auto max-h-[calc(100vh-2rem)]">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-zinc-700/60 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-400">
                <FileText className="size-5" />
              </div>
              <div>
                <Dialog.Title className="font-cinzel text-base font-medium tracking-wide text-foreground">
                  Novo Contrato de Honorários
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-xs text-muted-foreground">
                  Preencha os dados do contrato
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

          <div className="space-y-5 px-5 py-4">
            {/* Tipo */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Tipo de contrato</p>
              <div className="grid grid-cols-2 gap-2">
                {TIPOS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTipo(t.value)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                      tipo === t.value
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                        : 'border-border bg-input text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Parte contratante */}
            <div className="space-y-1.5">
              <label htmlFor="parte-contratante" className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Parte contratante *
              </label>
              <select
                id="parte-contratante"
                value={parteId}
                onChange={(e) => setParteId(e.target.value)}
                className={cn(
                  'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none transition-all',
                  'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30',
                  submitted && errors.parte && 'border-red-500/60',
                )}
                autoFocus
              >
                {partesOpcoes.map((p) => (
                  <option key={p.parteId} value={p.parteId}>
                    {p.nome}
                  </option>
                ))}
              </select>
              {submitted && errors.parte && (
                <p className="text-xs text-red-400">Selecione a parte contratante</p>
              )}
            </div>

            {/* Campos contratual */}
            {tipo === 'contratual' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="valor-total" className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Valor total (R$) *
                    </label>
                    <input
                      id="valor-total"
                      type="number"
                      min="0"
                      step="0.01"
                      value={valorTotal}
                      onChange={(e) => setValorTotal(e.target.value)}
                      placeholder="0,00"
                      className={cn(
                        'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all',
                        'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30',
                        submitted && errors.valorTotal && 'border-red-500/60',
                      )}
                    />
                    {submitted && errors.valorTotal && (
                      <p className="text-xs text-red-400">Valor inválido</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="qtd-parcelas" className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Nº de parcelas *
                    </label>
                    <input
                      id="qtd-parcelas"
                      type="number"
                      min="1"
                      max="60"
                      value={qtdParcelas}
                      onChange={(e) => setQtdParcelas(e.target.value)}
                      className={cn(
                        'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none transition-all',
                        'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30',
                        submitted && errors.parcelas && 'border-red-500/60',
                      )}
                    />
                    {submitted && errors.parcelas && (
                      <p className="text-xs text-red-400">Mínimo 1 parcela</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="data-primeira" className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Primeira parcela *
                    </label>
                    <input
                      id="data-primeira"
                      type="date"
                      value={dataPrimeira}
                      onChange={(e) => setDataPrimeira(e.target.value)}
                      className={cn(
                        'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none transition-all',
                        'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30',
                        submitted && errors.dataPrimeira && 'border-red-500/60',
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Intervalo</p>
                    <div className="flex gap-2">
                      {INTERVALOS.map((i) => (
                        <button
                          key={i.value}
                          type="button"
                          onClick={() => setIntervalo(i.value)}
                          className={cn(
                            'flex-1 rounded-lg border px-2 py-2 text-sm font-medium transition-colors',
                            intervalo === i.value
                              ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                              : 'border-border bg-input text-muted-foreground hover:bg-accent hover:text-foreground',
                          )}
                        >
                          {i.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {valorTotal && qtdParcelas && Number(qtdParcelas) > 0 && (
                  <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-xs text-indigo-300">
                    {Number(qtdParcelas)}× de{' '}
                    <strong>
                      {(Number(valorTotal) / Number(qtdParcelas)).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </strong>
                  </div>
                )}
              </>
            )}

            {/* Campos êxito */}
            {tipo === 'exito' && (
              <>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Gatilho *</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {GATILHOS.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setGatilho(g.value)}
                        className={cn(
                          'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                          gatilho === g.value
                            ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                            : 'border-border bg-input text-muted-foreground hover:bg-accent hover:text-foreground',
                        )}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="percentual" className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Percentual (%) *
                    </label>
                    <input
                      id="percentual"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={percentual}
                      onChange={(e) => setPercentual(e.target.value)}
                      placeholder="Ex.: 20"
                      className={cn(
                        'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all',
                        'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30',
                        submitted && errors.percentual && 'border-red-500/60',
                      )}
                    />
                    {submitted && errors.percentual && (
                      <p className="text-xs text-red-400">Informe o percentual</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="valor-estimado" className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Valor estimado (R$) <span className="normal-case tracking-normal text-muted-foreground/60">(opcional)</span>
                    </label>
                    <input
                      id="valor-estimado"
                      type="number"
                      min="0"
                      step="0.01"
                      value={valorEstimado}
                      onChange={(e) => setValorEstimado(e.target.value)}
                      placeholder="0,00"
                      className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Pro bono / dativo — sem campos extras */}
            {(tipo === 'pro_bono' || tipo === 'dativo') && (
              <div className="rounded-lg border border-zinc-700/40 bg-zinc-800/40 px-3 py-2.5 text-xs text-muted-foreground">
                {tipo === 'pro_bono'
                  ? 'Contrato pro bono — serviços prestados sem cobrança de honorários.'
                  : 'Contrato dativo — advogado nomeado pelo juízo. Honorários pagos pelo Estado conforme tabela OAB.'}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border bg-card/60 px-5 py-3">
            <Dialog.Close render={<Button variant="outline" size="sm">Cancelar</Button>} />
            <Button size="sm" onClick={handleConfirm}>
              <FileText className="mr-1.5 size-4" />
              Criar contrato
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
