'use client'

import { useEffect, useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { partesMock } from '@/lib/data/partes'
import type { Processo } from '@/types/processos'
import type { FaseProcessual, NivelSigilo } from '@/types/index'

// ─── CNJ mask ────────────────────────────────────────────────────────────────
function maskCNJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 20)
  return digits
    .replace(/^(\d{7})(\d)/, '$1-$2')
    .replace(/^(\d{7}-\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{7}-\d{2}\.\d{4})(\d)/, '$1.$2')
    .replace(/^(\d{7}-\d{2}\.\d{4}\.\d{1})(\d)/, '$1.$2')
    .replace(/^(\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2})(\d)/, '$1.$2')
}

// ─── Tipos Penais disponíveis ─────────────────────────────────────────────────
const TIPOS_PENAIS_DISPONIVEIS = [
  { id: 'art_121_cp', artigo: 'Art. 121', descricao: 'Homicídio doloso' },
  { id: 'art_121_par3_cp', artigo: 'Art. 121 §3º', descricao: 'Homicídio culposo' },
  { id: 'art_129_par9_cp', artigo: 'Art. 129 §9º', descricao: 'Violência doméstica e familiar' },
  { id: 'art_147_cp', artigo: 'Art. 147', descricao: 'Ameaça' },
  { id: 'art_155_cp', artigo: 'Art. 155', descricao: 'Furto' },
  { id: 'art_157_cp', artigo: 'Art. 157', descricao: 'Roubo' },
  { id: 'art_158_cp', artigo: 'Art. 158', descricao: 'Extorsão' },
  { id: 'art_159_cp', artigo: 'Art. 159', descricao: 'Extorsão mediante sequestro' },
  { id: 'art_171_cp', artigo: 'Art. 171', descricao: 'Estelionato' },
  { id: 'art_288_cp', artigo: 'Art. 288', descricao: 'Associação criminosa' },
  { id: 'art_299_cp', artigo: 'Art. 299', descricao: 'Falsidade ideológica' },
  { id: 'art_312_cp', artigo: 'Art. 312', descricao: 'Peculato' },
  { id: 'art_317_cp', artigo: 'Art. 317', descricao: 'Corrupção passiva' },
  { id: 'art_333_cp', artigo: 'Art. 333', descricao: 'Corrupção ativa' },
  { id: 'art_33_lei11343', artigo: 'Art. 33 Lei 11.343', descricao: 'Tráfico de drogas' },
  { id: 'art_1_lei9613', artigo: 'Art. 1º Lei 9.613', descricao: 'Lavagem de dinheiro' },
  { id: 'art_4_lei7492', artigo: 'Art. 4º Lei 7.492', descricao: 'Gestão fraudulenta de instituição financeira' },
  { id: 'art_337a_cp', artigo: 'Art. 337-A', descricao: 'Sonegação de contribuição previdenciária' },
]

const TRIBUNAIS = ['TJSP', 'TJRJ', 'TJMG', 'TRF3', 'STJ', 'STF', 'Outro'] as const

const FASES_PROCESSUAIS: { value: FaseProcessual; label: string }[] = [
  { value: 'pre_processual', label: 'Pré-processual' },
  { value: 'inquerito', label: 'Inquérito' },
  { value: 'denuncia_recebimento', label: 'Denúncia/Recebimento' },
  { value: 'instrucao', label: 'Instrução' },
  { value: 'memoriais', label: 'Memoriais' },
  { value: 'sentenca', label: 'Sentença' },
  { value: 'recursos', label: 'Recursos' },
  { value: 'execucao', label: 'Execução' },
  { value: 'arquivado', label: 'Arquivado' },
]

const SIGILO_OPTIONS: { value: NivelSigilo; label: string }[] = [
  { value: 'publico', label: 'Público' },
  { value: 'restrito', label: 'Restrito' },
  { value: 'segredo_de_justica', label: 'Segredo de Justiça' },
]

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  // Step 1 — Identificação
  numeroCNJ: z.string().min(25, 'CNJ inválido (formato: NNNNNNN-DD.AAAA.J.TR.OOOO)'),
  numeroInterno: z.string().optional(),
  alcunha: z.string().min(2, 'Alcunha obrigatória'),

  // Step 2 — Localização
  tribunal: z.string().min(1, 'Tribunal obrigatório'),
  comarca: z.string().min(2, 'Comarca obrigatória'),
  vara: z.string().min(2, 'Vara obrigatória'),
  juiz: z.string().optional(),

  // Step 3 — Tipificação
  tiposPenaisSelecionados: z.array(z.string()).min(1, 'Selecione ao menos 1 tipo penal'),
  tipoPrincipal: z.string().min(1, 'Selecione o tipo penal principal'),

  // Step 4 — Partes
  clienteId: z.string().min(1, 'Cliente obrigatório'),
  reuId: z.string().optional(),
  vitimasIds: z.array(z.string()).optional(),
  testemunhasIds: z.array(z.string()).optional(),

  // Step 5 — Configuração
  faseAtual: z.enum([
    'pre_processual',
    'inquerito',
    'denuncia_recebimento',
    'instrucao',
    'memoriais',
    'sentenca',
    'recursos',
    'execucao',
    'arquivado',
  ]),
  sigilo: z.enum(['publico', 'restrito', 'segredo_de_justica']),
  responsavelInterno: z.string().min(2, 'Responsável obrigatório'),
  observacoes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Identificação' },
  { id: 2, label: 'Localização' },
  { id: 3, label: 'Tipificação' },
  { id: 4, label: 'Partes' },
  { id: 5, label: 'Configuração' },
]

// ─── Input styles ─────────────────────────────────────────────────────────────
const inputClass =
  'w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-600 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 aria-invalid:border-red-500/60'

// ─── Props ────────────────────────────────────────────────────────────────────
interface NovoProcessoDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  processo?: Processo
  mode?: 'create' | 'edit'
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="border-b border-zinc-800 px-6 py-4">
      <div className="flex items-center gap-2">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id
          return (
            <div key={step.id} className="flex flex-1 items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex size-6 items-center justify-center rounded-full text-xs font-medium transition-colors',
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                        ? 'border-2 border-primary bg-[#1a1408] text-[#e8d09a]'
                        : 'border border-zinc-700 bg-zinc-800 text-zinc-500',
                  )}
                >
                  {isCompleted ? <Check className="size-3" /> : step.id}
                </div>
                <span
                  className={cn(
                    'hidden text-[9px] font-medium uppercase tracking-widest whitespace-nowrap sm:block',
                    isCurrent ? 'text-zinc-300' : 'text-zinc-600',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mb-4 h-px flex-1 transition-colors',
                    isCompleted ? 'bg-primary' : 'bg-zinc-800',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────
export function NovoProcessoDrawer({
  open,
  onOpenChange,
  processo,
  mode = 'create',
}: NovoProcessoDrawerProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const defaultValues: Partial<FormData> = processo
    ? {
        numeroCNJ: processo.numeroCNJ,
        numeroInterno: processo.numeroInterno ?? '',
        alcunha: processo.alcunha,
        tribunal: processo.tribunal,
        comarca: processo.comarca,
        vara: processo.vara,
        juiz: processo.juiz ?? '',
        tiposPenaisSelecionados: processo.tiposPenais.map((t) => t.id),
        tipoPrincipal: processo.tiposPenais.find((t) => t.principal)?.id ?? '',
        clienteId: processo.partes.find((p) => p.papel === 'cliente')?.parteId ?? '',
        reuId: processo.partes.find((p) => p.papel === 'reu')?.parteId ?? '',
        vitimasIds: processo.partes.filter((p) => p.papel === 'vitima').map((p) => p.parteId),
        testemunhasIds: processo.partes.filter((p) => p.papel === 'testemunha').map((p) => p.parteId),
        faseAtual: processo.faseAtual,
        sigilo: processo.sigilo,
        responsavelInterno: processo.responsavelInterno,
        observacoes: processo.observacoes ?? '',
      }
    : {
        tiposPenaisSelecionados: [],
        vitimasIds: [],
        testemunhasIds: [],
        sigilo: 'publico',
      }

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const tiposPenaisSelecionados = watch('tiposPenaisSelecionados') ?? []
  const tipoPrincipal = watch('tipoPrincipal')
  const vitimasIds = watch('vitimasIds') ?? []
  const testemunhasIds = watch('testemunhasIds') ?? []
  const faseAtual = watch('faseAtual')
  const sigilo = watch('sigilo')
  const tribunal = watch('tribunal')

  useEffect(() => {
    if (!open) {
      reset()
      setCurrentStep(1)
    }
  }, [open, reset])

  // When editing, reset defaults when processo changes
  useEffect(() => {
    if (processo && open) {
      reset(defaultValues)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processo, open])

  async function handleNext() {
    let fields: (keyof FormData)[] = []
    if (currentStep === 1) fields = ['numeroCNJ', 'alcunha']
    if (currentStep === 2) fields = ['tribunal', 'comarca', 'vara']
    if (currentStep === 3) fields = ['tiposPenaisSelecionados', 'tipoPrincipal']
    if (currentStep === 4) fields = ['clienteId']

    const valid = await trigger(fields)
    if (valid) setCurrentStep((s) => Math.min(s + 1, 5))
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }

  function onSubmit(_data: FormData) {
    onOpenChange(false)
  }

  // Partes grouped
  const clientes = partesMock.filter((p) => p.tipo === 'cliente' || p.tipo === 'reu')
  const reus = partesMock.filter((p) => p.tipo === 'reu' || p.tipo === 'cliente')
  const vitimas = partesMock.filter((p) => p.tipo === 'vitima')
  const testemunhas = partesMock.filter((p) => p.tipo === 'testemunha')

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-40 flex w-full max-w-2xl flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
            <div>
              <Dialog.Title className="text-base font-semibold text-zinc-50">
                {mode === 'edit' ? 'Editar processo' : 'Novo processo'}
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-xs text-zinc-500">
                {mode === 'edit'
                  ? 'Atualize os dados do processo'
                  : 'Preencha os dados para cadastrar um novo processo'}
              </Dialog.Description>
            </div>
            <Dialog.Close
              render={
                <button className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300">
                  <X className="size-4" />
                </button>
              }
            />
          </div>

          {/* Step progress */}
          <StepProgress currentStep={currentStep} />

          {/* Body — scrollable */}
          <form
            id="novo-processo-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto"
          >
            <div className="space-y-5 px-6 py-5">
              {/* ── Step 1: Identificação ── */}
              {currentStep === 1 && (
                <>
                  <div className="space-y-1.5">
                    <label htmlFor="numeroCNJ" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Número CNJ *
                    </label>
                    <input
                      id="numeroCNJ"
                      {...register('numeroCNJ')}
                      placeholder="0000000-00.0000.0.00.0000"
                      maxLength={25}
                      className={inputClass}
                      aria-invalid={!!errors.numeroCNJ}
                      onChange={(e) => {
                        const masked = maskCNJ(e.target.value)
                        setValue('numeroCNJ', masked, { shouldValidate: true })
                      }}
                    />
                    {errors.numeroCNJ && (
                      <p className="text-xs text-red-400">{errors.numeroCNJ.message}</p>
                    )}
                    <p className="text-[11px] text-zinc-600">
                      Formato: NNNNNNN-DD.AAAA.J.TR.OOOO
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="numeroInterno" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Número interno
                    </label>
                    <input
                      id="numeroInterno"
                      {...register('numeroInterno')}
                      placeholder="Ex: LP-2024-001"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="alcunha" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Alcunha do caso *
                    </label>
                    <input
                      id="alcunha"
                      {...register('alcunha')}
                      placeholder="Ex: Caso Tremembé, Operação Pinheiros..."
                      className={inputClass}
                      aria-invalid={!!errors.alcunha}
                    />
                    {errors.alcunha && (
                      <p className="text-xs text-red-400">{errors.alcunha.message}</p>
                    )}
                  </div>
                </>
              )}

              {/* ── Step 2: Localização ── */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Tribunal *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TRIBUNAIS.map((t) => (
                        <label
                          key={t}
                          className={cn(
                            'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                            tribunal === t
                              ? 'border-primary bg-[#1a1408] text-[#e8d09a]'
                              : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-700',
                          )}
                        >
                          <input
                            type="radio"
                            {...register('tribunal')}
                            value={t}
                            className="sr-only"
                          />
                          {t}
                        </label>
                      ))}
                    </div>
                    {errors.tribunal && (
                      <p className="text-xs text-red-400">{errors.tribunal.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="comarca" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Comarca *
                    </label>
                    <input
                      id="comarca"
                      {...register('comarca')}
                      placeholder="Ex: São Paulo, Rio de Janeiro..."
                      className={inputClass}
                      aria-invalid={!!errors.comarca}
                    />
                    {errors.comarca && (
                      <p className="text-xs text-red-400">{errors.comarca.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="vara" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Vara *
                    </label>
                    <input
                      id="vara"
                      {...register('vara')}
                      placeholder="Ex: 1ª Vara Criminal, 3ª Vara Federal..."
                      className={inputClass}
                      aria-invalid={!!errors.vara}
                    />
                    {errors.vara && (
                      <p className="text-xs text-red-400">{errors.vara.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="juiz" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Juiz
                    </label>
                    <input
                      id="juiz"
                      {...register('juiz')}
                      placeholder="Ex: Dr. Antônio Rodrigues Filho"
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              {/* ── Step 3: Tipificação ── */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Tipos penais *
                    </label>
                    <p className="text-xs text-zinc-600">
                      Selecione os tipos penais e marque o principal.
                    </p>
                    {errors.tiposPenaisSelecionados && (
                      <p className="text-xs text-red-400">
                        {errors.tiposPenaisSelecionados.message}
                      </p>
                    )}
                    {errors.tipoPrincipal && (
                      <p className="text-xs text-red-400">{errors.tipoPrincipal.message}</p>
                    )}

                    <div className="space-y-2">
                      {TIPOS_PENAIS_DISPONIVEIS.map((tipo) => {
                        const isSelected = tiposPenaisSelecionados.includes(tipo.id)
                        const isPrincipal = tipoPrincipal === tipo.id

                        return (
                          <div
                            key={tipo.id}
                            className={cn(
                              'flex flex-col gap-2 rounded-lg border px-3 py-2.5 transition-colors sm:flex-row sm:items-center sm:justify-between',
                              isSelected
                                ? 'border-[#2a1f08] bg-[#1a1408]/40'
                                : 'border-zinc-700 bg-zinc-800',
                            )}
                          >
                            <label className="flex flex-1 cursor-pointer items-start gap-3 sm:items-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const current = tiposPenaisSelecionados
                                  if (e.target.checked) {
                                    setValue('tiposPenaisSelecionados', [...current, tipo.id], {
                                      shouldValidate: true,
                                    })
                                  } else {
                                    setValue(
                                      'tiposPenaisSelecionados',
                                      current.filter((id) => id !== tipo.id),
                                      { shouldValidate: true },
                                    )
                                    if (isPrincipal) setValue('tipoPrincipal', '')
                                  }
                                }}
                                className="mt-0.5 size-4 shrink-0 rounded border-zinc-600 accent-[#c9a961] sm:mt-0"
                              />
                              <div className="min-w-0">
                                <span className="text-sm font-medium text-zinc-200">
                                  {tipo.artigo}
                                </span>
                                <span className="ml-2 text-sm text-zinc-400">{tipo.descricao}</span>
                              </div>
                            </label>

                            {isSelected && (
                              <label className="flex cursor-pointer items-center gap-1.5 self-end text-xs sm:ml-3 sm:self-auto">
                                <input
                                  type="radio"
                                  name="tipoPrincipal"
                                  value={tipo.id}
                                  checked={isPrincipal}
                                  onChange={() => setValue('tipoPrincipal', tipo.id, { shouldValidate: true })}
                                  className="sr-only"
                                />
                                <span
                                  className={cn(
                                    'rounded-full border px-2 py-0.5 transition-colors',
                                    isPrincipal
                                      ? 'border-primary bg-primary text-primary-foreground'
                                      : 'border-zinc-600 text-zinc-500 hover:border-zinc-500 hover:text-zinc-400',
                                  )}
                                >
                                  Principal
                                </span>
                              </label>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* ── Step 4: Partes ── */}
              {currentStep === 4 && (
                <>
                  {/* Cliente */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Cliente *
                    </label>
                    <div className="space-y-1.5">
                      {clientes.map((p) => (
                        <label
                          key={p.id}
                          className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 transition-colors has-[:checked]:border-primary has-[:checked]:bg-[#1a1408]/40"
                        >
                          <input
                            type="radio"
                            {...register('clienteId')}
                            value={p.id}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-zinc-200">{p.nome}</p>
                            <p className="text-xs text-zinc-500">{p.cpf} · {p.tipo === 'cliente' ? 'Cliente' : 'Réu'}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.clienteId && (
                      <p className="text-xs text-red-400">{errors.clienteId.message}</p>
                    )}
                  </div>

                  {/* Réu */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Réu
                    </label>
                    <div className="space-y-1.5">
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 transition-colors has-[:checked]:border-primary has-[:checked]:bg-[#1a1408]/40">
                        <input
                          type="radio"
                          {...register('reuId')}
                          value=""
                          className="sr-only"
                        />
                        <p className="text-sm text-zinc-500">Sem réu separado</p>
                      </label>
                      {reus.map((p) => (
                        <label
                          key={p.id}
                          className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 transition-colors has-[:checked]:border-primary has-[:checked]:bg-[#1a1408]/40"
                        >
                          <input
                            type="radio"
                            {...register('reuId')}
                            value={p.id}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-zinc-200">{p.nome}</p>
                            <p className="text-xs text-zinc-500">{p.cpf}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Vítimas */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Vítimas
                    </label>
                    <div className="space-y-1.5">
                      {vitimas.map((p) => {
                        const isChecked = vitimasIds.includes(p.id)
                        return (
                          <label
                            key={p.id}
                            className={cn(
                              'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                              isChecked
                                ? 'border-primary bg-[#1a1408]/40'
                                : 'border-zinc-700 bg-zinc-800',
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = vitimasIds
                                setValue(
                                  'vitimasIds',
                                  e.target.checked
                                    ? [...current, p.id]
                                    : current.filter((id) => id !== p.id),
                                )
                              }}
                              className="size-4 rounded border-zinc-600 accent-[#c9a961]"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-zinc-200">{p.nome}</p>
                              <p className="text-xs text-zinc-500">{p.cpf}</p>
                            </div>
                          </label>
                        )
                      })}
                      {vitimas.length === 0 && (
                        <p className="text-xs text-zinc-600">Nenhuma vítima cadastrada.</p>
                      )}
                    </div>
                  </div>

                  {/* Testemunhas */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Testemunhas
                    </label>
                    <div className="space-y-1.5">
                      {testemunhas.map((p) => {
                        const isChecked = testemunhasIds.includes(p.id)
                        return (
                          <label
                            key={p.id}
                            className={cn(
                              'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                              isChecked
                                ? 'border-primary bg-[#1a1408]/40'
                                : 'border-zinc-700 bg-zinc-800',
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = testemunhasIds
                                setValue(
                                  'testemunhasIds',
                                  e.target.checked
                                    ? [...current, p.id]
                                    : current.filter((id) => id !== p.id),
                                )
                              }}
                              className="size-4 rounded border-zinc-600 accent-[#c9a961]"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-zinc-200">{p.nome}</p>
                              <p className="text-xs text-zinc-500">{p.cpf}</p>
                            </div>
                          </label>
                        )
                      })}
                      {testemunhas.length === 0 && (
                        <p className="text-xs text-zinc-600">Nenhuma testemunha cadastrada.</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ── Step 5: Configuração ── */}
              {currentStep === 5 && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Fase processual *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FASES_PROCESSUAIS.map((f) => (
                        <label
                          key={f.value}
                          className={cn(
                            'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                            faseAtual === f.value
                              ? 'border-primary bg-[#1a1408] text-[#e8d09a]'
                              : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-700',
                          )}
                        >
                          <input
                            type="radio"
                            {...register('faseAtual')}
                            value={f.value}
                            className="sr-only"
                          />
                          {f.label}
                        </label>
                      ))}
                    </div>
                    {errors.faseAtual && (
                      <p className="text-xs text-red-400">{errors.faseAtual.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Sigilo *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SIGILO_OPTIONS.map((s) => (
                        <label
                          key={s.value}
                          className={cn(
                            'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                            sigilo === s.value
                              ? 'border-primary bg-[#1a1408] text-[#e8d09a]'
                              : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-700',
                          )}
                        >
                          <input
                            type="radio"
                            {...register('sigilo')}
                            value={s.value}
                            className="sr-only"
                          />
                          {s.label}
                        </label>
                      ))}
                    </div>
                    {errors.sigilo && (
                      <p className="text-xs text-red-400">{errors.sigilo.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="responsavelInterno" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Responsável interno *
                    </label>
                    <input
                      id="responsavelInterno"
                      {...register('responsavelInterno')}
                      placeholder="Ex: Dr. Leandro Pedrosa"
                      className={inputClass}
                      aria-invalid={!!errors.responsavelInterno}
                    />
                    {errors.responsavelInterno && (
                      <p className="text-xs text-red-400">{errors.responsavelInterno.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="observacoes" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Observações
                    </label>
                    <textarea
                      id="observacoes"
                      {...register('observacoes')}
                      rows={3}
                      placeholder="Notas internas sobre este processo..."
                      className={cn(inputClass, 'resize-none')}
                    />
                  </div>
                </>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-4">
            <div>
              {currentStep > 1 ? (
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ChevronLeft className="size-4" />
                  Voltar
                </Button>
              ) : (
                <Dialog.Close
                  render={
                    <Button variant="ghost" size="sm">
                      Cancelar
                    </Button>
                  }
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-600">
                Etapa {currentStep} de {STEPS.length}
              </span>
              {currentStep < STEPS.length ? (
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground hover:bg-primary/80"
                >
                  Próximo
                  <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  form="novo-processo-form"
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/80"
                >
                  {mode === 'edit' ? 'Salvar alterações' : 'Cadastrar processo'}
                </Button>
              )}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
