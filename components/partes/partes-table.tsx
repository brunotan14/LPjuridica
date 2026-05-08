'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Pencil,
  Users,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { BadgeTipoParte } from '@/components/partes/badge-tipo-parte'
import { NovaParteDrawer } from '@/components/partes/nova-parte-drawer'
import type { Parte, TipoParte, SituacaoPrisional } from '@/types/partes'

const ITEMS_PER_PAGE = 8

const tipoTabs: { value: 'todos' | TipoParte; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'cliente', label: 'Clientes' },
  { value: 'reu', label: 'Réus' },
  { value: 'vitima', label: 'Vítimas' },
  { value: 'testemunha', label: 'Testemunhas' },
]

const situacaoPrisionalOptions: { value: 'todos' | SituacaoPrisional; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'preso', label: 'Preso' },
  { value: 'solto', label: 'Solto' },
  { value: 'monitorado', label: 'Monitorado' },
]

function countByTipo(partes: Parte[], tipo: TipoParte): number {
  return partes.filter((p) => p.tipo === tipo).length
}

function BadgeSituacaoPrisional({ situacao }: { situacao: SituacaoPrisional }) {
  const config = {
    preso: { label: 'Preso', className: 'bg-red-950 text-red-400 border border-red-900' },
    solto: { label: 'Solto', className: 'bg-emerald-950 text-emerald-400 border border-emerald-900' },
    monitorado: {
      label: 'Monitorado',
      className: 'bg-amber-950 text-amber-400 border border-amber-900',
    },
  }[situacao]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        config.className,
      )}
    >
      {config.label}
    </span>
  )
}

function BadgeStatus({ status }: { status: Parte['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        status === 'ativo'
          ? 'border border-emerald-900 bg-emerald-950 text-emerald-400'
          : 'border border-zinc-700 bg-zinc-800 text-zinc-500',
      )}
    >
      {status === 'ativo' ? 'Ativo' : 'Arquivado'}
    </span>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-zinc-800">
        <Users className="size-6 text-zinc-600" />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-400">{message}</p>
      <p className="mt-1 text-xs text-zinc-600">
        Tente ajustar os filtros ou cadastre uma nova parte.
      </p>
    </div>
  )
}

function hasMultipleRoles(parte: Parte): boolean {
  const papeis = new Set(parte.processosVinculados.map((p) => p.papel))
  return papeis.size > 1
}

interface PartesTableProps {
  partes: Parte[]
}

export function PartesTable({ partes }: PartesTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingParte, setEditingParte] = useState<Parte | undefined>(undefined)
  const [search, setSearch] = useState('')

  const activeTab = (searchParams.get('tab') ?? 'todos') as 'todos' | TipoParte
  const situacaoFilter = (searchParams.get('situacao') ?? 'todos') as
    | 'todos'
    | SituacaoPrisional
  const page = parseInt(searchParams.get('page') ?? '1', 10)

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, value)
      if (key !== 'page') params.set('page', '1')
      startTransition(() => router.push(`${pathname}?${params.toString()}`))
    },
    [searchParams, pathname, router],
  )

  // Filter logic
  const normalizeForSearch = (s: string) => s.replace(/\D/g, '').toLowerCase()

  const filtered = partes.filter((p) => {
    // Tab filter
    if (activeTab !== 'todos' && p.tipo !== activeTab) return false

    // Situação filter (only for reu tab)
    if (activeTab === 'reu' && situacaoFilter !== 'todos') {
      if (p.situacaoPrisional !== situacaoFilter) return false
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      const cpfMatch = normalizeForSearch(p.cpf).includes(normalizeForSearch(q))
      const nameMatch = p.nome.toLowerCase().includes(q)
      return nameMatch || cpfMatch
    }

    return true
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function handleEdit(parte: Parte) {
    setEditingParte(parte)
    setDrawerOpen(true)
  }

  function handleNewParte() {
    setEditingParte(undefined)
    setDrawerOpen(true)
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-50">Partes</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Clientes, réus, vítimas, testemunhas e autoridades
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleNewParte}
          className="bg-indigo-600 text-white hover:bg-indigo-500"
        >
          + Nova Parte
        </Button>
      </div>

      {/* Main card */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-zinc-800 px-4">
          {tipoTabs.map((tab) => {
            const count =
              tab.value === 'todos'
                ? partes.length
                : countByTipo(partes, tab.value as TipoParte)
            const isActive = activeTab === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setParam('tab', tab.value)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-indigo-500 text-zinc-50'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300',
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-xs',
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-zinc-800 text-zinc-600',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search + situação filter */}
        <div className="flex flex-col gap-2 border-b border-zinc-800 px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-9 pr-3 text-sm text-zinc-50 placeholder:text-zinc-600 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {activeTab === 'reu' && (
            <div className="flex flex-wrap gap-1">
              {situacaoPrisionalOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setParam('situacao', opt.value)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                    situacaoFilter === opt.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        {paginated.length === 0 ? (
          <EmptyState
            message={
              search
                ? `Nenhuma parte encontrada para "${search}"`
                : 'Nenhuma parte nesta categoria'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    Nome / CPF
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    Telefone
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    Processos
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    Situação
                  </th>
                  <th className="px-4 py-3 text-right text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((parte) => (
                  <tr
                    key={parte.id}
                    className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/40"
                  >
                    {/* Nome / CPF */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <Link
                            href={`/partes/${parte.id}`}
                            className="font-medium text-zinc-50 transition-colors hover:text-indigo-400"
                          >
                            {parte.nome}
                          </Link>
                          <p className="text-xs text-zinc-500">{parte.cpf}</p>
                        </div>
                        {hasMultipleRoles(parte) && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                            <Users className="size-2.5" />
                            Múltiplos papéis
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <BadgeTipoParte tipo={parte.tipo} />
                        {parte.tipo === 'reu' && parte.situacaoPrisional === 'preso' && (
                          <div className="group relative inline-flex">
                            <span className="flex items-center gap-1 text-xs text-red-400">
                              <AlertTriangle className="size-3" />
                              Preso
                            </span>
                            {parte.unidadePrisional && (
                              <span className="pointer-events-none absolute bottom-full left-0 mb-1 hidden whitespace-nowrap rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300 group-hover:block">
                                {parte.unidadePrisional}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Telefone */}
                    <td className="px-4 py-3 text-sm text-zinc-300">{parte.telefone}</td>

                    {/* Processos */}
                    <td className="px-4 py-3">
                      {parte.processosVinculados.length > 0 ? (
                        <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                          {parte.processosVinculados.length}{' '}
                          {parte.processosVinculados.length === 1 ? 'processo' : 'processos'}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>

                    {/* Situação */}
                    <td className="px-4 py-3">
                      {parte.tipo === 'reu' && parte.situacaoPrisional ? (
                        <BadgeSituacaoPrisional situacao={parte.situacaoPrisional} />
                      ) : (
                        <BadgeStatus status={parte.status} />
                      )}
                    </td>

                    {/* Ações */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(parte)}
                          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                          title="Editar"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <Link
                          href={`/partes/${parte.id}`}
                          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                          title="Ver detalhes"
                        >
                          <ExternalLink className="size-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3">
            <p className="text-xs text-zinc-500">
              Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} partes
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
      <NovaParteDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        parte={editingParte}
        mode={editingParte ? 'edit' : 'create'}
      />
    </>
  )
}
