'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Clock,
  FileText,
  Banknote,
  CalendarClock,
  ExternalLink,
  Scale,
  User,
  MapPin,
  Gavel,
  UserCheck,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BadgeFaseProcessual } from '@/components/processos/badge-fase-processual'
import { BadgeSigilo } from '@/components/processos/badge-sigilo'
import type { Processo } from '@/types/processos'

const TABS = [
  { id: 'resumo', label: 'Resumo', icon: Scale },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'documentos', label: 'Documentos', icon: FileText },
  { id: 'financeiro', label: 'Financeiro', icon: Banknote },
  { id: 'prazos', label: 'Prazos', icon: CalendarClock },
] as const

type TabId = (typeof TABS)[number]['id']

// ─── Placeholder tab ──────────────────────────────────────────────────────────
function PlaceholderTab({
  icon: Icon,
  title,
  milestone,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  milestone: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-zinc-800">
        <Icon className="size-6 text-zinc-600" />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-400">{title}</p>
      <p className="mt-1 text-xs text-zinc-600">{milestone}</p>
    </div>
  )
}

// ─── Resumo Tab ───────────────────────────────────────────────────────────────
function ResumoTab({ processo }: { processo: Processo }) {
  const parteLabels: Record<string, string> = {
    cliente: 'Cliente',
    reu: 'Réu',
    vitima: 'Vítima',
    testemunha: 'Testemunha',
  }

  const partesByRole = {
    cliente: processo.partes.filter((p) => p.papel === 'cliente'),
    reu: processo.partes.filter((p) => p.papel === 'reu'),
    vitima: processo.partes.filter((p) => p.papel === 'vitima'),
    testemunha: processo.partes.filter((p) => p.papel === 'testemunha'),
  }

  return (
    <div className="space-y-8">
      {/* Dados do processo */}
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-500">
          Dados do processo
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Tribunal */}
          <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
            <Gavel className="mt-0.5 size-4 shrink-0 text-zinc-500" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                Tribunal
              </p>
              <p className="mt-0.5 text-sm text-zinc-200">{processo.tribunal}</p>
            </div>
          </div>

          {/* Comarca */}
          <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-zinc-500" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                Comarca
              </p>
              <p className="mt-0.5 text-sm text-zinc-200">{processo.comarca}</p>
            </div>
          </div>

          {/* Vara */}
          <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
            <Scale className="mt-0.5 size-4 shrink-0 text-zinc-500" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                Vara
              </p>
              <p className="mt-0.5 text-sm text-zinc-200">{processo.vara}</p>
            </div>
          </div>

          {/* Juiz */}
          {processo.juiz && (
            <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
              <User className="mt-0.5 size-4 shrink-0 text-zinc-500" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                  Juiz(a)
                </p>
                <p className="mt-0.5 text-sm text-zinc-200">{processo.juiz}</p>
              </div>
            </div>
          )}

          {/* Responsável */}
          <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
            <UserCheck className="mt-0.5 size-4 shrink-0 text-zinc-500" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                Responsável interno
              </p>
              <p className="mt-0.5 text-sm text-zinc-200">{processo.responsavelInterno}</p>
            </div>
          </div>

          {/* Fase */}
          <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
            <Shield className="mt-0.5 size-4 shrink-0 text-zinc-500" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                Fase / Sigilo
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <BadgeFaseProcessual fase={processo.faseAtual} />
                <BadgeSigilo sigilo={processo.sigilo} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tipos penais */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
          Tipificação penal
        </p>
        <div className="space-y-2">
          {processo.tiposPenais.map((tipo) => (
            <div
              key={tipo.id}
              className={cn(
                'flex items-center justify-between rounded-xl border px-4 py-3',
                tipo.principal
                  ? 'border-indigo-800/60 bg-indigo-950/30'
                  : 'border-zinc-800 bg-zinc-950/50',
              )}
            >
              <div>
                <span className="text-sm font-medium text-zinc-200">{tipo.artigo}</span>
                <span className="ml-2 text-sm text-zinc-400">{tipo.descricao}</span>
              </div>
              {tipo.principal && (
                <span className="rounded-full border border-indigo-700 bg-indigo-900 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Partes vinculadas */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
          Partes vinculadas
        </p>
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/40">
                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  Papel
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {(['cliente', 'reu', 'vitima', 'testemunha'] as const).map((papel) =>
                partesByRole[papel].map((parte) => (
                  <tr
                    key={`${papel}-${parte.parteId}`}
                    className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/40 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/partes/${parte.parteId}`}
                        className="text-sm font-medium text-zinc-200 transition-colors hover:text-indigo-400"
                      >
                        {parte.nome}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                        {parteLabels[parte.papel]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/partes/${parte.parteId}`}
                        className="inline-flex items-center gap-1 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                    </td>
                  </tr>
                )),
              )}
              {processo.partes.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-zinc-600">
                    Nenhuma parte vinculada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observações */}
      {processo.observacoes && (
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
            Observações
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
            <p className="text-sm leading-relaxed text-zinc-400">{processo.observacoes}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface ProcessoDetailTabsProps {
  processo: Processo
}

export function ProcessoDetailTabs({ processo }: ProcessoDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('resumo')

  return (
    <div>
      {/* Tab nav */}
      <div className="flex overflow-x-auto border-b border-zinc-800">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-indigo-500 text-zinc-50'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300',
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'resumo' && <ResumoTab processo={processo} />}
        {activeTab === 'timeline' && (
          <PlaceholderTab
            icon={Clock}
            title="Timeline de andamentos"
            milestone="Disponível em breve (M7)"
          />
        )}
        {activeTab === 'documentos' && (
          <PlaceholderTab
            icon={FileText}
            title="Gestão de documentos"
            milestone="Disponível em breve (M8)"
          />
        )}
        {activeTab === 'financeiro' && (
          <PlaceholderTab
            icon={Banknote}
            title="Módulo financeiro"
            milestone="Disponível em breve (M9)"
          />
        )}
        {activeTab === 'prazos' && (
          <PlaceholderTab
            icon={CalendarClock}
            title="Agenda de prazos"
            milestone="Disponível em breve (M5)"
          />
        )}
      </div>
    </div>
  )
}
