import { Suspense } from 'react'
import { eventosMock } from '@/lib/data/agenda'
import { AgendaShell } from '@/components/agenda/agenda-shell'

export const metadata = {
  title: 'Agenda | LP Jurídica',
}

function AgendaSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-9 w-72 animate-pulse rounded-lg bg-muted" />
        <div className="h-9 w-32 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg border border-border bg-card/30"
          />
        ))}
      </div>
    </div>
  )
}

export default function AgendaPage() {
  // Âncora temporal fixa enquanto não há backend.
  // Ao trocar para dados reais (M5 backend), remover esta linha.
  const hoje = new Date('2026-05-09T12:00:00')

  return (
    <Suspense fallback={<AgendaSkeleton />}>
      <AgendaShell eventos={eventosMock} hoje={hoje} />
    </Suspense>
  )
}
