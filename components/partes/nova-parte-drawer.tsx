'use client'

import { useEffect, useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { Select } from '@base-ui/react/select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { X, ChevronDown, Check, AlertTriangle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { partesMock } from '@/lib/data/partes'
import { BadgeTipoParte } from '@/components/partes/badge-tipo-parte'
import type { Parte, TipoParte, SituacaoPrisional } from '@/types/partes'

// ─── CPF validation ──────────────────────────────────────────────────────────
function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return false
  if (/^(\d)\1+$/.test(digits)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]!) * (10 - i)
  let rem = (sum * 10) % 11
  if (rem === 10 || rem === 11) rem = 0
  if (rem !== parseInt(digits[9]!)) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]!) * (11 - i)
  rem = (sum * 10) % 11
  if (rem === 10 || rem === 11) rem = 0
  return rem === parseInt(digits[10]!)
}

function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

// ─── Schema ──────────────────────────────────────────────────────────────────
const schema = z
  .object({
    nome: z.string().min(3, 'Nome obrigatório'),
    cpf: z.string().refine((v) => validateCPF(v), 'CPF inválido'),
    rg: z.string().optional(),
    dataNascimento: z.string().optional(),
    filiacao: z.string().optional(),
    naturalidade: z.string().optional(),
    profissao: z.string().optional(),
    telefone: z.string().min(10, 'Telefone obrigatório'),
    email: z.string().email('E-mail inválido').optional().or(z.literal('')),
    endereco: z.string().optional(),
    tipo: z.enum(['cliente', 'reu', 'vitima', 'testemunha', 'autoridade']),
    situacaoPrisional: z.enum(['preso', 'solto', 'monitorado']).optional(),
    unidadePrisional: z.string().optional(),
    cargo: z.string().optional(),
    comarca: z.string().optional(),
    observacoes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.tipo === 'reu' && !data.situacaoPrisional) return false
      return true
    },
    { message: 'Situação prisional obrigatória para réus', path: ['situacaoPrisional'] },
  )

type FormData = z.infer<typeof schema>

// ─── Props ───────────────────────────────────────────────────────────────────
interface NovaParteDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parte?: Parte
  mode?: 'create' | 'edit'
}

const tipoOptions: { value: TipoParte; label: string }[] = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'reu', label: 'Réu' },
  { value: 'vitima', label: 'Vítima' },
  { value: 'testemunha', label: 'Testemunha' },
  { value: 'autoridade', label: 'Autoridade' },
]

const situacaoOptions: { value: SituacaoPrisional; label: string }[] = [
  { value: 'preso', label: 'Preso' },
  { value: 'solto', label: 'Solto' },
  { value: 'monitorado', label: 'Monitorado' },
]

// ─── Input styles ─────────────────────────────────────────────────────────────
const inputClass =
  'w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-600 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 aria-invalid:border-red-500/60'

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
function DeleteConfirmDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        render={
          <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-950 hover:text-red-300">
            <Trash2 className="size-4" />
            Excluir parte
          </button>
        }
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <Dialog.Title className="text-base font-semibold text-zinc-50">
            Excluir parte
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-zinc-400">
            Tem certeza que deseja excluir esta parte? Esta ação não pode ser desfeita.
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close
              render={
                <Button variant="ghost" size="sm">
                  Cancelar
                </Button>
              }
            />
            <Button
              size="sm"
              variant="destructive"
              onClick={onConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Excluir
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────
export function NovaParteDrawer({
  open,
  onOpenChange,
  parte,
  mode = 'create',
}: NovaParteDrawerProps) {
  const [cpfDuplicate, setCpfDuplicate] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: parte
      ? {
          nome: parte.nome,
          cpf: parte.cpf,
          rg: parte.rg ?? '',
          dataNascimento: parte.dataNascimento ?? '',
          filiacao: parte.filiacao ?? '',
          naturalidade: parte.naturalidade ?? '',
          profissao: parte.profissao ?? '',
          telefone: parte.telefone,
          email: parte.email ?? '',
          endereco: parte.endereco ?? '',
          tipo: parte.tipo,
          situacaoPrisional: parte.situacaoPrisional,
          unidadePrisional: parte.unidadePrisional ?? '',
          cargo: parte.cargo ?? '',
          comarca: parte.comarca ?? '',
          observacoes: parte.observacoes ?? '',
        }
      : {
          tipo: 'cliente',
          email: '',
        },
  })

  const tipoWatched = watch('tipo')
  const situacaoWatched = watch('situacaoPrisional')
  const cpfWatched = watch('cpf')

  useEffect(() => {
    const raw = cpfWatched?.replace(/\D/g, '') ?? ''
    if (raw.length === 11) {
      const found = partesMock.find(
        (p) => p.cpf.replace(/\D/g, '') === raw && p.id !== parte?.id,
      )
      setCpfDuplicate(found?.nome ?? null)
    } else {
      setCpfDuplicate(null)
    }
  }, [cpfWatched, parte?.id])

  useEffect(() => {
    if (!open) {
      reset()
      setCpfDuplicate(null)
    }
  }, [open, reset])

  function onSubmit(_data: FormData) {
    // Mock: just close the drawer
    onOpenChange(false)
  }

  function handleDelete() {
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-40 flex w-full max-w-xl flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
            <div>
              <Dialog.Title className="text-base font-semibold text-zinc-50">
                {mode === 'edit' ? 'Editar parte' : 'Nova parte'}
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-xs text-zinc-500">
                {mode === 'edit'
                  ? 'Atualize os dados da parte cadastrada'
                  : 'Preencha os dados para cadastrar uma nova parte'}
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

          {/* Body — scrollable */}
          <form
            id="nova-parte-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 space-y-5 overflow-y-auto px-6 py-5"
          >
            {/* Tipo */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                Tipo *
              </label>
              <Controller
                control={control}
                name="tipo"
                render={({ field }) => (
                  <Select.Root<TipoParte>
                    value={field.value}
                    onValueChange={(v) => { if (v) field.onChange(v) }}
                  >
                    <Select.Trigger className="flex w-full items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-50 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30">
                      <Select.Value placeholder="Selecione o tipo">
                        {field.value && <BadgeTipoParte tipo={field.value as TipoParte} />}
                      </Select.Value>
                      <Select.Icon>
                        <ChevronDown className="size-4 text-zinc-500" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Positioner>
                        <Select.Popup className="z-50 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 py-1 shadow-xl">
                          <Select.List>
                            {tipoOptions.map((opt) => (
                              <Select.Item
                                key={opt.value}
                                value={opt.value}
                                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-zinc-300 outline-none transition-colors hover:bg-zinc-700 data-[highlighted]:bg-zinc-700"
                              >
                                <Select.ItemIndicator className="flex size-4 items-center justify-center">
                                  <Check className="size-3 text-indigo-400" />
                                </Select.ItemIndicator>
                                <Select.ItemText>
                                  <BadgeTipoParte tipo={opt.value} />
                                </Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.List>
                        </Select.Popup>
                      </Select.Positioner>
                    </Select.Portal>
                  </Select.Root>
                )}
              />
              {errors.tipo && (
                <p className="text-xs text-red-400">{errors.tipo.message}</p>
              )}
            </div>

            {/* Nome */}
            <div className="space-y-1.5">
              <label htmlFor="nome" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                Nome completo *
              </label>
              <input
                id="nome"
                {...register('nome')}
                placeholder="Nome da parte"
                className={inputClass}
                aria-invalid={!!errors.nome}
              />
              {errors.nome && (
                <p className="text-xs text-red-400">{errors.nome.message}</p>
              )}
            </div>

            {/* CPF + RG row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="cpf" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  CPF *
                </label>
                <input
                  id="cpf"
                  {...register('cpf')}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className={inputClass}
                  aria-invalid={!!errors.cpf}
                  onChange={(e) => {
                    const masked = maskCPF(e.target.value)
                    setValue('cpf', masked, { shouldValidate: true })
                  }}
                />
                {errors.cpf && (
                  <p className="text-xs text-red-400">{errors.cpf.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="rg" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  RG
                </label>
                <input
                  id="rg"
                  {...register('rg')}
                  placeholder="00.000.000-0"
                  className={inputClass}
                />
              </div>
            </div>

            {/* CPF duplicate warning */}
            {cpfDuplicate && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-800/50 bg-amber-950/50 px-3 py-2.5 text-sm text-amber-400">
                <AlertTriangle className="size-4 shrink-0" />
                <span>
                  Atenção: CPF já cadastrado para{' '}
                  <strong className="font-semibold">{cpfDuplicate}</strong>
                </span>
              </div>
            )}

            {/* Telefone + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="telefone" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  Telefone *
                </label>
                <input
                  id="telefone"
                  {...register('telefone')}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  className={inputClass}
                  aria-invalid={!!errors.telefone}
                  onChange={(e) => {
                    const masked = maskPhone(e.target.value)
                    setValue('telefone', masked, { shouldValidate: true })
                  }}
                />
                {errors.telefone && (
                  <p className="text-xs text-red-400">{errors.telefone.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="email@exemplo.com"
                  className={inputClass}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Data de nascimento + Naturalidade */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="dataNascimento" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  Data de nascimento
                </label>
                <input
                  id="dataNascimento"
                  type="date"
                  {...register('dataNascimento')}
                  className={cn(inputClass, 'text-zinc-300')}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="naturalidade" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  Naturalidade
                </label>
                <input
                  id="naturalidade"
                  {...register('naturalidade')}
                  placeholder="Cidade - UF"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Filiação */}
            <div className="space-y-1.5">
              <label htmlFor="filiacao" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                Filiação
              </label>
              <input
                id="filiacao"
                {...register('filiacao')}
                placeholder="Nome dos pais"
                className={inputClass}
              />
            </div>

            {/* Profissão */}
            <div className="space-y-1.5">
              <label htmlFor="profissao" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                Profissão
              </label>
              <input
                id="profissao"
                {...register('profissao')}
                placeholder="Ex: Comerciante, Servidor público..."
                className={inputClass}
              />
            </div>

            {/* Endereço */}
            <div className="space-y-1.5">
              <label htmlFor="endereco" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                Endereço
              </label>
              <input
                id="endereco"
                {...register('endereco')}
                placeholder="Rua, número, bairro, cidade - UF, CEP"
                className={inputClass}
              />
            </div>

            {/* ── Réu-specific fields ── */}
            {tipoWatched === 'reu' && (
              <div className="space-y-4 rounded-xl border border-red-900/40 bg-red-950/20 p-4">
                <p className="text-xs font-medium uppercase tracking-widest text-red-400">
                  Informações do réu
                </p>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    Situação Prisional *
                  </label>
                  <div className="flex gap-3">
                    {situacaoOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-300 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-950 has-[:checked]:text-indigo-300"
                      >
                        <input
                          type="radio"
                          {...register('situacaoPrisional')}
                          value={opt.value}
                          className="sr-only"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  {errors.situacaoPrisional && (
                    <p className="text-xs text-red-400">
                      {errors.situacaoPrisional.message}
                    </p>
                  )}
                </div>

                {situacaoWatched === 'preso' && (
                  <div className="space-y-1.5">
                    <label htmlFor="unidadePrisional" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Unidade Prisional
                    </label>
                    <input
                      id="unidadePrisional"
                      {...register('unidadePrisional')}
                      placeholder="Nome da penitenciária ou delegacia"
                      className={inputClass}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── Autoridade-specific fields ── */}
            {tipoWatched === 'autoridade' && (
              <div className="space-y-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4">
                <p className="text-xs font-medium uppercase tracking-widest text-emerald-400">
                  Informações da autoridade
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="cargo" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Cargo
                    </label>
                    <input
                      id="cargo"
                      {...register('cargo')}
                      placeholder="Ex: Delegado, Promotor..."
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="comarca" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      Comarca / Lotação
                    </label>
                    <input
                      id="comarca"
                      {...register('comarca')}
                      placeholder="Ex: 1ª Vara Criminal de SP"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Observações */}
            <div className="space-y-1.5">
              <label htmlFor="observacoes" className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                Observações
              </label>
              <textarea
                id="observacoes"
                {...register('observacoes')}
                rows={3}
                placeholder="Notas internas sobre esta parte..."
                className={cn(inputClass, 'resize-none')}
              />
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-4">
            <div>
              {mode === 'edit' && <DeleteConfirmDialog onConfirm={handleDelete} />}
            </div>
            <div className="flex gap-2">
              <Dialog.Close
                render={
                  <Button variant="ghost" size="sm">
                    Cancelar
                  </Button>
                }
              />
              <Button
                type="submit"
                form="nova-parte-form"
                size="sm"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white hover:bg-indigo-500"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
