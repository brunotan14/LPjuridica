'use client'

import { NAV_ITEMS } from '@/lib/nav'
import { NavLink } from './nav-link'
import { WorkspaceSwitcher } from './workspace-switcher'
import { UserMenu } from './user-menu'
import { Scale } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-zinc-800 px-5">
        <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-600">
          <Scale className="size-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-zinc-50">LP Jurídica</span>
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
        {NAV_ITEMS.map((item) => (
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
