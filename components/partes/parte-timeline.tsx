import { UserPlus, Link2, FileText, RefreshCw, Scale } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Parte } from '@/types/partes'

interface TimelineEvent {
  id: string
  icon: React.ReactNode
  description: string
  date: string
  author: string
}

function buildTimeline(parte: Parte): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: 'cadastro',
      icon: <UserPlus className="size-4 text-primary" />,
      description: 'Parte cadastrada no sistema',
      date: parte.criadoEm,
      author: 'Dr. Leandro',
    },
  ]

  // Add process linking events
  parte.processosVinculados.forEach((proc, index) => {
    const date = new Date(parte.criadoEm)
    date.setDate(date.getDate() + (index + 1) * 3)
    events.push({
      id: `proc-${proc.id}`,
      icon: <Link2 className="size-4 text-emerald-400" />,
      description: `Vinculada ao processo ${proc.numero} como ${proc.papel}`,
      date: date.toISOString(),
      author: 'Dr. Leandro',
    })
  })

  // Add observation event if exists
  if (parte.observacoes) {
    const date = new Date(parte.criadoEm)
    date.setDate(date.getDate() + 7)
    events.push({
      id: 'obs',
      icon: <FileText className="size-4 text-amber-400" />,
      description: 'Observação adicionada ao cadastro',
      date: date.toISOString(),
      author: 'Dr. Leandro',
    })
  }

  // Add update event
  if (parte.atualizadoEm !== parte.criadoEm) {
    events.push({
      id: 'update',
      icon: <RefreshCw className="size-4 text-zinc-400" />,
      description: 'Dados atualizados',
      date: parte.atualizadoEm,
      author: 'Dr. Leandro',
    })
  }

  // Add situação update for réus
  if (parte.tipo === 'reu' && parte.situacaoPrisional) {
    const labelMap = {
      preso: 'Situação prisional registrada como Preso',
      solto: 'Situação registrada como Solto',
      monitorado: 'Monitoramento eletrônico ativado',
    }
    const date = new Date(parte.criadoEm)
    date.setDate(date.getDate() + 2)
    events.push({
      id: 'situacao',
      icon: <Scale className="size-4 text-red-400" />,
      description: labelMap[parte.situacaoPrisional],
      date: date.toISOString(),
      author: 'Dr. Leandro',
    })
  }

  // Sort chronologically
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function relativeDate(isoDate: string): string {
  try {
    return formatDistanceToNow(new Date(isoDate), { addSuffix: true, locale: ptBR })
  } catch {
    return isoDate
  }
}

interface ParteTimelineProps {
  parte: Parte
}

export function ParteTimeline({ parte }: ParteTimelineProps) {
  const events = buildTimeline(parte)

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-5 text-sm font-semibold text-zinc-50">Histórico de atividades</h3>
      <div className="space-y-0">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-4">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
                {event.icon}
              </div>
              {index < events.length - 1 && (
                <div className="mt-1 w-px flex-1 bg-zinc-800" style={{ minHeight: '24px' }} />
              )}
            </div>

            {/* Content */}
            <div className={index < events.length - 1 ? 'pb-6' : 'pb-0'}>
              <p className="text-sm text-zinc-300">{event.description}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-zinc-600">
                <span>{event.author}</span>
                <span>·</span>
                <span>{relativeDate(event.date)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
