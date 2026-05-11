'use client'

import { useState } from 'react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Scale,
  FileText,
  MessageCircle,
  PenLine,
  Gavel,
  Paperclip,
  Lock,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import type { Andamento, TipoAndamento } from '@/types/andamentos'

// ─── Configuração por tipo ────────────────────────────────────────────────────

const TIPO_CONFIG: Record<
  TipoAndamento,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  andamento_oficial: {
    label: 'Andamento oficial',
    icon: Scale,
    color: 'text-indigo-400',
    bg: 'bg-indigo-950 border-indigo-800',
  },
  peca_produzida: {
    label: 'Peça produzida',
    icon: FileText,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950 border-emerald-800',
  },
  comunicacao_cliente: {
    label: 'Comunicação com cliente',
    icon: MessageCircle,
    color: 'text-sky-400',
    bg: 'bg-sky-950 border-sky-800',
  },
  anotacao_interna: {
    label: 'Anotação interna',
    icon: PenLine,
    color: 'text-amber-400',
    bg: 'bg-amber-950 border-amber-800',
  },
  evento_audiencia: {
    label: 'Audiência',
    icon: Gavel,
    color: 'text-purple-400',
    bg: 'bg-purple-950 border-purple-800',
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDataRelativa(iso: string) {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: ptBR })
  } catch {
    return iso
  }
}

function formatDataAbsoluta(iso: string) {
  try {
    const d = parseISO(iso)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface TimelineItemProps {
  andamento: Andamento
  isLast: boolean
  onExcluir?: () => void
}

export function TimelineItem({ andamento, isLast, onExcluir }: TimelineItemProps) {
  const config = TIPO_CONFIG[andamento.tipo]
  const Icon = config.icon
  const [modalAberto, setModalAberto] = useState(false)

  return (
    <>
      {/* Modal de confirmação de exclusão */}
      {modalAberto && (
        <ConfirmModal
          titulo="Excluir andamento?"
          descricao="O registro será marcado como excluído e não aparecerá mais na timeline. Esta ação é registrada no histórico de auditoria."
          labelConfirmar="Excluir"
          labelCancelar="Cancelar"
          onConfirmar={() => {
            setModalAberto(false)
            onExcluir?.()
          }}
          onCancelar={() => setModalAberto(false)}
        />
      )}

    <div className="flex gap-4">
      {/* Coluna esquerda: ícone + linha vertical */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full border',
            config.bg,
          )}
        >
          <Icon className={cn('size-4', config.color)} />
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-zinc-800" />}
      </div>

      {/* Coluna direita: conteúdo */}
      <div className={cn('min-w-0 flex-1 pb-8', isLast && 'pb-2')}>
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('text-xs font-semibold uppercase tracking-widest', config.color)}>
              {config.label}
            </span>

            {andamento.confidencial && (
              <span className="inline-flex items-center gap-1 rounded-full border border-red-800 bg-red-950 px-2 py-0.5 text-[10px] font-medium text-red-400">
                <Lock className="size-2.5" />
                Confidencial
              </span>
            )}
          </div>

          {/* Botão de exclusão — sempre visível, discreto */}
          {onExcluir && (
            <button
              onClick={() => setModalAberto(true)}
              className="shrink-0 rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-red-400"
              title="Excluir andamento"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>

        {/* Descrição */}
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">{andamento.descricao}</p>

        {/* Anexo */}
        {andamento.anexoUrl && (
          <a
            href={andamento.anexoUrl}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <Paperclip className="size-3" />
            Ver anexo
          </a>
        )}

        {/* Rodapé: autor + data */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-zinc-600">
          <span>{andamento.autor}</span>
          <span>·</span>
          <time
            dateTime={andamento.data}
            title={formatDataAbsoluta(andamento.data)}
            className="cursor-default"
          >
            {formatDataRelativa(andamento.data)}
          </time>
        </div>
      </div>
    </div>
    </>
  )
}
