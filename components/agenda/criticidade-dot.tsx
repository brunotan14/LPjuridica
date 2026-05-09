import { cn } from '@/lib/utils'
import { CRITICIDADE_META, type Criticidade } from '@/types/agenda'

type Props = {
  criticidade: Criticidade
  showLabel?: boolean
  className?: string
}

export function CriticidadeDot({ criticidade, showLabel, className }: Props) {
  const meta = CRITICIDADE_META[criticidade]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[11px] font-medium',
        className
      )}
      title={meta.label}
    >
      <span
        aria-hidden="true"
        className={cn('size-2 rounded-full ring-2', meta.dotClass, meta.ringClass)}
      />
      {showLabel && <span className="text-muted-foreground">{meta.label}</span>}
    </span>
  )
}
