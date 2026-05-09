import {
  differenceInCalendarDays,
  isSameDay,
  parseISO,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  format,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Criticidade, Evento } from '@/types/agenda'

export function calcularCriticidade(
  evento: Evento,
  hoje: Date = new Date()
): Criticidade {
  if (
    evento.status === 'cumprido' ||
    evento.status === 'realizado' ||
    evento.status === 'cancelado'
  ) {
    return 'concluido'
  }
  if (evento.status === 'perdido') return 'perdido'

  const data = parseISO(evento.dataFim ?? evento.data)
  const diff = differenceInCalendarDays(data, hoje)

  if (diff < 0) {
    // Vencido sem ação: prazos viram perdido; demais tipos consideramos concluídos
    return evento.tipo === 'prazo' ? 'perdido' : 'concluido'
  }
  if (diff === 0) return 'hoje'
  if (diff <= 3) return 'critica'
  if (diff <= 7) return 'proxima'
  return 'futuro'
}

export function eventosDoDia(eventos: Evento[], dia: Date = new Date()) {
  return eventos
    .filter((ev) => isSameDay(parseISO(ev.data), dia))
    .sort((a, b) => (a.hora ?? '00:00').localeCompare(b.hora ?? '00:00'))
}

export function eventosDaSemana(eventos: Evento[], hoje: Date = new Date()) {
  const inicio = startOfWeek(hoje, { weekStartsOn: 0 })
  const fim = endOfWeek(hoje, { weekStartsOn: 0 })
  return eventos
    .filter((ev) => isWithinInterval(parseISO(ev.data), { start: inicio, end: fim }))
    .sort((a, b) => {
      const t = parseISO(a.data).getTime() - parseISO(b.data).getTime()
      return t !== 0 ? t : (a.hora ?? '').localeCompare(b.hora ?? '')
    })
}

export function agruparPorDia(eventos: Evento[]) {
  const grupos = new Map<string, Evento[]>()
  for (const ev of eventos) {
    const chave = ev.data
    if (!grupos.has(chave)) grupos.set(chave, [])
    grupos.get(chave)!.push(ev)
  }
  return Array.from(grupos.entries())
    .map(([dia, items]) => ({ dia, items }))
    .sort((a, b) => a.dia.localeCompare(b.dia))
}

export function formatarDiaLongo(isoDate: string) {
  return format(parseISO(isoDate), "EEEE, d 'de' MMMM", { locale: ptBR })
}

export function formatarDiaCurto(isoDate: string) {
  return format(parseISO(isoDate), "d 'de' MMM", { locale: ptBR })
}

export function contarPrazosCriticosHoje(eventos: Evento[], hoje = new Date()) {
  return eventos.filter(
    (ev) =>
      ev.tipo === 'prazo' &&
      ev.status === 'pendente' &&
      calcularCriticidade(ev, hoje) === 'hoje'
  ).length
}
