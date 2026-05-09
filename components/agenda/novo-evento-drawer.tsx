'use client'

import { useEffect } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { processosMock } from '@/lib/data/processos'
import { partesMock } from '@/lib/data/partes'
import type { TipoEvento } from '@/types/agenda'
import { TIPO_META } from '@/types/agenda'

// ─── Schema com refines condicionais por tipo ─────────────────────────────────
const schema = z
  .object({
    tipo: z.enum(['prazo', 'audiencia', 'visita_preso', 'reuniao', 'diligencia']),
    titulo: z.string().min(3, 'Título obrigatório (mínimo 3 caracteres)'),
    data: z.string().min(1, 'Data obrigatória'),
    dataFim: z.string().optional(),
    hora: z.string().optional(),
    local: z.string().optional(),
    processoId: z.string().optional(),
    parteId: z.string().optional(),
    partesPresentes: z.string().optional(),
    responsavel: z.string().min(3, 'Responsável obrigatório'),
    descricao: z.string().optional(),
  })
  .refine((d) => d.tipo !== 'prazo' || (d.dataFim && d.dataFim.length > 0), {
    message: 'Data fatal obrigatória para prazos',
    path: ['dataFim'],
  })
  .refine(
    (d) =>
      d.tipo === 'reuniao' ||
      (d.processoId !== undefined && d.processoId.length > 0),
    {
      message: 'Processo vinculado é obrigatório',
      path: ['processoId'],
    }
  )
  .refine(
    (d) =>
      (d.tipo !== 'visita_preso' && d.tipo !== 'reuniao') ||
      (d.parteId !== undefined && d.parteId.length > 0),
    {
      message: 'Parte vinculada é obrigatória',
      path: ['parteId'],
    }
  )
  .refine((d) => d.tipo === 'prazo' || (d.hora && d.hora.length > 0), {
    message: 'Hora obrigatória para este tipo',
    path: ['hora'],
  })
  .refine((d) => d.tipo === 'prazo' || (d.local && d.local.length > 0), {
    message: 'Local obrigatório para este tipo',
    path: ['local'],
  })

type FormData = z.infer<typeof schema>

const TIPO_OPTIONS: {
  value: TipoEvento
  label: string
  helper: string
}[] = [
  { value: 'prazo', label: 'Prazo', helper: 'Prazo processual com data fatal' },
  {
    value: 'audiencia',
    label: 'Audiência',
    helper: 'Sessão judicial em comarca/vara',
  },
  {
    value: 'visita_preso',
    label: 'Visita ao preso',
    helper: 'Visita técnica em unidade prisional',
  },
  {
    value: 'reuniao',
    label: 'Reunião',
    helper: 'Encontro com cliente (sem processo obrigatório)',
  },
  {
    value: 'diligencia',
    label: 'Diligência',
    helper: 'Carga de autos, coleta de prova, etc',
  },
]

const inputClass =
  'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 aria-invalid:border-red-500/60'

const labelClass =
  'block text-[10px] font-medium uppercase tracking-widest text-muted-foreground'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NovoEventoDrawer({ open, onOpenChange }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo: 'prazo',
      responsavel: 'Dr. Leandro Pedrosa',
      data: new Date().toISOString().slice(0, 10),
    },
  })

  const tipoWatched = watch('tipo')
  const meta = TIPO_META[tipoWatched]

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  function onSubmit(_data: FormData) {
    // Mock: apenas fecha o drawer.
    // Backend real implementado no M5 backend.
    onOpenChange(false)
  }

  // Helpers de visibilidade condicional ---------------------------------------
  const showDataFim = tipoWatched === 'prazo'
  const showHora = tipoWatched !== 'prazo'
  const showLocal = tipoWatched !== 'prazo'
  const showProcesso = tipoWatched !== 'reuniao'
  const showParte = tipoWatched === 'visita_preso' || tipoWatched === 'reuniao'
  const showPartesPresentes = tipoWatched === 'audiencia'

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-40 flex w-full max-w-xl flex-col border-l border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <Dialog.Title className="font-cinzel text-base font-medium tracking-wide text-foreground">
                Novo Evento
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-xs text-muted-foreground">
                Cadastre um {meta.label.toLowerCase()} na agenda
              </Dialog.Description>
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

          {/* Body — scrollable */}
          <form
            id="novo-evento-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 space-y-5 overflow-y-auto px-6 py-5"
          >
            {/* Tipo (radio pills) */}
            <div className="space-y-1.5">
              <label className={labelClass}>Tipo de evento *</label>
              <div className="flex flex-wrap gap-2">
                {TIPO_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                      tipoWatched === opt.value
                        ? 'border-primary bg-accent text-accent-foreground'
                        : 'border-border bg-input text-secondary-foreground hover:border-primary/40 hover:bg-accent'
                    )}
                  >
                    <input
                      type="radio"
                      {...register('tipo')}
                      value={opt.value}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">{meta && TIPO_OPTIONS.find((o) => o.value === tipoWatched)?.helper}</p>
            </div>

            {/* Título */}
            <div className="space-y-1.5">
              <label htmlFor="titulo" className={labelClass}>
                Título *
              </label>
              <input
                id="titulo"
                type="text"
                placeholder={
                  tipoWatched === 'prazo'
                    ? 'Ex: Recurso de Apelação — prazo fatal'
                    : tipoWatched === 'audiencia'
                      ? 'Ex: Audiência de Instrução'
                      : 'Ex: ...'
                }
                aria-invalid={!!errors.titulo}
                className={inputClass}
                {...register('titulo')}
              />
              {errors.titulo && (
                <p className="text-xs text-red-400">{errors.titulo.message}</p>
              )}
            </div>

            {/* Data + Data fim/Hora */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="data" className={labelClass}>
                  {tipoWatched === 'prazo' ? 'Data início *' : 'Data *'}
                </label>
                <input
                  id="data"
                  type="date"
                  aria-invalid={!!errors.data}
                  className={inputClass}
                  {...register('data')}
                />
                {errors.data && (
                  <p className="text-xs text-red-400">{errors.data.message}</p>
                )}
              </div>

              {showDataFim && (
                <div className="space-y-1.5">
                  <label htmlFor="dataFim" className={labelClass}>
                    Data fim (prazo fatal) *
                  </label>
                  <input
                    id="dataFim"
                    type="date"
                    aria-invalid={!!errors.dataFim}
                    className={inputClass}
                    {...register('dataFim')}
                  />
                  {errors.dataFim && (
                    <p className="text-xs text-red-400">
                      {errors.dataFim.message}
                    </p>
                  )}
                </div>
              )}

              {showHora && (
                <div className="space-y-1.5">
                  <label htmlFor="hora" className={labelClass}>
                    Hora *
                  </label>
                  <input
                    id="hora"
                    type="time"
                    aria-invalid={!!errors.hora}
                    className={inputClass}
                    {...register('hora')}
                  />
                  {errors.hora && (
                    <p className="text-xs text-red-400">{errors.hora.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Local */}
            {showLocal && (
              <div className="space-y-1.5">
                <label htmlFor="local" className={labelClass}>
                  Local *
                </label>
                <input
                  id="local"
                  type="text"
                  placeholder={
                    tipoWatched === 'audiencia'
                      ? 'Comarca de São Paulo — 4ª Vara Criminal'
                      : tipoWatched === 'visita_preso'
                        ? 'Penitenciária de Tremembé — Bloco A'
                        : 'Endereço completo'
                  }
                  aria-invalid={!!errors.local}
                  className={inputClass}
                  {...register('local')}
                />
                {errors.local && (
                  <p className="text-xs text-red-400">{errors.local.message}</p>
                )}
              </div>
            )}

            {/* Processo */}
            {showProcesso && (
              <div className="space-y-1.5">
                <label htmlFor="processoId" className={labelClass}>
                  Processo{showProcesso ? ' *' : ''}
                </label>
                <select
                  id="processoId"
                  aria-invalid={!!errors.processoId}
                  className={inputClass}
                  defaultValue=""
                  {...register('processoId')}
                >
                  <option value="" disabled>
                    Selecione um processo…
                  </option>
                  {processosMock.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.alcunha} — {p.numeroCNJ}
                    </option>
                  ))}
                </select>
                {errors.processoId && (
                  <p className="text-xs text-red-400">
                    {errors.processoId.message}
                  </p>
                )}
              </div>
            )}

            {/* Parte (cliente / réu) */}
            {showParte && (
              <div className="space-y-1.5">
                <label htmlFor="parteId" className={labelClass}>
                  {tipoWatched === 'visita_preso' ? 'Réu *' : 'Cliente *'}
                </label>
                <select
                  id="parteId"
                  aria-invalid={!!errors.parteId}
                  className={inputClass}
                  defaultValue=""
                  {...register('parteId')}
                >
                  <option value="" disabled>
                    Selecione uma parte…
                  </option>
                  {partesMock
                    .filter((p) =>
                      tipoWatched === 'visita_preso'
                        ? p.tipo === 'reu' || p.situacaoPrisional === 'preso'
                        : p.tipo === 'cliente'
                    )
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                </select>
                {errors.parteId && (
                  <p className="text-xs text-red-400">{errors.parteId.message}</p>
                )}
              </div>
            )}

            {/* Partes presentes (audiência) */}
            {showPartesPresentes && (
              <div className="space-y-1.5">
                <label htmlFor="partesPresentes" className={labelClass}>
                  Partes presentes esperadas
                </label>
                <textarea
                  id="partesPresentes"
                  rows={3}
                  placeholder="Uma por linha. Ex: Réu, Testemunha 1, Testemunha 2"
                  className={inputClass}
                  {...register('partesPresentes')}
                />
              </div>
            )}

            {/* Responsável */}
            <div className="space-y-1.5">
              <label htmlFor="responsavel" className={labelClass}>
                Responsável interno *
              </label>
              <input
                id="responsavel"
                type="text"
                aria-invalid={!!errors.responsavel}
                className={inputClass}
                {...register('responsavel')}
              />
              {errors.responsavel && (
                <p className="text-xs text-red-400">
                  {errors.responsavel.message}
                </p>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-1.5">
              <label htmlFor="descricao" className={labelClass}>
                {tipoWatched === 'prazo'
                  ? 'Descrição do prazo'
                  : 'Observações'}
              </label>
              <textarea
                id="descricao"
                rows={3}
                placeholder={
                  tipoWatched === 'prazo'
                    ? 'Ex: Recurso contra sentença condenatória de 10 anos.'
                    : 'Notas internas sobre este evento'
                }
                className={inputClass}
                {...register('descricao')}
              />
            </div>
          </form>

          {/* Footer fixo */}
          <div className="flex items-center justify-end gap-2 border-t border-border bg-card/60 px-6 py-3">
            <Dialog.Close
              render={
                <Button variant="outline" size="sm">
                  Cancelar
                </Button>
              }
            />
            <Button
              type="submit"
              form="novo-evento-form"
              size="sm"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? 'Salvando…' : 'Cadastrar evento'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
