'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { distribuicaoFase } from '@/lib/data/dashboard'

type Props = {
  data: typeof distribuicaoFase
}

export function DistribuicaoFaseChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
      >
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#71717a' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="fase"
          width={138}
          tick={{ fontSize: 11, fill: '#a1a1aa' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: '#f4f4f5' }}
          itemStyle={{ color: '#a1a1aa' }}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          formatter={(v) => [v, 'Processos']}
        />
        <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {data.map((_, i) => (
            <Cell key={i} fill={i % 2 === 0 ? '#6366f1' : '#818cf8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DistribuicaoFaseChartSkeleton() {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
          <div
            className="h-4 animate-pulse rounded bg-muted"
            style={{ width: `${30 + i * 10}%` }}
          />
        </div>
      ))}
    </div>
  )
}
