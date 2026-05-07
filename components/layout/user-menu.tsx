'use client'

import { useState, useRef, useEffect } from 'react'
import { LogOut, User, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const MOCK_USER = {
  name: 'Dr. Leandro Pedrosa',
  email: 'leandro@lpjuridica.adv.br',
  role: 'Titular',
  initials: 'LP',
}

export function UserMenu() {
  const [open, setOpen] = useState(false)
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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-zinc-800"
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white ring-2 ring-indigo-500/30">
          {MOCK_USER.initials}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-medium text-zinc-100">
            {MOCK_USER.name}
          </p>
          <p className="text-xs text-zinc-500">{MOCK_USER.role}</p>
        </div>
        <ChevronUp
          className={cn(
            'size-3.5 shrink-0 text-zinc-500 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 z-50 mb-1.5 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 shadow-xl">
          <div className="border-b border-zinc-700 px-3 py-2.5">
            <p className="text-sm font-medium text-zinc-100">{MOCK_USER.name}</p>
            <p className="text-xs text-zinc-500">{MOCK_USER.email}</p>
          </div>
          <div className="p-1">
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-100">
              <User className="size-4 text-zinc-500" />
              Meu perfil
            </button>
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10">
              <LogOut className="size-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
