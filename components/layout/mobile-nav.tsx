'use client'

import { useState, useEffect, useMemo } from 'react'
import { Menu, X } from 'lucide-react'
import { navItemsComBadges } from '@/lib/nav-badges'
import { NavLink } from './nav-link'
import { WorkspaceSwitcher } from './workspace-switcher'
import { UserMenu } from './user-menu'
import { LPMonogram } from '@/components/brand/lp-monogram'

const HOJE_ANCORA = new Date('2026-05-09T12:00:00')

export function MobileNavTrigger() {
  const [open, setOpen] = useState(false)
  const items = useMemo(() => navItemsComBadges(HOJE_ANCORA), [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="flex size-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-800 bg-zinc-950 transition-transform duration-300 ease-in-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-800 px-5">
          <div className="flex items-center gap-2.5">
            <LPMonogram size={30} />
            <span className="font-cinzel text-[13px] tracking-[0.12em] text-[#e8d09a]">LP Jurídica</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="flex size-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Workspace switcher */}
        <div className="py-3">
          <WorkspaceSwitcher />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-2">
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            Menu
          </p>
          {items.map((item) => (
            <NavLink key={item.href} item={item} onNavigate={() => setOpen(false)} />
          ))}
        </nav>

        {/* User menu */}
        <div className="border-t border-zinc-800 p-2">
          <UserMenu />
        </div>
      </aside>
    </>
  )
}
