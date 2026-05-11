import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PipelineShell } from '@/components/pipeline/pipeline-shell'

export const metadata: Metadata = { title: 'Pipeline | LP Jurídica' }

function PipelineSkeleton() {
  return (
    <div className="flex h-full animate-pulse gap-3 overflow-x-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex w-[280px] shrink-0 flex-col rounded-xl border border-zinc-800 bg-zinc-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2.5">
            <div className="h-3 w-24 rounded-full bg-zinc-800" />
            <div className="h-4 w-6 rounded-full bg-zinc-800" />
          </div>
          {/* Cards */}
          <div className="flex flex-col gap-2 p-2">
            {Array.from({ length: i < 2 ? 3 : 2 }).map((_, j) => (
              <div
                key={j}
                className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-800/50 p-3"
              >
                <div className="h-3.5 w-3/4 rounded-full bg-zinc-700" />
                <div className="h-3 w-1/2 rounded-full bg-zinc-700/60" />
                <div className="h-3 w-2/3 rounded-full bg-zinc-700/40" />
                <div className="flex justify-end">
                  <div className="size-6 rounded-full bg-zinc-700/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function PipelinePage() {
  return (
    <Suspense fallback={<PipelineSkeleton />}>
      <PipelineShell />
    </Suspense>
  )
}
