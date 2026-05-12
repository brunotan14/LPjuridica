'use client'

import { useEffect, useState } from 'react'
import { X, UploadCloud } from 'lucide-react'
import { UploadDropzone } from '@/components/documentos/upload-dropzone'
import { formatarTamanho } from '@/lib/data/documentos'
import type { Documento, DocumentoVersao, AcessoLog } from '@/types/documentos'

interface NovaVersaoModalProps {
  documento: Documento
  onNovaVersao: (docAtualizado: Documento) => void
  onFechar: () => void
}

export function NovaVersaoModal({ documento, onNovaVersao, onFechar }: NovaVersaoModalProps) {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [nota, setNota] = useState('')
  const [erroArquivo, setErroArquivo] = useState<string | undefined>()

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onFechar])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!arquivo) {
      setErroArquivo('Selecione um arquivo para a nova versão.')
      return
    }

    const agora = new Date().toISOString()
    const novaVersaoNum = documento.versaoAtual + 1

    const novaVersao: DocumentoVersao = {
      versao: novaVersaoNum,
      autor: 'Dr. Leandro Pedrosa',
      criadoEm: agora,
      tamanhoBytes: arquivo.size,
    }

    const novoLog: AcessoLog = {
      id: `log-${Date.now()}`,
      usuarioNome: 'Dr. Leandro Pedrosa',
      acao: 'nova_versao',
      criadoEm: agora,
    }

    onNovaVersao({
      ...documento,
      versaoAtual: novaVersaoNum,
      tamanhoBytes: arquivo.size,
      ultimoAcesso: agora,
      versoes: [...documento.versoes, novaVersao],
      acessoLog: [...documento.acessoLog, novoLog],
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onFechar} />

      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-zinc-100">Nova versão</p>
            <p className="mt-0.5 max-w-xs truncate text-xs text-zinc-500">{documento.titulo}</p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Versão atual */}
        <div className="mx-6 mt-5 rounded-xl border border-zinc-700 bg-zinc-800/40 px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Versão atual</p>
          <div className="mt-1.5 flex items-center gap-2.5">
            <span className="inline-flex items-center rounded-full border border-zinc-600 bg-zinc-700 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
              v{documento.versaoAtual}
            </span>
            <span className="text-xs text-zinc-500">{formatarTamanho(documento.tamanhoBytes)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Dropzone */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
              Arquivo (v{documento.versaoAtual + 1})
            </label>
            <UploadDropzone
              onArquivoAceito={(file) => {
                setArquivo(file)
                setErroArquivo(undefined)
              }}
              onArquivoRemovido={() => setArquivo(null)}
            />
            {erroArquivo && <p className="text-xs text-red-400">{erroArquivo}</p>}
          </div>

          {/* Nota opcional */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
              Nota da versão{' '}
              <span className="normal-case text-zinc-600">(opcional)</span>
            </label>
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Ex: Correções após revisão do cliente"
              rows={2}
              className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onFechar}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              <UploadCloud className="size-4" />
              Publicar v{documento.versaoAtual + 1}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
