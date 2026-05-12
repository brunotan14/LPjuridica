'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
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
import { AndamentosTimeline } from '@/components/andamentos/andamentos-timeline'
import { RegistrarAndamentoForm } from '@/components/andamentos/registrar-andamento-form'
import { getAndamentosByProcesso } from '@/lib/data/andamentos'
import { EventoRow } from '@/components/agenda/evento-row'
import { MarcarCumpridoModal } from '@/components/agenda/marcar-cumprido-modal'
import { MarcarPerdidoModal } from '@/components/agenda/marcar-perdido-modal'
import { NovoEventoDrawer } from '@/components/agenda/novo-evento-drawer'
import { getEventosByProcesso } from '@/lib/data/agenda'
import { DocumentosTable } from '@/components/documentos/documentos-table'
import { AdicionarDocumentoModal } from '@/components/documentos/adicionar-documento-modal'
import { DocumentoDetalheModal } from '@/components/documentos/documento-detalhe-modal'
import { NovaVersaoModal } from '@/components/documentos/nova-versao-modal'
import { getDocumentosByProcesso } from '@/lib/data/documentos'
import { FinanceiroTab } from '@/components/financeiro/financeiro-tab'
import type { Processo } from '@/types/processos'
import type { Andamento } from '@/types/andamentos'
import type { Evento } from '@/types/agenda'
import type { Documento } from '@/types/documentos'

const TABS = [
  { id: 'resumo', label: 'Resumo', icon: Scale },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'documentos', label: 'Documentos', icon: FileText },
  { id: 'financeiro', label: 'Financeiro', icon: Banknote },
  { id: 'prazos', label: 'Prazos', icon: CalendarClock },
] as const

type TabId = (typeof TABS)[number]['id']

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
                  ? 'border-[#2a1f08]/60 bg-[#1a1408]/30'
                  : 'border-zinc-800 bg-zinc-950/50',
              )}
            >
              <div>
                <span className="text-sm font-medium text-zinc-200">{tipo.artigo}</span>
                <span className="ml-2 text-sm text-zinc-400">{tipo.descricao}</span>
              </div>
              {tipo.principal && (
                <span className="rounded-full border border-[#3a2d0a] bg-[#100c04] px-2 py-0.5 text-[10px] font-medium text-[#e8d09a]">
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
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
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
                        className="text-sm font-medium text-zinc-200 transition-colors hover:text-primary"
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

// ─── Timeline Tab ─────────────────────────────────────────────────────────────

function TimelineTab({ processo }: { processo: Processo }) {
  const [andamentos, setAndamentos] = useState<Andamento[]>(
    () => getAndamentosByProcesso(processo.id),
  )
  const [formAberto, setFormAberto] = useState(false)

  function handleRegistrar(novoAndamento: Andamento) {
    setAndamentos((prev) =>
      [novoAndamento, ...prev].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
      ),
    )
    setFormAberto(false)
  }

  function handleExcluir(id: string) {
    setAndamentos((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de registrar */}
      {andamentos.length > 0 && !formAberto && (
        <div className="flex justify-end">
          <button
            onClick={() => setFormAberto(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            <Plus className="size-4" />
            Registrar andamento
          </button>
        </div>
      )}

      {/* Formulário inline */}
      {formAberto && (
        <RegistrarAndamentoForm
          processoId={processo.id}
          onRegistrar={handleRegistrar}
          onCancelar={() => setFormAberto(false)}
        />
      )}

      {/* Timeline */}
      <AndamentosTimeline
        andamentos={andamentos}
        onRegistrar={() => setFormAberto(true)}
        onExcluir={handleExcluir}
      />
    </div>
  )
}

// ─── Prazos Tab ───────────────────────────────────────────────────────────────

function PrazosTab({ processo }: { processo: Processo }) {
  const [eventos, setEventos] = useState<Evento[]>(() => getEventosByProcesso(processo.id))
  const [drawerAberto, setDrawerAberto] = useState(false)
  const [eventoParaCumprir, setEventoParaCumprir] = useState<Evento | null>(null)
  const [eventoParaPerder, setEventoParaPerder] = useState<Evento | null>(null)

  function handleCumprir(eventoId: string, descricao: string) {
    setEventos((prev) =>
      prev.map((ev) =>
        ev.id === eventoId
          ? { ...ev, status: 'cumprido' as const, descricaoCumprimento: descricao }
          : ev,
      ),
    )
  }

  function handlePerder(eventoId: string, justificativa: string) {
    setEventos((prev) =>
      prev.map((ev) =>
        ev.id === eventoId
          ? { ...ev, status: 'perdido' as const, justificativaPerdido: justificativa }
          : ev,
      ),
    )
  }

  const pendentes = eventos
    .filter((ev) => ev.status === 'pendente' || ev.status === 'agendado')
    .sort((a, b) => (a.dataFim ?? a.data).localeCompare(b.dataFim ?? b.data))

  const concluidos = eventos
    .filter(
      (ev) =>
        ev.status === 'cumprido' ||
        ev.status === 'realizado' ||
        ev.status === 'perdido' ||
        ev.status === 'cancelado',
    )
    .sort((a, b) => (b.dataFim ?? b.data).localeCompare(a.dataFim ?? a.data))

  return (
    <>
      <NovoEventoDrawer
        open={drawerAberto}
        onOpenChange={setDrawerAberto}
        defaultProcessoId={processo.id}
      />
      <MarcarCumpridoModal
        evento={eventoParaCumprir}
        onClose={() => setEventoParaCumprir(null)}
        onConfirm={handleCumprir}
      />
      <MarcarPerdidoModal
        evento={eventoParaPerder}
        onClose={() => setEventoParaPerder(null)}
        onConfirm={handlePerder}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-end">
          <button
            onClick={() => setDrawerAberto(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            <Plus className="size-4" />
            Novo evento
          </button>
        </div>

        {eventos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-zinc-800">
              <CalendarClock className="size-6 text-zinc-600" />
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-400">Nenhum evento vinculado</p>
            <p className="mt-1 text-xs text-zinc-600">
              Adicione prazos, audiências ou outros eventos para este processo.
            </p>
            <button
              onClick={() => setDrawerAberto(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              <Plus className="size-4" />
              Novo evento
            </button>
          </div>
        ) : (
          <>
            {pendentes.length > 0 && (
              <section className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Próximos e pendentes
                </p>
                {pendentes.map((ev) => (
                  <EventoRow
                    key={ev.id}
                    evento={ev}
                    onCumprir={(e) => setEventoParaCumprir(e)}
                    onPerder={(e) => setEventoParaPerder(e)}
                  />
                ))}
              </section>
            )}

            {concluidos.length > 0 && (
              <section className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Concluídos e perdidos
                </p>
                {concluidos.map((ev) => (
                  <EventoRow key={ev.id} evento={ev} />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </>
  )
}

// ─── Documentos Tab ───────────────────────────────────────────────────────────

function DocumentosTab({ processo }: { processo: Processo }) {
  const [documentos, setDocumentos] = useState<Documento[]>(
    () => getDocumentosByProcesso(processo.id),
  )
  const [modalAberto, setModalAberto] = useState(false)
  const [documentoDetalhe, setDocumentoDetalhe] = useState<Documento | null>(null)
  const [documentoNovaVersao, setDocumentoNovaVersao] = useState<Documento | null>(null)

  function handleAdicionar(novoDoc: Documento) {
    setDocumentos((prev) => [novoDoc, ...prev])
    setModalAberto(false)
  }

  function handleNovaVersao(docAtualizado: Documento) {
    setDocumentos((prev) => prev.map((d) => (d.id === docAtualizado.id ? docAtualizado : d)))
    setDocumentoNovaVersao(null)
  }

  return (
    <>
      {modalAberto && (
        <AdicionarDocumentoModal
          processoId={processo.id}
          onAdicionar={handleAdicionar}
          onFechar={() => setModalAberto(false)}
        />
      )}

      {documentoDetalhe && (
        <DocumentoDetalheModal
          documento={documentoDetalhe}
          onFechar={() => setDocumentoDetalhe(null)}
        />
      )}

      {documentoNovaVersao && (
        <NovaVersaoModal
          documento={documentoNovaVersao}
          onNovaVersao={handleNovaVersao}
          onFechar={() => setDocumentoNovaVersao(null)}
        />
      )}

      <div className="space-y-4">
        {/* Header */}
        {documentos.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={() => setModalAberto(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              <FileText className="size-4" />
              Adicionar documento
            </button>
          </div>
        )}

        <DocumentosTable
          documentos={documentos}
          onAdicionar={() => setModalAberto(true)}
          onVisualizar={(doc) => setDocumentoDetalhe(doc)}
          onBaixar={(doc) => setDocumentoDetalhe(doc)}
          onNovaVersao={(doc) => setDocumentoNovaVersao(doc)}
        />
      </div>
    </>
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
                  ? 'border-primary text-zinc-50'
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
        {activeTab === 'timeline' && <TimelineTab processo={processo} />}
        {activeTab === 'documentos' && <DocumentosTab processo={processo} />}
        {activeTab === 'financeiro' && <FinanceiroTab processo={processo} />}
        {activeTab === 'prazos' && <PrazosTab processo={processo} />}
      </div>
    </div>
  )
}
