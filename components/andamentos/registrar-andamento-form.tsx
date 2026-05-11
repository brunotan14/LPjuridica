'use client'

import { useState } from 'react'
import { Paperclip, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Andamento, TipoAndamento } from '@/types/andamentos'

const TIPOS: { value: TipoAndamento; label: string }[] = [
  { value: 'andamento_oficial', label: 'Andamento oficial' },
  { value: 'peca_produzida', label: 'Peça produzida' },
  { value: 'comunicacao_cliente', label: 'Comunicação com cliente' },
  { value: 'anotacao_interna', label: 'Anotação interna' },
  { value: 'evento_audiencia', label: 'Audiência' },
]

function hoje() {
  return new Date().toISOString().slice(0, 10)
}

interface RegistrarAndamentoFormProps {
  processoId: string
  onRegistrar: (andamento: Andamento) => void
  onCancelar: () => void
}

export function RegistrarAndamentoForm({
  processoId,
  onRegistrar,
  onCancelar,
}: RegistrarAndamentoFormProps) {
  const [tipo, setTipo] = useState<TipoAndamento>('andamento_oficial')
  const [data, setData] = useState(hoje())
  const [descricao, setDescricao] = useState('')
  const [confidencial, setConfidencial] = useState(false)
  const [arquivoNome, setArquivoNome] = useState<string | null>(null)
  const [erro, setErro] = useState('')

  function handleTipoChange(novoTipo: TipoAndamento) {
    setTipo(novoTipo)
    if (novoTipo !== 'anotacao_interna') setConfidencial(false)
  }

  function handleArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setArquivoNome(file.name)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (descricao.trim().length < 10) {
      setErro('A descrição deve ter ao menos 10 caracteres.')
      return
    }
    setErro('')

    const novoAndamento: Andamento = {
      id: `and-${Date.now()}`,
      processoId,
      tipo,
      data: new Date(data + 'T12:00:00').toISOString(),
      descricao: descricao.trim(),
      autor: 'Dr. Leandro Pedrosa',
      confidencial,
      anexoUrl: arquivoNome ? `#${arquivoNome}` : undefined,
      criadoEm: new Date().toISOString(),
    }

    onRegistrar(novoAndamento)
    setTipo('andamento_oficial')
    setData(hoje())
    setDescricao('')
    setConfidencial(false)
    setArquivoNome(null)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-200">Registrar andamento</p>
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Tipo + Data */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
            Tipo
          </label>
          <select
            value={tipo}
            onChange={(e) => handleTipoChange(e.target.value as TipoAndamento)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
            Data
          </label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
          Descrição
        </label>
        <textarea
          value={descricao}
          onChange={(e) => {
            setDescricao(e.target.value)
            if (erro) setErro('')
          }}
          rows={4}
          placeholder="Descreva o andamento..."
          className={cn(
            'w-full resize-none rounded-lg border bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1',
            erro
              ? 'border-red-700 focus:border-red-500 focus:ring-red-500'
              : 'border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500',
          )}
        />
        {erro && <p className="text-xs text-red-400">{erro}</p>}
      </div>

      {/* Checkbox confidencial — só para anotação interna */}
      {tipo === 'anotacao_interna' && (
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={confidencial}
            onChange={(e) => setConfidencial(e.target.checked)}
            className="size-4 rounded border-zinc-600 bg-zinc-800 accent-indigo-500"
          />
          <span className="text-sm text-zinc-300">Marcar como confidencial</span>
          <span className="text-xs text-zinc-600">(visível apenas ao Titular)</span>
        </label>
      )}

      {/* Rodapé: upload + botões */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Upload de anexo — UI pronta, integração no M8 */}
        <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300">
          <Paperclip className="size-3.5" />
          {arquivoNome ? (
            <span className="max-w-[160px] truncate text-zinc-400">{arquivoNome}</span>
          ) : (
            'Anexar arquivo'
          )}
          <input type="file" className="sr-only" onChange={handleArquivo} />
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            Registrar
          </button>
        </div>
      </div>
    </form>
  )
}
