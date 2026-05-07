export default function AgendaPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['Calendário', 'Semana', 'Dia'].map((view) => (
            <button
              key={view}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200 first:border-indigo-500 first:bg-indigo-500/10 first:text-indigo-400"
            >
              {view}
            </button>
          ))}
        </div>
        <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors">
          + Novo Evento
        </button>
      </div>
      <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 p-12 text-center">
        <p className="text-sm font-medium text-zinc-400">Agenda de Prazos e Audiências</p>
        <p className="mt-1 text-xs text-zinc-600">
          Módulo crítico com alertas redundantes — M5
        </p>
      </div>
    </div>
  )
}
