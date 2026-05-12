'use client'

import { formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  FileText,
  Image,
  Video,
  Music,
  File,
  Lock,
  Eye,
  Download,
  UploadCloud,
  FolderOpen,
} from 'lucide-react'
import { formatarTamanho, CATEGORIAS_LABEL } from '@/lib/data/documentos'
import type { Documento } from '@/types/documentos'

// ─── Ícone por tipo de arquivo ────────────────────────────────────────────────

function IconeArquivo({ tipo }: { tipo: string }) {
  const map: Record<string, React.ComponentType<{ className?: string }>> = {
    pdf: FileText,
    jpg: Image,
    jpeg: Image,
    png: Image,
    mp4: Video,
    mp3: Music,
    doc: File,
    docx: File,
  }
  const Icon = map[tipo.toLowerCase()] ?? File
  return <Icon className="size-4 shrink-0 text-zinc-500" />
}

// ─── Badge Sigiloso ───────────────────────────────────────────────────────────

function BadgeSigiloso() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-red-800 bg-red-950 px-2 py-0.5 text-[10px] font-medium text-red-400">
      <Lock className="size-2.5" />
      Sigiloso
    </span>
  )
}

// ─── Badge Versão ─────────────────────────────────────────────────────────────

function BadgeVersao({ versao }: { versao: number }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
      v{versao}
    </span>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onAdicionar }: { onAdicionar: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-zinc-800">
        <FolderOpen className="size-6 text-zinc-600" />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-400">Nenhum documento anexado</p>
      <p className="mt-1 text-xs text-zinc-600">
        Faça upload do primeiro documento para este processo.
      </p>
      <button
        onClick={onAdicionar}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        <UploadCloud className="size-4" />
        Adicionar documento
      </button>
    </div>
  )
}

// ─── Linha da tabela ──────────────────────────────────────────────────────────

interface LinhaDocumentoProps {
  documento: Documento
  onVisualizar: (doc: Documento) => void
  onBaixar: (doc: Documento) => void
  onNovaVersao: (doc: Documento) => void
}

function LinhaDocumento({ documento, onVisualizar, onBaixar, onNovaVersao }: LinhaDocumentoProps) {
  const ultimoAcesso = formatDistanceToNow(parseISO(documento.ultimoAcesso), {
    addSuffix: true,
    locale: ptBR,
  })

  return (
    <tr className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/40 last:border-0">
      {/* Título + ícone + badge sigiloso */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <IconeArquivo tipo={documento.tipoArquivo} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-medium text-zinc-200">{documento.titulo}</p>
              {documento.sigiloso && <BadgeSigiloso />}
            </div>
            <p className="text-[11px] text-zinc-600">{formatarTamanho(documento.tamanhoBytes)}</p>
          </div>
        </div>
      </td>

      {/* Categoria */}
      <td className="px-4 py-3">
        <span className="text-sm text-zinc-400">
          {CATEGORIAS_LABEL[documento.categoria] ?? documento.categoria}
        </span>
      </td>

      {/* Versão */}
      <td className="px-4 py-3">
        <BadgeVersao versao={documento.versaoAtual} />
      </td>

      {/* Último acesso */}
      <td className="px-4 py-3">
        <time
          dateTime={documento.ultimoAcesso}
          title={new Date(documento.ultimoAcesso).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
          className="cursor-default text-sm text-zinc-500"
        >
          {ultimoAcesso}
        </time>
      </td>

      {/* Ações */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onVisualizar(documento)}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
            title="Visualizar"
          >
            <Eye className="size-4" />
          </button>
          <button
            onClick={() => onBaixar(documento)}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
            title="Baixar"
          >
            <Download className="size-4" />
          </button>
          <button
            onClick={() => onNovaVersao(documento)}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
            title="Nova versão"
          >
            <UploadCloud className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface DocumentosTableProps {
  documentos: Documento[]
  onAdicionar: () => void
  onVisualizar: (doc: Documento) => void
  onBaixar: (doc: Documento) => void
  onNovaVersao: (doc: Documento) => void
}

export function DocumentosTable({
  documentos,
  onAdicionar,
  onVisualizar,
  onBaixar,
  onNovaVersao,
}: DocumentosTableProps) {
  if (documentos.length === 0) {
    return <EmptyState onAdicionar={onAdicionar} />
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-800/40">
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Documento
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Categoria
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Versão
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Último acesso
            </th>
            <th className="px-4 py-3 text-right text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((doc) => (
            <LinhaDocumento
              key={doc.id}
              documento={doc}
              onVisualizar={onVisualizar}
              onBaixar={onBaixar}
              onNovaVersao={onNovaVersao}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
