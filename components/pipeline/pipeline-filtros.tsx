'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { pipelineMock } from '@/lib/data/pipeline'
import type { PipelineFiltros } from '@/lib/data/pipeline'
import type { NivelSigilo } from '@/types/index'

const RESPONSAVEIS = [
  { nome: 'Dr. Leandro Pedrosa', role: 'Titular' },
  { nome: 'Dr. André Souza', role: 'Associado' },
  { nome: 'Dra. Camila Ferreira', role: 'Associada' },
]
const COMARCAS = ['São Paulo', 'Campinas', 'Santos', 'Guarulhos', 'Sorocaba']

const SIGILO_OPTIONS: { value: NivelSigilo | null; label: string }[] = [
  { value: null, label: 'Todos' },
  { value: 'publico', label: 'Público' },
  { value: 'restrito', label: 'Restrito' },
  { value: 'segredo_de_justica', label: 'Segredo' },
]

// Extract unique principal tipo penal descriptions from full pipeline mock
const TIPOS_PENAIS = Array.from(
  new Set(
    pipelineMock.flatMap((p) =>
      p.tiposPenais.filter((t) => t.principal).map((t) => t.descricao)
    )
  )
).sort()

interface PipelineFiltrosProps {
  filtros: PipelineFiltros
  onChange: (filtros: PipelineFiltros) => void
}

function countActiveFilters(filtros: PipelineFiltros): number {
  return [filtros.responsavel, filtros.comarca, filtros.tipoPenal, filtros.sigilo].filter(
    Boolean
  ).length
}

export function PipelineFiltros({ filtros, onChange }: PipelineFiltrosProps) {
  const [open, setOpen] = useState(false)
  const activeCount = countActiveFilters(filtros)

  function clear() {
    onChange({ responsavel: null, comarca: null, tipoPenal: null, sigilo: null })
  }

  const panel = (
    <div className="flex w-[220px] shrink-0 flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Filtros
        </span>
        {activeCount > 0 && (
          <button
            onClick={clear}
            className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Responsável */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Responsável</span>
          {filtros.responsavel && (
            <button
              onClick={() => onChange({ ...filtros, responsavel: null })}
              aria-label="Remover filtro responsável"
              className="text-zinc-600 transition-colors hover:text-zinc-400"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
        <select
          value={filtros.responsavel ?? ''}
          onChange={(e) =>
            onChange({ ...filtros, responsavel: e.target.value || null })
          }
          className={cn(
            'w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-200',
            'focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
          )}
        >
          <option value="">Todos</option>
          {RESPONSAVEIS.map((r) => (
            <option key={r.nome} value={r.nome}>
              {r.nome} ({r.role})
            </option>
          ))}
        </select>
      </div>

      {/* Comarca */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Comarca</span>
          {filtros.comarca && (
            <button
              onClick={() => onChange({ ...filtros, comarca: null })}
              aria-label="Remover filtro comarca"
              className="text-zinc-600 transition-colors hover:text-zinc-400"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
        <select
          value={filtros.comarca ?? ''}
          onChange={(e) =>
            onChange({ ...filtros, comarca: e.target.value || null })
          }
          className={cn(
            'w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-200',
            'focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
          )}
        >
          <option value="">Todas</option>
          {COMARCAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo Penal */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Tipo penal</span>
          {filtros.tipoPenal && (
            <button
              onClick={() => onChange({ ...filtros, tipoPenal: null })}
              aria-label="Remover filtro tipo penal"
              className="text-zinc-600 transition-colors hover:text-zinc-400"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {TIPOS_PENAIS.map((tipo) => (
            <button
              key={tipo}
              onClick={() =>
                onChange({
                  ...filtros,
                  tipoPenal: filtros.tipoPenal === tipo ? null : tipo,
                })
              }
              className={cn(
                'rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors',
                filtros.tipoPenal === tipo
                  ? 'border-indigo-500/50 bg-indigo-600/20 text-indigo-300'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300',
              )}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      {/* Sigilo */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-zinc-500">Sigilo</span>
        <div className="space-y-1">
          {SIGILO_OPTIONS.map(({ value, label }) => (
            <label
              key={String(value)}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                name="sigilo"
                checked={filtros.sigilo === value}
                onChange={() => onChange({ ...filtros, sigilo: value })}
                className="accent-indigo-500"
              />
              <span
                className={cn(
                  'text-xs',
                  filtros.sigilo === value ? 'text-zinc-200' : 'text-zinc-500',
                )}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Limpar filtros button at bottom */}
      <button
        onClick={clear}
        disabled={activeCount === 0}
        className={cn(
          'mt-auto rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium transition-colors',
          activeCount > 0
            ? 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50'
            : 'cursor-not-allowed text-zinc-700',
        )}
      >
        Limpar filtros
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300',
            'transition-colors hover:bg-zinc-800',
          )}
          aria-expanded={open}
          aria-label="Filtros"
        >
          <SlidersHorizontal className="size-4" />
          <span>Filtros</span>
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-zinc-50">
              {activeCount}
            </span>
          )}
        </button>
        {open && <div className="mt-3">{panel}</div>}
      </div>

      {/* Desktop always visible */}
      <div className="hidden lg:block">{panel}</div>
    </>
  )
}
