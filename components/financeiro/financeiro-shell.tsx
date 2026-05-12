'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  TrendingUp,
  Banknote,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Parcela, StatusParcela } from '@/types/financeiro'
import { BadgeStatusParcela } from './badge-status-parcela'

function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(iso: string) {
  return new Date(iso + (iso.length === 10 ? 'T12:00:00' : '')).toLocaleDateString('pt-BR')
}

function diasAtraso(vencimento: string): number {
  const hoje = new Date('2026-05-12T12:00:00')
  const venc = new Date(vencimento + 'T12:00:00')
  return Math.max(0, Math.floor((hoje.getTime() - venc.getTime()) / (1000 * 60 * 60 * 24)))
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────

function KpiCards({ parcelas }: { parcelas: Parcela[] }) {
  const HOJE = new Date('2026-05-12T12:00:00')
  const MES_ATUAL_START = new Date('2026-05-01T00:00:00')
  const MES_ANTERIOR_START = new Date('2026-04-01T00:00:00')
  const MES_ANTERIOR_END = new Date('2026-04-30T23:59:59')
  const TRINTA_DIAS = new Date('2026-06-11T23:59:59')

  const inadimplencia = parcelas
    .filter((p) => p.status === 'atrasado')
    .reduce((s, p) => s + p.valor, 0)

  const faturamentoMes = parcelas
    .filter((p) => {
      if (p.status !== 'pago' || !p.pago) return false
      const d = new Date(p.pago.data + 'T12:00:00')
      return d >= MES_ATUAL_START && d <= HOJE
    })
    .reduce((s, p) => s + p.valor, 0)

  const faturamentoAnterior = parcelas
    .filter((p) => {
      if (p.status !== 'pago' || !p.pago) return false
      const d = new Date(p.pago.data + 'T12:00:00')
      return d >= MES_ANTERIOR_START && d <= MES_ANTERIOR_END
    })
    .reduce((s, p) => s + p.valor, 0)

  const aReceberProximos = parcelas
    .filter((p) => {
      if (p.status !== 'em_aberto') return false
      const d = new Date(p.vencimento + 'T12:00:00')
      return d >= HOJE && d <= TRINTA_DIAS
    })
    .reduce((s, p) => s + p.valor, 0)

  const diffPct =
    faturamentoAnterior > 0
      ? ((faturamentoMes - faturamentoAnterior) / faturamentoAnterior) * 100
      : null

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Inadimplência */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium text-red-400/80">Inadimplência</p>
          <AlertCircle className="size-4 text-red-400/60" />
        </div>
        <p className="mt-2 text-2xl font-bold tabular-nums text-red-300">
          {formatBRL(inadimplencia)}
        </p>
        <p className="mt-0.5 text-xs text-red-400/60">
          {parcelas.filter((p) => p.status === 'atrasado').length} parcela(s) em atraso
        </p>
      </div>

      {/* Faturamento do mês */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium text-zinc-400">Faturamento — Maio/26</p>
          <Banknote className="size-4 text-zinc-600" />
        </div>
        <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-50">
          {formatBRL(faturamentoMes)}
        </p>
        {diffPct !== null && (
          <p
            className={cn(
              'mt-0.5 text-xs',
              diffPct >= 0 ? 'text-emerald-400' : 'text-red-400',
            )}
          >
            {diffPct >= 0 ? '+' : ''}
            {diffPct.toFixed(1)}% vs abril/26 ({formatBRL(faturamentoAnterior)})
          </p>
        )}
        {diffPct === null && (
          <p className="mt-0.5 text-xs text-zinc-600">Sem referência no mês anterior</p>
        )}
      </div>

      {/* A receber */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium text-zinc-400">A Receber (30 dias)</p>
          <TrendingUp className="size-4 text-zinc-600" />
        </div>
        <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-50">
          {formatBRL(aReceberProximos)}
        </p>
        <p className="mt-0.5 text-xs text-zinc-600">
          {parcelas.filter((p) => {
            if (p.status !== 'em_aberto') return false
            const d = new Date(p.vencimento + 'T12:00:00')
            return d >= HOJE && d <= TRINTA_DIAS
          }).length}{' '}
          parcela(s) nos próximos 30 dias
        </p>
      </div>
    </div>
  )
}

// ─── Clientes inadimplentes ────────────────────────────────────────────────────

function InadimplenciaDetalhe({ parcelas }: { parcelas: Parcela[] }) {
  const atrasadas = parcelas.filter((p) => p.status === 'atrasado')
  if (atrasadas.length === 0) return null

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-zinc-200">Clientes com parcelas em atraso</h2>
      <div className="overflow-x-auto rounded-xl border border-red-500/20 bg-red-500/5">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-red-500/20">
            <tr>
              {['Cliente', 'Processo', 'Parcela', 'Vencimento', 'Valor', 'Atraso'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-red-400/60"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-red-500/10">
            {atrasadas
              .sort((a, b) => {
                const da = diasAtraso(a.vencimento)
                const db = diasAtraso(b.vencimento)
                return db - da
              })
              .map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2.5 font-medium text-zinc-200">{p.clienteNome}</td>
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/processos/${p.processoId}`}
                      className="flex items-center gap-1 text-indigo-400 hover:underline"
                    >
                      {p.processoAlcunha}
                      <ExternalLink className="size-3 shrink-0" />
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-zinc-400">Parcela {p.numero}</td>
                  <td className="px-4 py-2.5 text-zinc-400">{formatDate(p.vencimento)}</td>
                  <td className="px-4 py-2.5 font-semibold tabular-nums text-red-300">
                    {formatBRL(p.valor)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs font-medium text-red-400">
                      {diasAtraso(p.vencimento)}d
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot className="border-t border-red-500/20">
            <tr>
              <td colSpan={4} className="px-4 py-2.5 text-xs font-medium text-red-400/70">
                Total inadimplente
              </td>
              <td className="px-4 py-2.5 font-bold tabular-nums text-red-300">
                {formatBRL(atrasadas.reduce((s, p) => s + p.valor, 0))}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}

// ─── Filtros + tabela ─────────────────────────────────────────────────────────

const STATUS_FILTRO: { value: StatusParcela | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'em_aberto', label: 'Em aberto' },
  { value: 'pago', label: 'Pago' },
  { value: 'atrasado', label: 'Atrasado' },
]

function TabelaParcelas({ parcelas }: { parcelas: Parcela[] }) {
  const [statusFiltro, setStatusFiltro] = useState<StatusParcela | 'todos'>('todos')
  const [busca, setBusca] = useState('')

  const filtradas = useMemo(() => {
    return parcelas.filter((p) => {
      const matchStatus = statusFiltro === 'todos' || p.status === statusFiltro
      const q = busca.toLowerCase()
      const matchBusca =
        !q ||
        p.clienteNome.toLowerCase().includes(q) ||
        p.processoAlcunha.toLowerCase().includes(q)
      return matchStatus && matchBusca
    })
  }, [parcelas, statusFiltro, busca])

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-200">Todas as parcelas</h2>
        <div className="flex flex-wrap items-center gap-2">
          {/* Busca */}
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar cliente ou processo…"
            className="h-8 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-xs text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {/* Filtros status */}
          <div className="flex gap-1">
            {STATUS_FILTRO.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFiltro(f.value)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                  statusFiltro === f.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              {['Cliente', 'Processo', 'Parcela', 'Vencimento', 'Valor', 'Status'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 bg-zinc-950">
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-500">
                  Nenhuma parcela encontrada
                </td>
              </tr>
            )}
            {filtradas
              .sort((a, b) => a.vencimento.localeCompare(b.vencimento))
              .map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-zinc-900/60">
                  <td className="px-4 py-3 font-medium text-zinc-200">{p.clienteNome}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/processos/${p.processoId}`}
                      className="flex items-center gap-1 text-indigo-400 hover:underline"
                    >
                      {p.processoAlcunha}
                      <ExternalLink className="size-3 shrink-0" />
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">#{p.numero}</td>
                  <td className="px-4 py-3 text-zinc-400">{formatDate(p.vencimento)}</td>
                  <td className="px-4 py-3 font-semibold tabular-nums text-zinc-200">
                    {formatBRL(p.valor)}
                  </td>
                  <td className="px-4 py-3">
                    <BadgeStatusParcela status={p.status} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="border-t border-zinc-800 bg-zinc-900 px-4 py-2 text-right text-xs text-zinc-600">
          {filtradas.length} parcela(s) · Total:{' '}
          <strong className="text-zinc-400">
            {formatBRL(filtradas.reduce((s, p) => s + p.valor, 0))}
          </strong>
        </div>
      </div>
    </section>
  )
}

// ─── Shell principal ──────────────────────────────────────────────────────────

export function FinanceiroShell({ parcelas }: { parcelas: Parcela[] }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-cinzel text-lg font-semibold tracking-wide text-zinc-50">
          Módulo Financeiro
        </h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          Visão consolidada de honorários, parcelas e inadimplência
        </p>
      </div>

      <KpiCards parcelas={parcelas} />
      <InadimplenciaDetalhe parcelas={parcelas} />
      <TabelaParcelas parcelas={parcelas} />
    </div>
  )
}
