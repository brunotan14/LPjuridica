'use client'

import { useState, useCallback, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Pencil,
  Briefcase,
  LockKeyhole,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { BadgeFaseProcessual, FASE_LABELS } from '@/components/processos/badge-fase-processual'
import { BadgeSigilo } from '@/components/processos/badge-sigilo'
import { NovoProcessoDrawer } from '@/components/processos/novo-processo-drawer'
import { partesMock } from '@/lib/data/partes'
import type { Processo } from '@/types/processos'
import type { FaseProcessual, NivelSigilo } from '@/types/index'

const ITEMS_PER_PAGE = 8

const FASES: FaseProcessual[] = [
  'pre_processual',
  'inquerito',
  'denuncia_recebimento',
  'instrucao',
  'memoriais',
  'sentenca',
  'recursos',
  'execucao',
  'arquivado',
]

const sigiloOptions: { value: 'todos' | NivelSigilo; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'publico', label: 'Público' },
  { value: 'restrito', label: 'Restrito' },
  { value: 'segredo_de_justica', label: 'Segredo' },
]

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-zinc-800">
        <Briefcase className="size-6 text-zinc-600" />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-400">{message}</p>
      <p className="mt-1 text-xs text-zinc-600">
        Tente ajustar os filtros ou cadastre um novo processo.
      </p>
    </div>
  )
}

function getClienteNome(processo: Processo): string {
  const cliente = processo.partes.find((p) => p.papel === 'cliente')
  return cliente?.nome ?? '—'
}

function getReuInfo(processo: Processo): { nome: string; preso: boolean } | null {
  const reu = processo.partes.find((p) => p.papel === 'reu')
  if (!reu) return null
  const parte = partesMock.find((p) => p.id === reu.parteId)
  return {
    nome: reu.nome,
    preso: parte?.situacaoPrisional === 'preso',
  }
}

interface ProcessosTableProps {
  processos: Processo[]
}

export function ProcessosTable({ processos }: ProcessosTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [drawerOpen, setDrawerOpen] = useState(() => searchParams.get('novo') === 'true')
  const [editingProcesso, setEditingProcesso] = useState<Processo | undefined>(undefined)
  const [search, setSearch] = useState('')

  const activeTab = (searchParams.get('tab') ?? 'todos') as 'todos' | FaseProcessual
  const sigiloFilter = (searchParams.get('sigilo') ?? 'todos') as 'todos' | NivelSigilo
  const page = parseInt(searchParams.get('page') ?? '1', 10)

  useEffect(() => {
    if (searchParams.get('novo') === 'true') {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('novo')
      const qs = params.toString()
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`)
    }
  }, [searchParams, pathname, router])

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, value)
      if (key !== 'page') params.set('page', '1')
      startTransition(() => router.push(`${pathname}?${params.toString()}`))
    },
    [searchParams, pathname, router],
  )

  const filtered = processos.filter((p) => {
    if (activeTab !== 'todos' && p.faseAtual !== activeTab) return false
    if (sigiloFilter !== 'todos' && p.sigilo !== sigiloFilter) return false

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      const cnjMatch = p.numeroCNJ.toLowerCase().includes(q)
      const alcunhaMatch = p.alcunha.toLowerCase().includes(q)
      const partesMatch = p.partes.some((parte) => parte.nome.toLowerCase().includes(q))
      return cnjMatch || alcunhaMatch || partesMatch
    }

    return true
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function handleEdit(processo: Processo) {
    setEditingProcesso(processo)
    setDrawerOpen(true)
  }

  function handleNewProcesso() {
    setEditingProcesso(undefined)
    setDrawerOpen(true)
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-50">Processos</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            CNJ, fases processuais, sigilo e partes vinculadas
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleNewProcesso}
          className="bg-primary text-primary-foreground hover:bg-primary/80"
        >
          + Novo Processo
        </Button>
      </div>

      {/* Main card */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-zinc-800 px-4">
          {/* Todos tab */}
          <button
            onClick={() => setParam('tab', 'todos')}
            className={cn(
              'flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium transition-colors',
              activeTab === 'todos'
                ? 'border-primary text-zinc-50'
                : 'border-transparent text-zinc-500 hover:text-zinc-300',
            )}
          >
            Todos
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-xs',
                activeTab === 'todos'
                  ? 'bg-primary/20 text-[#e8d09a]'
                  : 'bg-zinc-800 text-zinc-600',
              )}
            >
              {processos.length}
            </span>
          </button>

          {FASES.map((fase) => {
            const count = processos.filter((p) => p.faseAtual === fase).length
            const isActive = activeTab === fase
            return (
              <button
                key={fase}
                onClick={() => setParam('tab', fase)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-primary text-zinc-50'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300',
                )}
              >
                {FASE_LABELS[fase]}
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-xs',
                    isActive
                      ? 'bg-primary/20 text-[#e8d09a]'
                      : 'bg-zinc-800 text-zinc-600',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search + sigilo filter */}
        <div className="flex flex-col gap-2 border-b border-zinc-800 px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              placeholder="Buscar por CNJ, alcunha ou nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-9 pr-3 text-sm text-zinc-50 placeholder:text-zinc-600 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {sigiloOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setParam('sigilo', opt.value)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  sigiloFilter === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {paginated.length === 0 ? (
          <EmptyState
            message={
              search
                ? `Nenhum processo encontrado para "${search}"`
                : 'Nenhum processo nesta categoria'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    CNJ / Alcunha
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    Réu
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    Fase
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    Comarca
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    Sigilo
                  </th>
                  <th className="px-4 py-3 text-right text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((processo) => {
                  const reuInfo = getReuInfo(processo)
                  return (
                    <tr
                      key={processo.id}
                      className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/40"
                    >
                      {/* CNJ / Alcunha */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {processo.sigilo === 'segredo_de_justica' && (
                            <LockKeyhole className="size-3.5 shrink-0 text-red-500" />
                          )}
                          <div>
                            <Link
                              href={`/processos/${processo.id}`}
                              className="font-mono text-sm font-medium text-zinc-50 transition-colors hover:text-primary"
                            >
                              {processo.numeroCNJ}
                            </Link>
                            <p className="text-xs text-zinc-500">{processo.alcunha}</p>
                          </div>
                        </div>
                      </td>

                      {/* Cliente */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-zinc-300">{getClienteNome(processo)}</span>
                      </td>

                      {/* Réu */}
                      <td className="px-4 py-3">
                        {reuInfo ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-zinc-300">{reuInfo.nome}</span>
                            {reuInfo.preso && (
                              <span className="inline-flex items-center gap-1 text-xs text-red-400">
                                <AlertTriangle className="size-3" />
                                Preso
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      {/* Fase */}
                      <td className="px-4 py-3">
                        <BadgeFaseProcessual fase={processo.faseAtual} />
                      </td>

                      {/* Comarca */}
                      <td className="px-4 py-3">
                        <div>
                          <span className="text-sm text-zinc-300">{processo.comarca}</span>
                          <p className="text-xs text-zinc-500">{processo.tribunal}</p>
                        </div>
                      </td>

                      {/* Sigilo */}
                      <td className="px-4 py-3">
                        <BadgeSigilo sigilo={processo.sigilo} />
                      </td>

                      {/* Ações */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(processo)}
                            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                            title="Editar"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <Link
                            href={`/processos/${processo.id}`}
                            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                            title="Ver detalhes"
                          >
                            <ExternalLink className="size-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3">
            <p className="text-xs text-zinc-500">
              Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} processos
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={page <= 1}
                onClick={() => setParam('page', String(page - 1))}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-xs text-zinc-400">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={page >= totalPages}
                onClick={() => setParam('page', String(page + 1))}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      <NovoProcessoDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        processo={editingProcesso}
        mode={editingProcesso ? 'edit' : 'create'}
      />
    </>
  )
}
