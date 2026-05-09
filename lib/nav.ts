import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Columns3,
  CalendarClock,
  Banknote,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  badge?: number
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/partes', label: 'Partes', icon: Users },
  { href: '/processos', label: 'Processos', icon: FolderOpen },
  { href: '/pipeline', label: 'Pipeline', icon: Columns3 },
  { href: '/agenda', label: 'Agenda', icon: CalendarClock },
  { href: '/financeiro', label: 'Financeiro', icon: Banknote },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

export const PAGE_TITLES: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map((item) => [item.href, item.label])
)
