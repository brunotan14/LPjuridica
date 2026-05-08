'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronsUpDown, Check, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LPMonogram } from '@/components/brand/lp-monogram'

type Workspace = { id: string; name: string; plan: string }

const WORKSPACES: Workspace[] = [
  { id: '1', name: 'Leandro Pedrosa Advocacia', plan: 'Profissional' },
  { id: '2', name: 'LP Consultoria Criminal', plan: 'Básico' },
]

export function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(WORKSPACES[0])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <div ref={ref} className="relative px-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-left transition-colors hover:bg-zinc-800"
      >
        <LPMonogram size={28} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-100">
            {selected.name}
          </p>
          <p className="text-xs text-zinc-500">{selected.plan}</p>
        </div>
        <ChevronsUpDown className="size-3.5 shrink-0 text-zinc-500" />
      </button>

      {open && (
        <div className="absolute left-2 right-2 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 shadow-xl">
          <div className="p-1">
            {WORKSPACES.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  setSelected(ws)
                  setOpen(false)
                }}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors hover:bg-zinc-700"
              >
                <LPMonogram size={28} />
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium text-zinc-100">
                    {ws.name}
                  </p>
                  <p className="text-xs text-zinc-500">{ws.plan}</p>
                </div>
                {selected.id === ws.id && (
                  <Check className="size-3.5 shrink-0 text-primary" />
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-zinc-700 p-1">
            <button className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200">
              <Building2 className="size-4" />
              Gerenciar escritório
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
