'use client'

import { Bell, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { usePushPermission } from './use-push-permission'

export function PushPermissionPrompt() {
  const { status, requestPermission, dismiss } = usePushPermission()
  const pathname = usePathname()

  // Não duplica o CTA na própria página de configurações de notificações
  if (pathname?.startsWith('/configuracoes')) return null

  // Só mostra o banner quando a permissão ainda não foi decidida
  if (status !== 'idle') return null

  return (
    <div className="mb-5 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3.5">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Bell className="size-3.5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          Ative os alertas de prazo no celular
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Prazos processuais vencem mesmo quando você está fora do escritório. Ative
          as notificações para receber alertas D-7, D-3, D-1 e no dia do vencimento.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={requestPermission}
            className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Ativar alertas
          </button>
          <button
            onClick={dismiss}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Agora não
          </button>
        </div>
      </div>

      <button
        onClick={dismiss}
        className="mt-0.5 shrink-0 text-muted-foreground/60 transition-colors hover:text-muted-foreground"
        aria-label="Dispensar"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
