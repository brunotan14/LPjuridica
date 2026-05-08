'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { ExternalLink, FileText, Users, Save, X, Pencil } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { BadgeTipoParte } from '@/components/partes/badge-tipo-parte'
import type { Parte } from '@/types/partes'

const inputClass =
  'w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-600 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed'

function formatDate(isoDate: string | undefined): string {
  if (!isoDate) return '—'
  try {
    return format(new Date(isoDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  } catch {
    return isoDate
  }
}

// ─── Schema for editing ───────────────────────────────────────────────────────
const editSchema = z.object({
  nome: z.string().min(3, 'Nome obrigatório'),
  telefone: z.string().min(10, 'Telefone obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  rg: z.string().optional(),
  dataNascimento: z.string().optional(),
  filiacao: z.string().optional(),
  naturalidade: z.string().optional(),
  profissao: z.string().optional(),
  endereco: z.string().optional(),
  status: z.enum(['ativo', 'arquivado']),
  situacaoPrisional: z.enum(['preso', 'solto', 'monitorado']).optional(),
  unidadePrisional: z.string().optional(),
})

type EditFormData = z.infer<typeof editSchema>

// ─── Dados Pessoais Tab ───────────────────────────────────────────────────────
function DadosPessoaisTab({ parte }: { parte: Parte }) {
  const [editing, setEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      nome: parte.nome,
      telefone: parte.telefone,
      email: parte.email ?? '',
      rg: parte.rg ?? '',
      dataNascimento: parte.dataNascimento ?? '',
      filiacao: parte.filiacao ?? '',
      naturalidade: parte.naturalidade ?? '',
      profissao: parte.profissao ?? '',
      endereco: parte.endereco ?? '',
      status: parte.status,
      situacaoPrisional: parte.situacaoPrisional,
      unidadePrisional: parte.unidadePrisional ?? '',
    },
  })

  const statusWatched = watch('status')
  const situacaoWatched = watch('situacaoPrisional')

  function onSubmit(_data: EditFormData) {
    // Mock: just exit edit mode
    setEditing(false)
  }

  function handleCancel() {
    reset()
    setEditing(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Edit toggle */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-400">Informações cadastrais</p>
        {editing ? (
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
              <X className="size-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/80"
            >
              <Save className="size-4" />
              Salvar
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
          >
            <Pencil className="size-4" />
            Editar
          </Button>
        )}
      </div>

      <div className="space-y-5">
        {/* Row: Nome + CPF */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Nome completo
            </label>
            <input
              {...register('nome')}
              disabled={!editing}
              className={inputClass}
              aria-invalid={!!errors.nome}
            />
            {errors.nome && (
              <p className="text-xs text-red-400">{errors.nome.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              CPF
            </label>
            <input
              value={parte.cpf}
              disabled
              className={inputClass}
              readOnly
            />
          </div>
        </div>

        {/* Row: RG + Data de nascimento */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              RG
            </label>
            <input
              {...register('rg')}
              disabled={!editing}
              placeholder="—"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Data de nascimento
            </label>
            {editing ? (
              <input
                type="date"
                {...register('dataNascimento')}
                className={cn(inputClass, 'text-zinc-300')}
              />
            ) : (
              <input
                value={parte.dataNascimento ? formatDate(parte.dataNascimento) : ''}
                disabled
                placeholder="—"
                className={inputClass}
                readOnly
              />
            )}
          </div>
        </div>

        {/* Filiação */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
            Filiação
          </label>
          <input
            {...register('filiacao')}
            disabled={!editing}
            placeholder="—"
            className={inputClass}
          />
        </div>

        {/* Row: Naturalidade + Profissão */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Naturalidade
            </label>
            <input
              {...register('naturalidade')}
              disabled={!editing}
              placeholder="—"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Profissão
            </label>
            <input
              {...register('profissao')}
              disabled={!editing}
              placeholder="—"
              className={inputClass}
            />
          </div>
        </div>

        {/* Row: Telefone + Email */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Telefone
            </label>
            <input
              {...register('telefone')}
              disabled={!editing}
              className={inputClass}
              aria-invalid={!!errors.telefone}
            />
            {errors.telefone && (
              <p className="text-xs text-red-400">{errors.telefone.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              E-mail
            </label>
            <input
              type="email"
              {...register('email')}
              disabled={!editing}
              placeholder="—"
              className={inputClass}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
            Endereço
          </label>
          <input
            {...register('endereco')}
            disabled={!editing}
            placeholder="—"
            className={inputClass}
          />
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
            Status
          </label>
          {editing ? (
            <div className="flex gap-2">
              {([
                { value: 'ativo', label: 'Ativo', active: 'border-emerald-500 bg-emerald-950 text-emerald-300', inactive: 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600' },
                { value: 'arquivado', label: 'Arquivado', active: 'border-zinc-500 bg-zinc-800 text-zinc-300', inactive: 'border-zinc-700 bg-zinc-800 text-zinc-500 hover:border-zinc-600' },
              ] as const).map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                    statusWatched === opt.value ? opt.active : opt.inactive,
                  )}
                >
                  <input
                    type="radio"
                    {...register('status')}
                    value={opt.value}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          ) : (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium',
                parte.status === 'ativo'
                  ? 'border border-emerald-900 bg-emerald-950 text-emerald-400'
                  : 'border border-zinc-700 bg-zinc-800 text-zinc-500',
              )}
            >
              {parte.status === 'ativo' ? 'Ativo' : 'Arquivado'}
            </span>
          )}
        </div>

        {/* Situação prisional — clientes e réus */}
        {(parte.tipo === 'cliente' || parte.tipo === 'reu') && (
          <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-4 space-y-4">
            <p className="text-xs font-medium uppercase tracking-widest text-red-400">
              Situação Prisional
            </p>
            {editing ? (
              <div className="flex gap-3">
                {(['preso', 'solto', 'monitorado'] as const).map((s) => (
                  <label
                    key={s}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-300 transition-colors has-[:checked]:border-primary has-[:checked]:bg-[#1a1408] has-[:checked]:text-[#e8d09a]"
                  >
                    <input
                      type="radio"
                      {...register('situacaoPrisional')}
                      value={s}
                      className="sr-only"
                    />
                    {{ preso: 'Preso', solto: 'Solto', monitorado: 'Monitorado' }[s]}
                  </label>
                ))}
              </div>
            ) : (
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium',
                  parte.situacaoPrisional === 'preso'
                    ? 'bg-red-950 text-red-400 border border-red-900'
                    : parte.situacaoPrisional === 'monitorado'
                      ? 'bg-amber-950 text-amber-400 border border-amber-900'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-900',
                )}
              >
                {{ preso: 'Preso', solto: 'Solto', monitorado: 'Monitorado' }[
                  parte.situacaoPrisional ?? 'solto'
                ]}
              </span>
            )}

            {(editing ? situacaoWatched === 'preso' : parte.situacaoPrisional === 'preso') && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  Unidade Prisional
                </label>
                <input
                  {...register('unidadePrisional')}
                  disabled={!editing}
                  placeholder="—"
                  className={inputClass}
                />
              </div>
            )}
          </div>
        )}

      </div>
    </form>
  )
}

// ─── Processos Tab ────────────────────────────────────────────────────────────
function ProcessosTab({ parte }: { parte: Parte }) {
  if (parte.processosVinculados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-zinc-800">
          <FileText className="size-6 text-zinc-600" />
        </div>
        <p className="mt-4 text-sm font-medium text-zinc-400">Nenhum processo vinculado</p>
        <p className="mt-1 text-xs text-zinc-600">
          Esta parte ainda não foi vinculada a nenhum processo.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-800/40">
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Processo
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Papel
            </th>
            <th className="px-4 py-3 text-right text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {parte.processosVinculados.map((proc) => (
            <tr key={proc.id} className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/40">
              <td className="px-4 py-3">
                <p className="font-mono text-sm text-zinc-300">{proc.numero}</p>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                  {proc.papel}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/processos/${proc.id}`}
                  className="inline-flex items-center gap-1 rounded-lg p-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                >
                  <ExternalLink className="size-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Observações Tab ──────────────────────────────────────────────────────────
function ObservacoesTab({ parte }: { parte: Parte }) {
  const [value, setValue] = useState(parte.observacoes ?? '')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    // Mock: just show feedback
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4">
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setSaved(false)
        }}
        rows={8}
        placeholder="Adicione observações internas sobre esta parte..."
        className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-600 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-600">{value.length} caracteres</p>
        <Button
          size="sm"
          onClick={handleSave}
          className={cn(
            'transition-all',
            saved
              ? 'bg-emerald-600 text-white hover:bg-emerald-600'
              : 'bg-primary text-primary-foreground hover:bg-primary/80',
          )}
        >
          {saved ? 'Salvo!' : 'Salvar observação'}
        </Button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'dados', label: 'Dados Pessoais' },
  { id: 'processos', label: 'Processos Vinculados' },
  { id: 'observacoes', label: 'Observações' },
] as const

type TabId = (typeof TABS)[number]['id']

interface ParteDetailTabsProps {
  parte: Parte
}

export function ParteDetailTabs({ parte }: ParteDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dados')

  return (
    <div>
      {/* Tab nav */}
      <div className="flex border-b border-zinc-800">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-colors border-b-2',
              activeTab === tab.id
                ? 'border-primary text-zinc-50'
                : 'border-transparent text-zinc-500 hover:text-zinc-300',
            )}
          >
            {tab.label}
            {tab.id === 'processos' && parte.processosVinculados.length > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">
                {parte.processosVinculados.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'dados' && <DadosPessoaisTab parte={parte} />}
        {activeTab === 'processos' && <ProcessosTab parte={parte} />}
        {activeTab === 'observacoes' && <ObservacoesTab parte={parte} />}
      </div>
    </div>
  )
}

// ─── Multiple Roles Indicator ─────────────────────────────────────────────────
export function MultipleRolesIndicator({ parte }: { parte: Parte }) {
  const papeis = [...new Set(parte.processosVinculados.map((p) => p.papel))]
  if (papeis.length <= 1) return null

  return (
    <div className="group relative inline-flex">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
        <Users className="size-3" />
        Múltiplos papéis
      </span>
      <div className="pointer-events-none absolute left-0 top-full z-10 mt-1 hidden min-w-max rounded-lg border border-zinc-700 bg-zinc-800 p-2 shadow-xl group-hover:block">
        <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
          Papéis
        </p>
        {papeis.map((papel) => (
          <p key={papel} className="text-xs text-zinc-300">
            {papel}
          </p>
        ))}
      </div>
    </div>
  )
}
