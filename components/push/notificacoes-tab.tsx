'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, CheckCircle2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePushPermission } from './use-push-permission'

type TipoAlerta = {
  key: string
  label: string
  descricao: string
}

const TIPOS_ALERTA: TipoAlerta[] = [
  { key: 'D7',       label: 'Prazo D-7',            descricao: '7 dias antes do vencimento' },
  { key: 'D3',       label: 'Prazo D-3',            descricao: '3 dias antes do vencimento' },
  { key: 'D1',       label: 'Prazo D-1',            descricao: '1 dia antes do vencimento — crítico' },
  { key: 'dia',      label: 'Prazo no dia',         descricao: 'No próprio dia do vencimento' },
  { key: 'audiencia',label: 'Audiências',           descricao: 'D-1 da audiência agendada' },
  { key: 'status',   label: 'Mudança de status',    descricao: 'Alteração de fase processual' },
]

const TOGGLES_KEY = 'lp_push_toggles'
const DEFAULT_TOGGLES: Record<string, boolean> = {
  D7: true, D3: true, D1: true, dia: true, audiencia: true, status: false,
}

function safeReadToggles(): Record<string, boolean> | null {
  try {
    const raw = localStorage.getItem(TOGGLES_KEY)
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : null
  } catch { return null }
}
function safeWriteToggles(t: Record<string, boolean>) {
  try { localStorage.setItem(TOGGLES_KEY, JSON.stringify(t)) } catch { /* private mode */ }
}

function Toggle({
  enabled,
  onToggle,
  disabled,
}: {
  enabled: boolean
  onToggle: () => void
  disabled?: boolean
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors',
        enabled ? 'bg-primary' : 'bg-zinc-700',
        disabled && 'cursor-not-allowed opacity-40',
      )}
    >
      <span
        className={cn(
          'inline-block size-3.5 rounded-full bg-white shadow transition-transform',
          enabled ? 'translate-x-4' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

export function NotificacoesTab() {
  const { status, requestPermission } = usePushPermission()
  const [toggles, setToggles] = useState<Record<string, boolean>>(DEFAULT_TOGGLES)
  const [testeSent, setTesteSent] = useState(false)

  // Carrega preferências persistidas (localStorage indisponível no SSR)
  useEffect(() => {
    Promise.resolve().then(() => {
      const saved = safeReadToggles()
      if (saved) setToggles({ ...DEFAULT_TOGGLES, ...saved })
    })
  }, [])

  const isAtivo = status === 'granted'

  function flipToggle(key: string) {
    setToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      safeWriteToggles(next)
      return next
    })
  }

  function desativarTudo() {
    const next = Object.fromEntries(TIPOS_ALERTA.map((t) => [t.key, false]))
    safeWriteToggles(next)
    setToggles(next)
  }

  async function enviarTeste() {
    if (!isAtivo) return
    // Backend M11: dispara push de teste via /api/push/test
    try {
      const reg = await navigator.serviceWorker.ready
      await reg.showNotification('LP Jurídica — Teste', {
        body: 'Notificações estão funcionando corretamente.',
        tag: 'lp-test',
      })
      setTesteSent(true)
      setTimeout(() => setTesteSent(false), 3000)
    } catch {
      /* bloqueio em nível de SO ou SW indisponível */
    }
  }

  return (
    <div className="space-y-6">
      {/* Status atual */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-8 items-center justify-center rounded-lg',
              isAtivo ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800 text-zinc-500',
            )}
          >
            {isAtivo ? <Bell className="size-4" /> : <BellOff className="size-4" />}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isAtivo ? 'Notificações ativadas' : 'Notificações desativadas'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isAtivo
                ? 'Este dispositivo receberá alertas de prazo'
                : 'Ative para receber alertas mesmo fora do sistema'}
            </p>
          </div>
        </div>

        {!isAtivo && (
          <button
            onClick={requestPermission}
            className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Ativar
          </button>
        )}
      </div>

      {/* Toggles por tipo */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Tipos de alerta
        </p>
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {TIPOS_ALERTA.map(({ key, label, descricao }) => (
            <div key={key} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{descricao}</p>
              </div>
              <Toggle
                enabled={toggles[key] ?? false}
                onToggle={() => flipToggle(key)}
                disabled={!isAtivo}
              />
            </div>
          ))}
        </div>
        {!isAtivo && (
          <p className="mt-2 text-xs text-muted-foreground/70">
            Ative as notificações para configurar os tipos de alerta.
          </p>
        )}
      </div>

      {/* Ações */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={enviarTeste}
          disabled={!isAtivo || testeSent}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors',
            isAtivo && !testeSent
              ? 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
              : 'cursor-not-allowed border-border bg-card text-muted-foreground/40',
          )}
        >
          {testeSent ? (
            <>
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              Enviado!
            </>
          ) : (
            <>
              <Send className="size-3.5" />
              Testar notificação
            </>
          )}
        </button>

        <button
          onClick={desativarTudo}
          disabled={!isAtivo}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors',
            isAtivo
              ? 'border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10'
              : 'cursor-not-allowed border-border bg-card text-muted-foreground/40',
          )}
        >
          <BellOff className="size-3.5" />
          Desativar todas
        </button>
      </div>
    </div>
  )
}
