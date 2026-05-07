'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/lib/nav'

export function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const isActive =
    item.href === '/dashboard'
      ? pathname === item.href
      : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-3 rounded-lg py-2 pr-3 text-sm font-medium transition-colors',
        isActive
          ? 'border-l-2 border-indigo-500 bg-zinc-800 pl-[10px] text-zinc-50'
          : 'border-l-2 border-transparent pl-[10px] text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
      )}
    >
      <item.icon
        className={cn(
          'size-4 shrink-0 transition-colors',
          isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'
        )}
      />
      <span className="flex-1">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={cn(
            'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums',
            isActive
              ? 'bg-indigo-500 text-white'
              : 'bg-red-500/20 text-red-400'
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  )
}
