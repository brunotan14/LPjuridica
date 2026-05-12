'use client'

import { useCallback, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatarTamanho } from '@/lib/data/documentos'

const TIPOS_ACEITOS = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'audio/mpeg': ['.mp3'],
  'video/mp4': ['.mp4'],
}

const TAMANHO_MAXIMO = 50 * 1024 * 1024 // 50 MB

interface ArquivoSelecionado {
  file: File
  erro?: string
}

interface UploadDropzoneProps {
  onArquivoAceito: (file: File) => void
  onArquivoRemovido?: () => void
  className?: string
}

export function UploadDropzone({
  onArquivoAceito,
  onArquivoRemovido,
  className,
}: UploadDropzoneProps) {
  const [arquivoSelecionado, setArquivoSelecionado] = useState<ArquivoSelecionado | null>(null)

  const onDrop = useCallback(
    (aceitos: File[], rejeitados: FileRejection[]) => {
      if (aceitos.length > 0) {
        const file = aceitos[0]
        setArquivoSelecionado({ file })
        onArquivoAceito(file)
      }
      if (rejeitados.length > 0) {
        const { file, errors } = rejeitados[0]
        const mensagem =
          errors[0]?.message.includes('size')
            ? `Arquivo muito grande. Máximo: ${formatarTamanho(TAMANHO_MAXIMO)}`
            : 'Tipo de arquivo não permitido. Use PDF, DOC, DOCX, JPG, PNG, MP3 ou MP4.'
        setArquivoSelecionado({ file, erro: mensagem })
      }
    },
    [onArquivoAceito],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: TIPOS_ACEITOS,
    maxSize: TAMANHO_MAXIMO,
    multiple: false,
  })

  function removerArquivo() {
    setArquivoSelecionado(null)
    onArquivoRemovido?.()
  }

  // ── Arquivo selecionado ────────────────────────────────────────────────────
  if (arquivoSelecionado) {
    const temErro = !!arquivoSelecionado.erro
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border px-4 py-3',
          temErro
            ? 'border-red-800 bg-red-950/30'
            : 'border-emerald-800 bg-emerald-950/30',
          className,
        )}
      >
        {temErro ? (
          <AlertCircle className="size-5 shrink-0 text-red-400" />
        ) : (
          <FileText className="size-5 shrink-0 text-emerald-400" />
        )}
        <div className="min-w-0 flex-1">
          <p className={cn('truncate text-sm font-medium', temErro ? 'text-red-300' : 'text-zinc-200')}>
            {arquivoSelecionado.file.name}
          </p>
          {temErro ? (
            <p className="text-xs text-red-400">{arquivoSelecionado.erro}</p>
          ) : (
            <p className="text-xs text-zinc-500">
              {formatarTamanho(arquivoSelecionado.file.size)}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={removerArquivo}
          className="shrink-0 rounded-lg p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  // ── Zona de drop ───────────────────────────────────────────────────────────
  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors',
        isDragReject
          ? 'border-red-700 bg-red-950/20'
          : isDragActive
            ? 'border-indigo-500 bg-indigo-950/30'
            : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50',
        className,
      )}
    >
      <input {...getInputProps()} />
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-full border',
          isDragReject
            ? 'border-red-800 bg-red-950'
            : isDragActive
              ? 'border-indigo-700 bg-indigo-950'
              : 'border-zinc-700 bg-zinc-800',
        )}
      >
        <UploadCloud
          className={cn(
            'size-5',
            isDragReject ? 'text-red-400' : isDragActive ? 'text-indigo-400' : 'text-zinc-500',
          )}
        />
      </div>

      {isDragReject ? (
        <p className="mt-3 text-sm font-medium text-red-400">Tipo de arquivo não permitido</p>
      ) : isDragActive ? (
        <p className="mt-3 text-sm font-medium text-indigo-300">Solte o arquivo aqui</p>
      ) : (
        <>
          <p className="mt-3 text-sm font-medium text-zinc-300">
            Arraste um arquivo ou{' '}
            <span className="text-indigo-400 underline underline-offset-2">clique para selecionar</span>
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            PDF, DOC, DOCX, JPG, PNG, MP3, MP4 · máx. 50 MB
          </p>
        </>
      )}
    </div>
  )
}
