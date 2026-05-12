'use client'

import { useEffect, useState } from 'react'
import {
  X,
  Eye,
  History,
  Shield,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  File,
  Download,
} from 'lucide-react'
import { formatDistanceToNow, parseISO, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { formatarTamanho } from '@/lib/data/documentos'
import type { Documento, AcaoAcesso } from '@/types/documentos'

// ─── Constantes ───────────────────────────────────────────────────────────────

const ACOES_LABEL: Record<AcaoAcesso, { label: string; colorClass: string }> = {
  upload: { label: 'Upload', colorClass: 'text-emerald-400' },
  visualizacao: { label: 'Visualização', colorClass: 'text-indigo-400' },
  download: { label: 'Download', colorClass: 'text-amber-400' },
  nova_versao: { label: 'Nova versão', colorClass: 'text-blue-400' },
}

const TABS_DEF = [
  { id: 'visualizar' as const, label: 'Visualizar', icon: Eye },
  { id: 'versoes' as const, label: 'Versões', icon: History },
  { id: 'log' as const, label: 'Log de acesso', icon: Shield },
]

type TabId = 'visualizar' | 'versoes' | 'log'

// ─── Aba Visualizar ───────────────────────────────────────────────────────────

function VisualizarTab({ documento }: { documento: Documento }) {
  const tipo = documento.tipoArquivo.toLowerCase()

  const isPdf = tipo === 'pdf'
  const isVideo = tipo === 'mp4'
  const isAudio = tipo === 'mp3'

  const IconeMap: Record<string, React.ComponentType<{ className?: string }>> = {
    pdf: FileText,
    jpg: ImageIcon,
    jpeg: ImageIcon,
    png: ImageIcon,
    mp4: Video,
    mp3: Music,
  }
  const Icone = IconeMap[tipo] ?? File

  const labelMap: Record<string, string> = {
    pdf: 'PDF',
    jpg: 'Imagem',
    jpeg: 'Imagem',
    png: 'Imagem',
    mp4: 'Vídeo',
    mp3: 'Áudio',
    doc: 'Documento Word',
    docx: 'Documento Word',
  }
  const tipoLabel = labelMap[tipo] ?? tipo.toUpperCase()

  const corIcone = isPdf
    ? 'border-indigo-800/50 bg-indigo-950/50'
    : isVideo
      ? 'border-purple-800/50 bg-purple-950/50'
      : isAudio
        ? 'border-emerald-800/50 bg-emerald-950/50'
        : 'border-zinc-700 bg-zinc-800'

  const corIconeInner = isPdf
    ? 'text-indigo-400'
    : isVideo
      ? 'text-purple-400'
      : isAudio
        ? 'text-emerald-400'
        : 'text-zinc-400'

  const isImagem = ['jpg', 'jpeg', 'png'].includes(tipo)

  const mensagem =
    isPdf || isVideo || isAudio
      ? `O visualizador será renderizado via signed URL no ambiente de produção.`
      : isImagem
        ? `A imagem será exibida via signed URL no ambiente de produção.`
        : `Visualização não disponível para este tipo de arquivo. Faça o download para abrir.`

  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-8">
      <div className={cn('flex size-16 items-center justify-center rounded-2xl border', corIcone)}>
        <Icone className={cn('size-8', corIconeInner)} />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-zinc-200">{documento.titulo}</p>
        <p className="mt-1 text-xs text-zinc-500">
          {tipoLabel} • {formatarTamanho(documento.tamanhoBytes)} • v{documento.versaoAtual}
        </p>
      </div>

      <p className="max-w-xs text-center text-xs text-zinc-600">{mensagem}</p>

      <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500">
        <Download className="size-4" />
        Baixar {tipoLabel.toLowerCase()}
      </button>
    </div>
  )
}

// ─── Aba Versões ──────────────────────────────────────────────────────────────

function VersoesTab({ documento }: { documento: Documento }) {
  const versoes = [...documento.versoes].sort((a, b) => b.versao - a.versao)

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-800/40">
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Versão
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Autor
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Tamanho
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Data
            </th>
          </tr>
        </thead>
        <tbody>
          {versoes.map((v) => (
            <tr
              key={v.versao}
              className={cn(
                'border-b border-zinc-800 transition-colors hover:bg-zinc-800/40 last:border-0',
                v.versao === documento.versaoAtual && 'bg-indigo-950/20',
              )}
            >
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                    v.versao === documento.versaoAtual
                      ? 'border-indigo-700 bg-indigo-900/50 text-indigo-300'
                      : 'border-zinc-700 bg-zinc-800 text-zinc-400',
                  )}
                >
                  v{v.versao}
                  {v.versao === documento.versaoAtual && (
                    <span className="text-[9px] text-indigo-400">atual</span>
                  )}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-300">{v.autor}</td>
              <td className="px-4 py-3 text-sm text-zinc-500">{formatarTamanho(v.tamanhoBytes)}</td>
              <td className="px-4 py-3">
                <time
                  dateTime={v.criadoEm}
                  title={format(parseISO(v.criadoEm), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  className="cursor-default text-sm text-zinc-500"
                >
                  {formatDistanceToNow(parseISO(v.criadoEm), { addSuffix: true, locale: ptBR })}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Aba Log de acesso ────────────────────────────────────────────────────────

function LogAcessoTab({ documento }: { documento: Documento }) {
  const logs = [...documento.acessoLog].sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-800/30 px-3 py-2">
        <Shield className="size-3.5 shrink-0 text-zinc-600" />
        <span className="text-xs text-zinc-600">Visível apenas ao Titular</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-800/40">
              <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                Usuário
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                Ação
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                Data
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const acao = ACOES_LABEL[log.acao]
              return (
                <tr
                  key={log.id}
                  className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/40 last:border-0"
                >
                  <td className="px-4 py-3 text-sm text-zinc-300">{log.usuarioNome}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-sm', acao.colorClass)}>{acao.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <time
                      dateTime={log.criadoEm}
                      title={format(parseISO(log.criadoEm), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      className="cursor-default text-sm text-zinc-500"
                    >
                      {formatDistanceToNow(parseISO(log.criadoEm), { addSuffix: true, locale: ptBR })}
                    </time>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Modal principal ──────────────────────────────────────────────────────────

interface DocumentoDetalheModalProps {
  documento: Documento
  onFechar: () => void
  defaultTab?: TabId
}

export function DocumentoDetalheModal({
  documento,
  onFechar,
  defaultTab = 'visualizar',
}: DocumentoDetalheModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onFechar])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onFechar} />

      <div
        className="relative flex w-full max-w-2xl flex-col rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 px-6 py-4">
          <div className="min-w-0 pr-4">
            <p className="truncate text-sm font-semibold text-zinc-100">{documento.titulo}</p>
            <p className="mt-0.5 text-xs text-zinc-500">
              {documento.tipoArquivo.toUpperCase()} •{' '}
              {formatarTamanho(documento.tamanhoBytes)} • v{documento.versaoAtual}
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-zinc-800">
          {TABS_DEF.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-indigo-500 text-zinc-50'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300',
                )}
              >
                <Icon className="size-4" />
                {tab.label}
                {tab.id === 'log' && (
                  <span className="rounded-full border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-500">
                    Titular
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="overflow-y-auto p-6">
          {activeTab === 'visualizar' && <VisualizarTab documento={documento} />}
          {activeTab === 'versoes' && <VersoesTab documento={documento} />}
          {activeTab === 'log' && <LogAcessoTab documento={documento} />}
        </div>
      </div>
    </div>
  )
}
