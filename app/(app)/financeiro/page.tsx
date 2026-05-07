export default function FinanceiroPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Inadimplência', value: '—', sub: 'Total em aberto' },
          { label: 'Faturamento do Mês', value: '—', sub: 'Recebido em maio/26' },
          { label: 'A Receber (30 dias)', value: '—', sub: 'Próximas cobranças' },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
          >
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="mt-2 text-xl font-semibold text-zinc-50">{value}</p>
            <p className="mt-0.5 text-xs text-zinc-600">{sub}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 p-12 text-center">
        <p className="text-sm font-medium text-zinc-400">Módulo Financeiro</p>
        <p className="mt-1 text-xs text-zinc-600">
          Honorários, parcelas, êxito e despesas reembolsáveis — M9
        </p>
      </div>
    </div>
  )
}
