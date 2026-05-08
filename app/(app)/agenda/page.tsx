export default function AgendaPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['Calendário', 'Semana', 'Dia'].map((view) => (
            <button
              key={view}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200 first:border-primary first:bg-primary/10 first:text-primary"
            >
              {view}
            </button>
          ))}
        </div>
        <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary transition-colors">
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
