'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UploadDropzone } from '@/components/documentos/upload-dropzone'
import { CATEGORIAS_LABEL } from '@/lib/data/documentos'
import type { CategoriaDocumento, Documento } from '@/types/documentos'

const CATEGORIAS = Object.entries(CATEGORIAS_LABEL) as [CategoriaDocumento, string][]

interface AdicionarDocumentoModalProps {
  processoId: string
  onAdicionar: (doc: Documento) => void
  onFechar: () => void
}

export function AdicionarDocumentoModal({
  processoId,
  onAdicionar,
  onFechar,
}: AdicionarDocumentoModalProps) {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState<CategoriaDocumento>('procuracao')
  const [sigiloso, setSigiloso] = useState(false)
  const [erros, setErros] = useState<{ arquivo?: string; titulo?: string }>({})

  // Fechar com Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onFechar])

  // Pré-preencher título com nome do arquivo se ainda estiver vazio
  function handleArquivoAceito(file: File) {
    setArquivo(file)
    if (!titulo) {
      const nomeSemExtensao = file.name.replace(/\.[^.]+$/, '')
      setTitulo(nomeSemExtensao)
    }
    setErros((prev) => ({ ...prev, arquivo: undefined }))
  }

  function validar() {
    const novosErros: { arquivo?: string; titulo?: string } = {}
    if (!arquivo) novosErros.arquivo = 'Selecione um arquivo.'
    if (!titulo.trim()) novosErros.titulo = 'O título é obrigatório.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return

    const tipoArquivo = arquivo!.name.split('.').pop()?.toLowerCase() ?? 'pdf'
    const agora = new Date().toISOString()

    const novoDoc: Documento = {
      id: `doc-${Date.now()}`,
      processoId,
      titulo: titulo.trim(),
      categoria,
      versaoAtual: 1,
      sigiloso,
      ultimoAcesso: agora,
      tamanhoBytes: arquivo!.size,
      tipoArquivo,
      versoes: [
        {
          versao: 1,
          autor: 'Dr. Leandro Pedrosa',
          criadoEm: agora,
          tamanhoBytes: arquivo!.size,
        },
      ],
      acessoLog: [
        {
          id: `log-${Date.now()}`,
          usuarioNome: 'Dr. Leandro Pedrosa',
          acao: 'upload',
          criadoEm: agora,
        },
      ],
      criadoEm: agora,
    }

    onAdicionar(novoDoc)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
        onClick={onFechar}
      />

      {/* Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <p className="text-sm font-semibold text-zinc-100">Adicionar documento</p>
          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Dropzone */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
              Arquivo
            </label>
            <UploadDropzone
              onArquivoAceito={handleArquivoAceito}
              onArquivoRemovido={() => setArquivo(null)}
            />
            {erros.arquivo && (
              <p className="text-xs text-red-400">{erros.arquivo}</p>
            )}
          </div>

          {/* Título */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value)
                if (erros.titulo) setErros((prev) => ({ ...prev, titulo: undefined }))
              }}
              placeholder="Ex: Procuração Ad Judicia"
              className={cn(
                'w-full rounded-lg border bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1',
                erros.titulo
                  ? 'border-red-700 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500',
              )}
            />
            {erros.titulo && (
              <p className="text-xs text-red-400">{erros.titulo}</p>
            )}
          </div>

          {/* Categoria */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaDocumento)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {CATEGORIAS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox sigiloso */}
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={sigiloso}
              onChange={(e) => setSigiloso(e.target.checked)}
              className="size-4 rounded border-zinc-600 bg-zinc-800 accent-indigo-500"
            />
            <span className="text-sm text-zinc-300">Documento sigiloso</span>
            <span className="text-xs text-zinc-600">(visível apenas ao Titular)</span>
          </label>

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
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
