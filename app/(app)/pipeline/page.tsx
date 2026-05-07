export default function PipelinePage() {
  const fases = [
    'Pré-processual',
    'Inquérito',
    'Denúncia/Recebimento',
    'Instrução',
    'Memoriais',
    'Sentença',
    'Recursos',
    'Execução',
    'Arquivado',
  ]

  return (
    <div className="-mx-4 overflow-x-auto px-4 lg:-mx-6 lg:px-6">
      <div className="flex min-w-max gap-3 pb-4">
        {fases.map((fase) => (
          <div
            key={fase}
            className="flex w-64 shrink-0 flex-col rounded-xl border border-zinc-800 bg-zinc-900"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <span className="text-xs font-semibold text-zinc-300">{fase}</span>
              <span className="text-xs text-zinc-600">0</span>
            </div>
            <div className="flex h-32 items-center justify-center p-3">
              <p className="text-xs text-zinc-700">Pipeline Kanban — M6</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
