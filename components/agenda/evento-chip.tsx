import { cn } from '@/lib/utils'
import { TIPO_META, type TipoEvento } from '@/types/agenda'

type Props = {
  tipo: TipoEvento
  className?: string
}

export function EventoChip({ tipo, className }: Props) {
  const meta = TIPO_META[tipo]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium',
        meta.chipBg,
        meta.chipText,
        meta.chipBorder,
        className
      )}
    >
      {meta.label}
    </span>
  )
}
