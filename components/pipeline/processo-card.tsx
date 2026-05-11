'use client'

import { useEffect, useRef, useState } from 'react'
import { Lock, LockKeyhole, MapPin, Calendar, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { FASE_ACCENT } from '@/lib/data/pipeline'
import { TIPO_META } from '@/types/agenda'
import type { Processo } from '@/types/processos'
import type { Criticidade, Evento } from '@/types/agenda'

interface ProcessoCardProps {
  processo: Processo
  proximoEvento: { evento: Evento; criticidade: Criticidade } | null
  isDragging?: boolean
  onClick?: () => void
  onEditar?: (processo: Processo) => void
  onExcluir?: (processo: Processo) => void
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  const meaningful = parts.filter((p) => !p.endsWith('.'))
  if (meaningful.length >= 2)
    return (meaningful[0][0] + meaningful[meaningful.length - 1][0]).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const CRITICIDADE_DATE_BADGE: Record<Criticidade, string> = {
  futuro: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  proxima: 'bg-amber-950/70 text-amber-400 border-amber-900/50',
  critica: 'bg-red-950/70 text-red-400 border-red-900/50',
  hoje: 'bg-red-900/80 text-red-300 border-red-800/60 animate-pulse',
  perdido: 'bg-zinc-900 text-zinc-600 border-zinc-800 line-through',
  concluido: 'bg-zinc-900 text-zinc-600 border-zinc-800',
}

// ─── Kebab menu ───────────────────────────────────────────────────────────────

interface KebabMenuProps {
  onEditar: () => void
  onExcluir: () => void
}

function KebabMenu({ onEditar, onExcluir }: KebabMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        aria-label="Opções do processo"
        aria-expanded={open}
        className={cn(
          'flex size-6 items-center justify-center rounded-md text-zinc-600 transition-colors',
          'hover:bg-zinc-700 hover:text-zinc-300',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500',
          open && 'bg-zinc-700 text-zinc-300',
        )}
      >
        <MoreHorizontal className="size-3.5" />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            'absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 shadow-xl shadow-black/50',
            'animate-in fade-in-0 zoom-in-95 duration-100',
          )}
        >
          <button
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
              onEditar()
            }}
            className={cn(
              'flex w-full items-center gap-2.5 px-3 py-2 text-xs text-zinc-300',
              'transition-colors hover:bg-zinc-700 hover:text-zinc-50',
              'focus-visible:bg-zinc-700 focus-visible:outline-none',
            )}
          >
            <Pencil className="size-3.5 text-zinc-500" aria-hidden="true" />
            Editar processo
          </button>
          <div className="mx-2 h-px bg-zinc-700" />
          <button
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
              onExcluir()
            }}
            className={cn(
              'flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-400',
              'transition-colors hover:bg-red-950/40 hover:text-red-300',
              'focus-visible:bg-red-950/40 focus-visible:outline-none',
            )}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Excluir processo
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function ProcessoCard({
  processo,
  proximoEvento,
  isDragging = false,
  onClick,
  onEditar,
  onExcluir,
}: ProcessoCardProps) {
  const accent = FASE_ACCENT[processo.faseAtual]
  const cliente = processo.partes.find((p) => p.papel === 'cliente')
  const reu = processo.partes.find((p) => p.papel === 'reu')
  const tipoPrincipal = processo.tiposPenais.find((t) => t.principal) ?? processo.tiposPenais[0]

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.()
      }}
      className={cn(
        'group relative flex cursor-grab flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-150',
        'hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40',
        isDragging &&
          'rotate-1 scale-105 opacity-90 shadow-2xl shadow-black/60 ring-1 ring-inset ring-indigo-500/50',
      )}
    >
      {/* Left accent strip */}
      <div className={cn('absolute inset-y-0 left-0 w-[3px]', accent.strip)} />

      <div className="flex flex-col gap-2.5 px-3 pb-3 pl-4 pt-3">
        {/* Row 1: Alcunha + sigilo + kebab */}
        <div className="flex items-start justify-between gap-1.5">
          <span className="font-display text-sm font-semibold leading-snug text-zinc-50">
            {processo.alcunha}
          </span>
          <div className="mt-0.5 flex shrink-0 items-center gap-1">
            {processo.sigilo === 'restrito' && (
              <Lock className="size-3.5 text-amber-400" aria-label="Restrito" />
            )}
            {processo.sigilo === 'segredo_de_justica' && (
              <LockKeyhole className="size-3.5 text-red-400" aria-label="Segredo de Justiça" />
            )}
            {/* Kebab menu — only visible on hover or when open */}
            <div
              className={cn(
                'transition-opacity',
                'opacity-0 group-hover:opacity-100',
              )}
            >
              <KebabMenu
                onEditar={() => {
                  onEditar?.(processo)
                  console.log('[Pipeline] Editar processo:', processo.id)
                }}
                onExcluir={() => {
                  onExcluir?.(processo)
                  console.log('[Pipeline] Excluir processo:', processo.id)
                }}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Tipo penal */}
        {tipoPrincipal && (
          <div className="flex items-baseline gap-1.5">
            <span className={cn('font-display text-sm font-semibold', accent.tipoPenalText)}>
              {tipoPrincipal.artigo}
            </span>
            <span className="truncate text-xs text-zinc-500">{tipoPrincipal.descricao}</span>
          </div>
        )}

        {/* Row 3: Cliente · Réu */}
        <div className="flex items-center gap-1 text-xs">
          {cliente ? (
            <span className="truncate text-zinc-400">{cliente.nome}</span>
          ) : (
            <span className="text-zinc-600">Sem cliente</span>
          )}
          {reu && reu.parteId !== cliente?.parteId && (
            <>
              <span className="shrink-0 text-zinc-700">·</span>
              <span className="truncate text-zinc-500">{reu.nome}</span>
            </>
          )}
        </div>

        {/* Row 4: Comarca · Vara */}
        <div className="flex items-center gap-1 text-xs text-zinc-600">
          <MapPin className="size-3 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {processo.comarca} · {processo.vara}
          </span>
        </div>

        {/* Row 5: Date badge + Avatar */}
        <div className="flex items-center justify-between gap-2">
          {proximoEvento ? (
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium',
                CRITICIDADE_DATE_BADGE[proximoEvento.criticidade],
              )}
            >
              <Calendar className="size-3 shrink-0" aria-hidden="true" />
              <span>
                {format(
                  parseISO(proximoEvento.evento.dataFim ?? proximoEvento.evento.data),
                  'd MMM',
                  { locale: ptBR },
                )}
              </span>
              <span className="opacity-60">
                · {TIPO_META[proximoEvento.evento.tipo].label}
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-zinc-700">Sem eventos</span>
          )}

          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-300 ring-1 ring-zinc-700"
            title={processo.responsavelInterno}
            aria-label={`Responsável: ${processo.responsavelInterno}`}
          >
            {getInitials(processo.responsavelInterno)}
          </div>
        </div>
      </div>
    </div>
  )
}
