// Recebe o push do servidor e exibe a notificação nativa do browser
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()

  event.waitUntil(
    self.registration.showNotification(data.title ?? 'LP Jurídica', {
      body: data.body ?? '',
      tag: data.tag ?? 'lp-juridica',
      data: { url: data.url ?? '/dashboard' },
    }),
  )
})

// Quando o usuário clica na notificação: foca aba existente e navega, ou abre nova
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const targetUrl = event.notification.data?.url ?? '/dashboard'

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(async (clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            await client.focus()
            if ('navigate' in client) {
              try { await client.navigate(targetUrl) } catch { /* cross-origin */ }
            }
            return
          }
        }
        return clients.openWindow(targetUrl)
      }),
  )
})
