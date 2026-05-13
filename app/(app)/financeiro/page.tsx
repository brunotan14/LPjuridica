import { parcelasMock } from '@/lib/data/financeiro'
import { FinanceiroShell } from '@/components/financeiro/financeiro-shell'

export const metadata = {
  title: 'Financeiro | LP Jurídica',
}

export default function FinanceiroPage() {
  return <FinanceiroShell parcelas={parcelasMock} />
}
