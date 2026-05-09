'use client'

import { useMemo } from 'react'
import { navItemsComBadges } from '@/lib/nav-badges'
import { NavLink } from './nav-link'
import { WorkspaceSwitcher } from './workspace-switcher'
import { UserMenu } from './user-menu'
import { LPMonogram } from '@/components/brand/lp-monogram'

// Âncora temporal fixa (mock M5). Remover quando backend estiver pronto.
const HOJE_ANCORA = new Date('2026-05-09T12:00:00')

export function Sidebar() {
  const items = useMemo(() => navItemsComBadges(HOJE_ANCORA), [])

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-zinc-800 px-5">
        <LPMonogram size={30} />
        <span className="font-cinzel text-[13px] tracking-[0.12em] text-[#e8d09a]">LP Jurídica</span>
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
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* User menu */}
      <div className="border-t border-zinc-800 p-2">
        <UserMenu />
      </div>
    </aside>
  )
}
