'use client'

// NOTE: This is intentionally a client boundary because ProcessoDetailActions
// needs useState for the edit drawer. The data fetching is synchronous (mock).

import { useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, AlertTriangle, Pencil } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getProcessoById } from '@/lib/data/processos'
import { getParteById } from '@/lib/data/partes'
import { BadgeFaseProcessual } from '@/components/processos/badge-fase-processual'
import { BadgeSigilo } from '@/components/processos/badge-sigilo'
import { ProcessoDetailTabs } from '@/components/processos/processo-detail-tabs'
import { NovoProcessoDrawer } from '@/components/processos/novo-processo-drawer'
import { Button } from '@/components/ui/button'
import { use } from 'react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ProcessoDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const processo = getProcessoById(id)

  const [drawerOpen, setDrawerOpen] = useState(false)

  if (!processo) {
    notFound()
  }

  const criadoEm = (() => {
    try {
      return format(new Date(processo.criadoEm), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch {
      return processo.criadoEm
    }
  })()

  // Detect if any reu is preso
  const reuPreso = processo.partes
    .filter((p) => p.papel === 'reu')
    .map((p) => ({ ...p, parte: getParteById(p.parteId) }))
    .find((p) => p.parte?.situacaoPrisional === 'preso')

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <Link
          href="/processos"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="size-4" />
          Processos
        </Link>
      </div>

      {/* Réu preso banner */}
      {reuPreso && (
        <div className="flex items-start gap-3 rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-400" />
          <div>
            <p className="text-sm font-semibold text-red-300">Réu preso</p>
            <p className="mt-0.5 text-sm text-red-400">
              {reuPreso.nome} está preso preventivamente
              {reuPreso.parte?.unidadePrisional && (
                <> em <strong className="font-medium">{reuPreso.parte.unidadePrisional}</strong></>
              )}
              .
            </p>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-50">{processo.alcunha}</h1>
          <p className="font-mono text-sm text-zinc-400">{processo.numeroCNJ}</p>
          <div className="flex flex-wrap items-center gap-2">
            <BadgeFaseProcessual fase={processo.faseAtual} />
            <BadgeSigilo sigilo={processo.sigilo} />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-zinc-500">
            <CalendarDays className="size-4" />
            <span>Cadastrado em {criadoEm}</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setDrawerOpen(true)}
          className="shrink-0"
        >
          <Pencil className="size-4" />
          Editar processo
        </Button>
      </div>

      {/* Tabs card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <ProcessoDetailTabs processo={processo} />
      </div>

      {/* Edit drawer */}
      <NovoProcessoDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        processo={processo}
        mode="edit"
      />
    </div>
  )
}
