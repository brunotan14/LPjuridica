export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Processos Ativos', value: '—' },
          { label: 'Audiências esta Semana', value: '—' },
          { label: 'Prazos nos Próximos 7 Dias', value: '—' },
          { label: 'Inadimplência Total', value: '—' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
          >
            <p className="text-sm text-zinc-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-50">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">
            Próximas Audiências
          </h2>
          <PlaceholderEmpty label="Nenhuma audiência próxima" />
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">
            Prazos Críticos
          </h2>
          <PlaceholderEmpty label="Nenhum prazo crítico" />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-4 text-sm font-semibold text-zinc-300">
          Distribuição por Fase Processual
        </h2>
        <PlaceholderEmpty label="Dados disponíveis após cadastro de processos" />
      </div>
    </div>
  )
}

function PlaceholderEmpty({ label }: { label: string }) {
  return (
    <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-zinc-700">
      <p className="text-sm text-zinc-600">{label}</p>
    </div>
  )
}
