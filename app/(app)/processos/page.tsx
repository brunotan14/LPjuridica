export default function ProcessosPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">Nenhum processo cadastrado</p>
        <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors">
          + Novo Processo
        </button>
      </div>
      <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 p-12 text-center">
        <p className="text-sm font-medium text-zinc-400">Gestão de Processos</p>
        <p className="mt-1 text-xs text-zinc-600">
          CNJ, fases processuais, sigilo e partes vinculadas — M4
        </p>
      </div>
    </div>
  )
}
