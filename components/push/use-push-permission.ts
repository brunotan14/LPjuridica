'use client'

import { useState, useEffect } from 'react'

export type PushStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'dismissed'

const DISMISSED_KEY = 'lp_push_dismissed'

function safeReadDismissed(): boolean {
  try { return localStorage.getItem(DISMISSED_KEY) === 'true' } catch { return false }
}
function safeWriteDismissed() {
  try { localStorage.setItem(DISMISSED_KEY, 'true') } catch { /* private mode */ }
}

export function usePushPermission() {
  const [status, setStatus] = useState<PushStatus>('idle')

  useEffect(() => {
    Promise.resolve().then(async () => {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        setStatus('denied')
        return
      }
      const perm = Notification.permission
      if (perm === 'granted') {
        // Re-registra o SW em toda visita para captar updates do sw.js
        try { await navigator.serviceWorker.register('/sw.js') } catch { /* ignore */ }
        setStatus('granted')
        return
      }
      if (perm === 'denied') { setStatus('denied'); return }
      if (safeReadDismissed()) { setStatus('dismissed'); return }
    })
  }, [])

  async function requestPermission() {
    if (!('Notification' in window)) return

    setStatus('requesting')

    if ('serviceWorker' in navigator) {
      try { await navigator.serviceWorker.register('/sw.js') } catch { /* ignore */ }
    }

    try {
      const result = await Notification.requestPermission()
      setStatus(result === 'granted' ? 'granted' : 'denied')
    } catch {
      setStatus('denied')
    }
  }

  function dismiss() {
    safeWriteDismissed()
    setStatus('dismissed')
  }

  return { status, requestPermission, dismiss }
}
