export default function PartesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">Nenhuma parte cadastrada</p>
        <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors">
          + Nova Parte
        </button>
      </div>
      <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 p-12 text-center">
        <p className="text-sm font-medium text-zinc-400">Cadastro de Partes</p>
        <p className="mt-1 text-xs text-zinc-600">
          Clientes, réus, vítimas, testemunhas e autoridades — M3
        </p>
      </div>
    </div>
  )
}
