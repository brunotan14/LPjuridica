'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { NotificacoesTab } from '@/components/push/notificacoes-tab'

type Aba = 'escritorio' | 'notificacoes' | 'equipe' | 'seguranca'

const ABAS: { key: Aba; label: string }[] = [
  { key: 'escritorio',   label: 'Escritório' },
  { key: 'notificacoes', label: 'Notificações' },
  { key: 'equipe',       label: 'Equipe' },
  { key: 'seguranca',    label: 'Segurança' },
]

function PlaceholderAba({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border">
      <p className="text-sm text-muted-foreground/50">{label} — disponível em breve</p>
    </div>
  )
}

export default function ConfiguracoesPage() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('notificacoes')

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Configurações</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gerencie as preferências do escritório e da sua conta
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {ABAS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setAbaAtiva(key)}
            className={cn(
              'border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              abaAtiva === key
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba */}
      <div>
        {abaAtiva === 'escritorio'   && <PlaceholderAba label="Escritório" />}
        {abaAtiva === 'notificacoes' && <NotificacoesTab />}
        {abaAtiva === 'equipe'       && <PlaceholderAba label="Equipe (M12)" />}
        {abaAtiva === 'seguranca'    && <PlaceholderAba label="Segurança" />}
      </div>
    </div>
  )
}
