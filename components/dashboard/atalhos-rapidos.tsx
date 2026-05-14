import Link from 'next/link'
import { Plus } from 'lucide-react'

const ATALHOS = [
  { label: 'Novo Processo', href: '/processos?novo=true' },
  { label: 'Novo Prazo', href: '/agenda?novo=prazo' },
  { label: 'Nova Parte', href: '/partes?nova=true' },
]

export function AtalhosRapidos() {
  return (
    <div className="flex flex-wrap gap-2">
      {ATALHOS.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-foreground"
        >
          <Plus className="size-3.5" />
          {label}
        </Link>
      ))}
    </div>
  )
}
