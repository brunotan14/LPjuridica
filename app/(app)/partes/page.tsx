import { Suspense } from 'react'
import { partesMock } from '@/lib/data/partes'
import { PartesTable } from '@/components/partes/partes-table'

export const metadata = {
  title: 'Partes | LP Jurídica',
}

function PartesTableSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="flex gap-1 border-b border-zinc-800 px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-11 w-20 animate-pulse rounded-lg bg-zinc-800 my-2" />
        ))}
      </div>
      <div className="divide-y divide-zinc-800">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-40 animate-pulse rounded-md bg-zinc-800" />
              <div className="h-3 w-28 animate-pulse rounded-md bg-zinc-800" />
            </div>
            <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-4 w-28 animate-pulse rounded-md bg-zinc-800" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PartesPage() {
  return (
    <div className="space-y-0">
      <Suspense fallback={<PartesTableSkeleton />}>
        <PartesTable partes={partesMock} />
      </Suspense>
    </div>
  )
}
