import { NAV_ITEMS, type NavItem } from './nav'
import { eventosMock } from './data/agenda'
import { contarPrazosCriticosHoje, calcularCriticidade } from './agenda'

// Computa NAV_ITEMS com badges dinâmicos.
// Etapa M5 — apenas Agenda recebe badge (prazos críticos vencendo hoje + amanhã).
// Quando o backend chegar, esta função vira uma query no Supabase.
export function navItemsComBadges(hoje: Date = new Date()): NavItem[] {
  const prazosHoje = contarPrazosCriticosHoje(eventosMock, hoje)
  const prazosCriticos = eventosMock.filter(
    (ev) =>
      ev.tipo === 'prazo' &&
      ev.status === 'pendente' &&
      ['hoje', 'critica'].includes(calcularCriticidade(ev, hoje))
  ).length

  // Badge mostra prazos hoje + os críticos (D-1 a D-3) — visão de alerta.
  const total = Math.max(prazosHoje, prazosCriticos)

  return NAV_ITEMS.map((item) =>
    item.href === '/agenda' && total > 0 ? { ...item, badge: total } : item
  )
}
