'use client'

import { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
} from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { Plus, Scale } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProcessoCard } from '@/components/pipeline/processo-card'
import { FaseColuna } from '@/components/pipeline/fase-coluna'
import { MoverFaseModal } from '@/components/pipeline/mover-fase-modal'
import { ExcluirProcessoModal } from '@/components/pipeline/excluir-processo-modal'
import { PipelineFiltros } from '@/components/pipeline/pipeline-filtros'
import { NovoProcessoDrawer } from '@/components/processos/novo-processo-drawer'
import {
  pipelineMock,
  todosEventos,
  getProcessosPorFase,
  getProximoEvento,
  FASE_ACCENT,
} from '@/lib/data/pipeline'
import { FASE_LABELS } from '@/components/processos/badge-fase-processual'
import type { PipelineFiltros as PipelineFiltrosType } from '@/lib/data/pipeline'
import type { FaseProcessual } from '@/types/index'
import type { Processo } from '@/types/processos'

const FASES_ORDEM: FaseProcessual[] = [
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

// ─── Draggable card wrapper ──────────────────────────────────────────────────

interface DraggableCardProps {
  processo: Processo
  activeId: string | null
  onEditar: (p: Processo) => void
  onExcluir: (p: Processo) => void
}

function DraggableCard({ processo, activeId, onEditar, onExcluir }: DraggableCardProps) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: processo.id,
  })

  const proximoEvento = getProximoEvento(processo.id, todosEventos)

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ opacity: isDragging ? 0.35 : 1 }}
    >
      <ProcessoCard
        processo={processo}
        proximoEvento={proximoEvento}
        isDragging={activeId === processo.id && isDragging}
        onClick={() => console.log('navigate to /processos/' + processo.id)}
        onEditar={onEditar}
        onExcluir={onExcluir}
      />
    </div>
  )
}

// ─── Summary bar (adapted from PipeFlow CRM style) ───────────────────────────

interface SummaryBarProps {
  processosPorFase: Record<FaseProcessual, Processo[]>
  total: number
}

function SummaryBar({ processosPorFase, total }: SummaryBarProps) {
  const uniqueFases = FASES_ORDEM.filter(
    (f) => processosPorFase[f].length > 0,
  ).slice(0, 5)

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-zinc-800/60 pb-3">
      {/* Total */}
      <div className="flex items-center gap-2">
        <Scale className="size-4 text-[#c9a961]" aria-hidden="true" />
        <span className="font-display text-lg font-semibold text-zinc-50 tabular-nums">
          {total}
        </span>
        <span className="text-xs text-zinc-500">
          {total === 1 ? 'processo no pipeline' : 'processos no pipeline'}
        </span>
      </div>

      {/* Per-phase counts (only phases with processes) */}
      <div className="flex flex-wrap items-center gap-2">
        {uniqueFases.map((fase) => {
          const count = processosPorFase[fase].length
          const accent = FASE_ACCENT[fase]
          return (
            <div
              key={fase}
              className="flex items-center gap-1.5 text-xs"
            >
              <span className={cn('font-medium tabular-nums', accent.headerText)}>
                {count}
              </span>
              <span className="text-zinc-600">em {FASE_LABELS[fase]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main shell ──────────────────────────────────────────────────────────────

export function PipelineShell() {
  const [processos, setProcessos] = useState<Processo[]>(pipelineMock)
  const [filtros, setFiltros] = useState<PipelineFiltrosType>({
    responsavel: null,
    comarca: null,
    tipoPenal: null,
    sigilo: null,
  })
  const [activeId, setActiveId] = useState<string | null>(null)
  const [pendingMove, setPendingMove] = useState<{
    processo: Processo
    faseAnterior: FaseProcessual
    novaFase: FaseProcessual
  } | null>(null)
  const [processoEditando, setProcessoEditando] = useState<Processo | null>(null)
  const [processoExcluindo, setProcessoExcluindo] = useState<Processo | null>(null)
  const [novoProcessoOpen, setNovoProcessoOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const processosPorFase = useMemo(
    () => getProcessosPorFase(processos, filtros),
    [processos, filtros],
  )

  const totalFiltrado = useMemo(
    () => FASES_ORDEM.reduce((acc, f) => acc + processosPorFase[f].length, 0),
    [processosPorFase],
  )

  const activeProcesso = useMemo(
    () => (activeId ? processos.find((p) => p.id === activeId) ?? null : null),
    [activeId, processos],
  )

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(String(active.id))
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over) return

    const novaFase = String(over.id) as FaseProcessual
    const processoId = String(active.id)
    const processo = processos.find((p) => p.id === processoId)
    if (!processo) return

    const faseAnterior = processo.faseAtual
    if (faseAnterior === novaFase) return

    setPendingMove({ processo, faseAnterior, novaFase })
  }

  function handleConfirmarMudanca(observacao: string) {
    if (!pendingMove) return
    const { processo, faseAnterior, novaFase } = pendingMove
    console.log('[Pipeline] Mudança confirmada:', {
      processoId: processo.id,
      alcunha: processo.alcunha,
      faseAnterior,
      novaFase,
      observacao,
      timestamp: new Date().toISOString(),
    })
    setProcessos((prev) =>
      prev.map((p) => (p.id === processo.id ? { ...p, faseAtual: novaFase } : p)),
    )
    setPendingMove(null)
  }

  function handleCancelarMudanca() {
    setPendingMove(null)
  }

  function handleSalvarEdicao(updates: Partial<Processo>) {
    if (!processoEditando) return
    setProcessos((prev) =>
      prev.map((p) => (p.id === processoEditando.id ? { ...p, ...updates } : p)),
    )
    setProcessoEditando(null)
  }

  function handleConfirmarExclusao(processo: Processo) {
    setProcessos((prev) => prev.filter((p) => p.id !== processo.id))
    setProcessoExcluindo(null)
  }

  function handleCriarProcesso(updates: Partial<Processo>) {
    const novoProcesso: Processo = {
      id: `proc-tmp-${Date.now()}`,
      numeroCNJ: updates.numeroCNJ ?? '',
      numeroInterno: updates.numeroInterno,
      alcunha: updates.alcunha ?? 'Novo Processo',
      tribunal: updates.tribunal ?? '',
      comarca: updates.comarca ?? '',
      vara: updates.vara ?? '',
      juiz: updates.juiz,
      faseAtual: updates.faseAtual ?? 'pre_processual',
      sigilo: updates.sigilo ?? 'publico',
      responsavelInterno: updates.responsavelInterno ?? 'Dr. Leandro Pedrosa',
      tiposPenais: updates.tiposPenais ?? [],
      partes: updates.partes ?? [],
      observacoes: updates.observacoes,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    }
    setProcessos((prev) => [...prev, novoProcesso])
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* ── Top row: summary + action ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <SummaryBar processosPorFase={processosPorFase} total={totalFiltrado} />

        <button
          className={cn(
            'flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground',
            'transition-colors hover:bg-primary/90',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
          )}
          onClick={() => setNovoProcessoOpen(true)}
        >
          <Plus className="size-4" aria-hidden="true" />
          Novo Processo
        </button>
      </div>

      {/* ── Board + filters ───────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 gap-4">
        {/* Filter panel */}
        <PipelineFiltros filtros={filtros} onChange={setFiltros} />

        {/* Kanban board */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div
              className={cn(
                'flex h-full gap-3 overflow-x-auto pb-4',
                '[&::-webkit-scrollbar]:h-1.5',
                '[&::-webkit-scrollbar-track]:bg-transparent',
                '[&::-webkit-scrollbar-thumb]:rounded-full',
                '[&::-webkit-scrollbar-thumb]:bg-zinc-700',
                '[&::-webkit-scrollbar-thumb:hover]:bg-zinc-600',
              )}
            >
              {FASES_ORDEM.map((fase) => {
                const faseProcesos = processosPorFase[fase]
                return (
                  <FaseColuna key={fase} fase={fase} processos={faseProcesos}>
                    {faseProcesos.map((p) => (
                      <DraggableCard
                        key={p.id}
                        processo={p}
                        activeId={activeId}
                        onEditar={setProcessoEditando}
                        onExcluir={setProcessoExcluindo}
                      />
                    ))}
                  </FaseColuna>
                )
              })}
            </div>

            {/* Drag overlay — follows pointer */}
            <DragOverlay dropAnimation={null}>
              {activeProcesso ? (
                <ProcessoCard
                  processo={activeProcesso}
                  proximoEvento={getProximoEvento(activeProcesso.id, todosEventos)}
                  isDragging
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Modal: mover fase */}
      <MoverFaseModal
        open={pendingMove !== null}
        onClose={handleCancelarMudanca}
        processo={pendingMove?.processo ?? null}
        faseAtual={pendingMove?.faseAnterior ?? null}
        novaFase={pendingMove?.novaFase ?? null}
        onConfirmar={handleConfirmarMudanca}
      />

      {/* Drawer: novo processo */}
      <NovoProcessoDrawer
        open={novoProcessoOpen}
        onOpenChange={setNovoProcessoOpen}
        mode="create"
        onSave={handleCriarProcesso}
      />

      {/* Drawer: editar processo */}
      <NovoProcessoDrawer
        open={processoEditando !== null}
        onOpenChange={(open) => { if (!open) setProcessoEditando(null) }}
        processo={processoEditando ?? undefined}
        mode="edit"
        onSave={handleSalvarEdicao}
      />

      {/* Modal: confirmar exclusão */}
      <ExcluirProcessoModal
        processo={processoExcluindo}
        onClose={() => setProcessoExcluindo(null)}
        onConfirmar={handleConfirmarExclusao}
      />
    </div>
  )
}
