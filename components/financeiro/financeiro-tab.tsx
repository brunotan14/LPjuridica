'use client'

import { useState } from 'react'
import {
  Plus,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  RotateCcw,
  TrendingUp,
  Wallet,
  AlertCircle,
  Receipt,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Processo } from '@/types/processos'
import type {
  ContratoHonorarios,
  Despesa,
  Parcela,
  StatusDespesa,
  FormaPagamento,
} from '@/types/financeiro'
import {
  getContratosByProcessoId,
  getDespesasByProcessoId,
} from '@/lib/data/financeiro'
import { BadgeStatusParcela } from './badge-status-parcela'
import { BadgeTipoContrato } from './badge-tipo-contrato'
import { MarcarParcelaPagaModal } from './marcar-parcela-paga-modal'
import { NovoContratoModal } from './novo-contrato-modal'
import { NovaDespesaModal } from './nova-despesa-modal'

function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(iso: string) {
  return new Date(iso + (iso.length === 10 ? 'T12:00:00' : '')).toLocaleDateString('pt-BR')
}

const GATILHO_LABEL: Record<string, string> = {
  absolvicao: 'Absolvição',
  desclassificacao: 'Desclassificação',
  reducao_de_pena: 'Redução de pena',
}

const CATEGORIA_LABEL: Record<string, string> = {
  custas: 'Custas',
  pericia: 'Perícia',
  viagem: 'Viagem',
  cartorio: 'Cartório',
  outro: 'Outro',
}

// ─── Resumo ───────────────────────────────────────────────────────────────────

function ResumoCards({ contratos, despesas }: { contratos: ContratoHonorarios[]; despesas: Despesa[] }) {
  const totalContratado = contratos
    .filter((c) => c.tipo === 'contratual')
    .reduce((s, c) => s + (c.valorTotal ?? 0), 0)

  const todasParcelas = contratos.flatMap((c) => c.parcelas ?? [])
  const totalRecebido = todasParcelas
    .filter((p) => p.status === 'pago')
    .reduce((s, p) => s + p.valor, 0)
  const totalAReceber = todasParcelas
    .filter((p) => p.status === 'em_aberto')
    .reduce((s, p) => s + p.valor, 0)
  const totalAtrasado = todasParcelas
    .filter((p) => p.status === 'atrasado')
    .reduce((s, p) => s + p.valor, 0)
  const despesasPendentes = despesas
    .filter((d) => d.status === 'pendente')
    .reduce((s, d) => s + d.valor, 0)

  const cards = [
    {
      label: 'Total contratado',
      value: formatBRL(totalContratado),
      icon: Wallet,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      label: 'Total recebido',
      value: formatBRL(totalRecebido),
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'A receber',
      value: formatBRL(totalAReceber),
      icon: TrendingUp,
      color: 'text-zinc-400',
      bg: 'bg-zinc-500/10',
    },
    {
      label: 'Em atraso',
      value: formatBRL(totalAtrasado),
      icon: AlertCircle,
      color: totalAtrasado > 0 ? 'text-red-400' : 'text-zinc-500',
      bg: totalAtrasado > 0 ? 'bg-red-500/10' : 'bg-zinc-500/10',
    },
    {
      label: 'Despesas a reembolsar',
      value: formatBRL(despesasPendentes),
      icon: Receipt,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex flex-col gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 p-3"
        >
          <div className={cn('flex size-7 items-center justify-center rounded-lg', c.bg)}>
            <c.icon className={cn('size-4', c.color)} />
          </div>
          <p className="text-[11px] text-zinc-500">{c.label}</p>
          <p className={cn('text-sm font-semibold tabular-nums', c.color)}>{c.value}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Linha de parcela ─────────────────────────────────────────────────────────

function ParcelaRow({
  parcela,
  onMarcarPaga,
}: {
  parcela: Parcela
  onMarcarPaga: (p: Parcela) => void
}) {
  return (
    <tr className="border-b border-zinc-800/60 last:border-0">
      <td className="py-2 pr-3 tabular-nums text-zinc-400">{parcela.numero}</td>
      <td className="py-2 pr-3 tabular-nums text-zinc-300">{formatBRL(parcela.valor)}</td>
      <td className="py-2 pr-3 text-zinc-400">{formatDate(parcela.vencimento)}</td>
      <td className="py-2 pr-3">
        <BadgeStatusParcela status={parcela.status} />
      </td>
      <td className="py-2 text-right">
        {parcela.status !== 'pago' && (
          <button
            onClick={() => onMarcarPaga(parcela)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/15"
          >
            Marcar paga
          </button>
        )}
        {parcela.status === 'pago' && parcela.pago && (
          <span className="text-xs text-zinc-600">{formatDate(parcela.pago.data)}</span>
        )}
      </td>
    </tr>
  )
}

// ─── Card de contrato ─────────────────────────────────────────────────────────

function ContratoCard({
  contrato,
  onMarcarParcelaPaga,
}: {
  contrato: ContratoHonorarios
  onMarcarParcelaPaga: (p: Parcela) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-800/40"
      >
        {expanded ? (
          <ChevronDown className="size-4 shrink-0 text-zinc-500" />
        ) : (
          <ChevronRight className="size-4 shrink-0 text-zinc-500" />
        )}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <BadgeTipoContrato tipo={contrato.tipo} />
          <span className="text-sm font-medium text-zinc-200">{contrato.parteContratanteNome}</span>
        </div>
        <div className="text-right">
          {contrato.tipo === 'contratual' && contrato.valorTotal !== undefined && (
            <span className="text-sm font-semibold tabular-nums text-zinc-300">
              {formatBRL(contrato.valorTotal)}
            </span>
          )}
          {contrato.tipo === 'exito' && (
            <span className="text-sm text-amber-400">
              {contrato.percentual}% · {GATILHO_LABEL[contrato.gatilho!]}
            </span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 px-4 py-3">
          {contrato.tipo === 'contratual' && contrato.parcelas && contrato.parcelas.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="pb-2 pr-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">#</th>
                    <th className="pb-2 pr-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Valor</th>
                    <th className="pb-2 pr-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Vencimento</th>
                    <th className="pb-2 pr-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Status</th>
                    <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {contrato.parcelas.map((p) => (
                    <ParcelaRow key={p.id} parcela={p} onMarcarPaga={onMarcarParcelaPaga} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {contrato.tipo === 'exito' && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-[10px] text-zinc-600">Gatilho</dt>
                <dd className="text-zinc-300">{GATILHO_LABEL[contrato.gatilho!]}</dd>
              </div>
              <div>
                <dt className="text-[10px] text-zinc-600">Percentual</dt>
                <dd className="text-zinc-300">{contrato.percentual}%</dd>
              </div>
              {contrato.valorEstimado && (
                <div>
                  <dt className="text-[10px] text-zinc-600">Valor estimado</dt>
                  <dd className="text-zinc-300">{formatBRL(contrato.valorEstimado)}</dd>
                </div>
              )}
            </dl>
          )}
          {(contrato.tipo === 'pro_bono' || contrato.tipo === 'dativo') && (
            <p className="text-xs text-zinc-500">
              {contrato.tipo === 'pro_bono'
                ? 'Serviços prestados sem cobrança de honorários.'
                : 'Honorários pagos pelo Estado conforme tabela OAB.'}
            </p>
          )}
          <p className="mt-2 text-[11px] text-zinc-600">
            Criado em {formatDate(contrato.criadoEm)}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Linha de despesa ─────────────────────────────────────────────────────────

function DespesaRow({
  despesa,
  onReembolsar,
}: {
  despesa: Despesa
  onReembolsar: (id: string) => void
}) {
  return (
    <tr className="border-b border-zinc-800/60 last:border-0">
      <td className="py-2.5 pr-3">
        <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
          {CATEGORIA_LABEL[despesa.categoria]}
        </span>
      </td>
      <td className="py-2.5 pr-3 text-sm text-zinc-300">{despesa.descricao}</td>
      <td className="py-2.5 pr-3 tabular-nums text-sm text-zinc-300">{formatBRL(despesa.valor)}</td>
      <td className="py-2.5 pr-3 text-sm text-zinc-400">{formatDate(despesa.data)}</td>
      <td className="py-2.5 pr-3">
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
            despesa.status === 'reembolsado'
              ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
              : 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
          )}
        >
          {despesa.status === 'reembolsado' ? 'Reembolsado' : 'Pendente'}
        </span>
      </td>
      <td className="py-2.5 text-right">
        {despesa.status === 'pendente' && (
          <button
            onClick={() => onReembolsar(despesa.id)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/15"
          >
            <RotateCcw className="inline size-3 mr-1" />
            Marcar reembolsado
          </button>
        )}
        {despesa.status === 'reembolsado' && despesa.reembolsadoEm && (
          <span className="text-xs text-zinc-600">{formatDate(despesa.reembolsadoEm)}</span>
        )}
      </td>
    </tr>
  )
}

// ─── Tab principal ────────────────────────────────────────────────────────────

export function FinanceiroTab({ processo }: { processo: Processo }) {
  const [contratos, setContratos] = useState<ContratoHonorarios[]>(
    () => getContratosByProcessoId(processo.id),
  )
  const [despesas, setDespesas] = useState<Despesa[]>(
    () => getDespesasByProcessoId(processo.id),
  )
  const [parcelaPaga, setParcelaPaga] = useState<Parcela | null>(null)
  const [novoContrato, setNovoContrato] = useState(false)
  const [novaDespesa, setNovaDespesa] = useState(false)

  function handleMarcarParcela(parcelaId: string, data: string, forma: FormaPagamento, obs: string) {
    setContratos((prev) =>
      prev.map((c) => ({
        ...c,
        parcelas: c.parcelas?.map((p) =>
          p.id === parcelaId
            ? { ...p, status: 'pago' as const, pago: { data, forma, observacoes: obs || undefined } }
            : p,
        ),
      })),
    )
  }

  function handleReembolsar(despesaId: string) {
    const hoje = new Date().toISOString().split('T')[0]
    setDespesas((prev) =>
      prev.map((d) =>
        d.id === despesaId
          ? { ...d, status: 'reembolsado' as StatusDespesa, reembolsadoEm: hoje }
          : d,
      ),
    )
  }

  const clientePartes = processo.partes.filter((p) => p.papel === 'cliente')

  return (
    <div className="space-y-8">
      {/* Resumo */}
      <ResumoCards contratos={contratos} despesas={despesas} />

      {/* Contratos */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200">Contratos de Honorários</h3>
          <button
            onClick={() => setNovoContrato(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
          >
            <Plus className="size-3.5" />
            Novo Contrato
          </button>
        </div>

        {contratos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-800 py-10 text-center">
            <Wallet className="size-8 text-zinc-700" />
            <p className="text-sm text-zinc-500">Nenhum contrato cadastrado</p>
            <button
              onClick={() => setNovoContrato(true)}
              className="mt-1 text-xs text-indigo-400 hover:underline"
            >
              Criar primeiro contrato
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {contratos.map((c) => (
              <ContratoCard
                key={c.id}
                contrato={c}
                onMarcarParcelaPaga={setParcelaPaga}
              />
            ))}
          </div>
        )}
      </section>

      {/* Despesas */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200">Despesas Reembolsáveis</h3>
          <button
            onClick={() => setNovaDespesa(true)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-500"
          >
            <Plus className="size-3.5" />
            Nova Despesa
          </button>
        </div>

        {despesas.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-800 py-10 text-center">
            <Receipt className="size-8 text-zinc-700" />
            <p className="text-sm text-zinc-500">Nenhuma despesa registrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900">
                <tr>
                  {['Categoria', 'Descrição', 'Valor', 'Data', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600 last:text-right"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 bg-zinc-950">
                {despesas.map((d) => (
                  <DespesaRow key={d.id} despesa={d} onReembolsar={handleReembolsar} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modais */}
      <MarcarParcelaPagaModal
        parcela={parcelaPaga}
        onClose={() => setParcelaPaga(null)}
        onConfirm={(id, data, forma, obs) => {
          handleMarcarParcela(id, data, forma, obs)
          setParcelaPaga(null)
        }}
      />

      <NovoContratoModal
        open={novoContrato}
        onClose={() => setNovoContrato(false)}
        partes={clientePartes.length > 0 ? clientePartes : processo.partes}
        onConfirm={(payload) => {
          const novoId = `cont-${Date.now()}`
          const novo: ContratoHonorarios = {
            id: novoId,
            processoId: processo.id,
            parteContratanteNome:
              processo.partes.find((p) => p.parteId === payload.parteContratanteId)?.nome ?? '',
            criadoEm: new Date().toISOString(),
            ...payload,
            parcelas:
              payload.tipo === 'contratual' && payload.valorTotal && payload.quantidadeParcelas
                ? gerarParcelas(novoId, processo, payload)
                : undefined,
          }
          setContratos((prev) => [...prev, novo])
        }}
      />

      <NovaDespesaModal
        open={novaDespesa}
        onClose={() => setNovaDespesa(false)}
        onConfirm={(payload) => {
          const nova: Despesa = {
            id: `desp-${Date.now()}`,
            processoId: processo.id,
            status: 'pendente',
            ...payload,
          }
          setDespesas((prev) => [...prev, nova])
        }}
      />
    </div>
  )
}

// ─── Utilitário: gera parcelas para novo contrato ──────────────────────────────

function gerarParcelas(
  contratoId: string,
  processo: Processo,
  payload: {
    valorTotal?: number
    quantidadeParcelas?: number
    dataPrimeiraParcela?: string
    intervalo?: 'mensal' | 'quinzenal'
    parteContratanteId: string
  },
): Parcela[] {
  const { valorTotal, quantidadeParcelas, dataPrimeiraParcela, intervalo } = payload
  if (!valorTotal || !quantidadeParcelas || !dataPrimeiraParcela) return []

  const valorParcela = valorTotal / quantidadeParcelas
  const clienteNome =
    processo.partes.find((p) => p.parteId === payload.parteContratanteId)?.nome ?? ''

  return Array.from({ length: quantidadeParcelas }, (_, i) => {
    const base = new Date(dataPrimeiraParcela + 'T12:00:00')
    if (intervalo === 'quinzenal') {
      base.setDate(base.getDate() + i * 15)
    } else {
      base.setMonth(base.getMonth() + i)
    }
    return {
      id: `parc-new-${contratoId}-${i + 1}`,
      contratoId,
      processoId: processo.id,
      processoAlcunha: processo.alcunha,
      clienteNome,
      numero: i + 1,
      valor: Math.round(valorParcela * 100) / 100,
      vencimento: base.toISOString().split('T')[0],
      status: 'em_aberto' as const,
    }
  })
}
