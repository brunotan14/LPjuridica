import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getParteById } from '@/lib/data/partes'
import { BadgeTipoParte } from '@/components/partes/badge-tipo-parte'
import { ParteDetailTabs, MultipleRolesIndicator } from '@/components/partes/parte-detail-tabs'
import { ParteTimeline } from '@/components/partes/parte-timeline'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const parte = getParteById(id)
  return {
    title: parte ? `${parte.nome} | LP Jurídica` : 'Parte não encontrada | LP Jurídica',
  }
}

export default async function ParteDetailPage({ params }: PageProps) {
  const { id } = await params
  const parte = getParteById(id)

  if (!parte) {
    notFound()
  }

  const criadoEm = (() => {
    try {
      return format(new Date(parte.criadoEm), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch {
      return parte.criadoEm
    }
  })()

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <Link
          href="/partes"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="size-4" />
          Partes
        </Link>
      </div>

      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-zinc-50">{parte.nome}</h1>
            <BadgeTipoParte tipo={parte.tipo} />
            <MultipleRolesIndicator parte={parte} />
          </div>

          <div className="flex items-center gap-1.5 text-sm text-zinc-500">
            <CalendarDays className="size-4" />
            <span>Cadastrado em {criadoEm}</span>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={
            parte.status === 'ativo'
              ? 'inline-flex items-center rounded-full border border-emerald-900 bg-emerald-950 px-3 py-1 text-sm font-medium text-emerald-400'
              : 'inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-sm font-medium text-zinc-500'
          }
        >
          {parte.status === 'ativo' ? 'Ativo' : 'Arquivado'}
        </span>
      </div>

      {/* Tabs card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <ParteDetailTabs parte={parte} />
      </div>

      {/* Timeline — always visible */}
      <ParteTimeline parte={parte} />
    </div>
  )
}
