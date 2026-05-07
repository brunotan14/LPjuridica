'use client'

import { usePathname } from 'next/navigation'
import { PAGE_TITLES } from '@/lib/nav'
import { MobileNavTrigger } from './mobile-nav'

export function Header() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const title = PAGE_TITLES[`/${segments[0]}`] ?? 'LP Jurídica'

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4 lg:px-6">
      {/* Mobile hamburger */}
      <MobileNavTrigger />

      {/* Logo — visible on mobile only */}
      <span className="text-sm font-semibold text-zinc-50 lg:hidden">
        LP<span className="text-indigo-500">.</span>
      </span>

      {/* Divider on mobile */}
      <div className="h-5 w-px bg-zinc-700 lg:hidden" />

      {/* Page title */}
      <h1 className="text-sm font-semibold text-zinc-50">{title}</h1>

      {/* Breadcrumb — visible on desktop */}
      {segments.length > 1 && (
        <div className="hidden items-center gap-1 text-sm text-zinc-500 lg:flex">
          <span>/</span>
          {segments.slice(1).map((seg) => (
            <span key={seg} className="capitalize text-zinc-400">
              {decodeURIComponent(seg)}
            </span>
          ))}
        </div>
      )}

      {/* Actions slot */}
      <div id="header-actions" className="ml-auto flex items-center gap-2" />
    </header>
  )
}
