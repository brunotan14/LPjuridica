import { Suspense } from 'react'
import { processosMock } from '@/lib/data/processos'
import { ProcessosTable } from '@/components/processos/processos-table'

export const metadata = { title: 'Processos | LP Jurídica' }

function ProcessosTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 rounded-lg bg-zinc-800" />
          <div className="h-4 w-64 rounded-lg bg-zinc-800" />
        </div>
        <div className="h-7 w-32 rounded-lg bg-zinc-800" />
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="flex gap-2 border-b border-zinc-800 px-4 py-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-lg bg-zinc-800" />
          ))}
        </div>
        <div className="border-b border-zinc-800 px-4 py-3">
          <div className="h-9 rounded-lg bg-zinc-800" />
        </div>
        <div className="divide-y divide-zinc-800">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-48 rounded bg-zinc-800" />
                <div className="h-3 w-32 rounded bg-zinc-800" />
              </div>
              <div className="h-4 w-24 rounded bg-zinc-800" />
              <div className="h-4 w-24 rounded bg-zinc-800" />
              <div className="h-5 w-20 rounded-full bg-zinc-800" />
              <div className="h-4 w-20 rounded bg-zinc-800" />
              <div className="h-5 w-16 rounded-full bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProcessosPage() {
  return (
    <div>
      <Suspense fallback={<ProcessosTableSkeleton />}>
        <ProcessosTable processos={processosMock} />
      </Suspense>
    </div>
  )
}
