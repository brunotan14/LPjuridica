import { Lock, LockKeyhole } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NivelSigilo } from '@/types/index'

export const SIGILO_LABELS: Record<NivelSigilo, string> = {
  publico: 'Público',
  restrito: 'Restrito',
  segredo_de_justica: 'Segredo de Justiça',
}

interface BadgeSigiloProps {
  sigilo: NivelSigilo
  className?: string
}

export function BadgeSigilo({ sigilo, className }: BadgeSigiloProps) {
  if (sigilo === 'publico') {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full border border-emerald-900 bg-emerald-950 px-2 py-0.5 text-xs font-medium text-emerald-400',
          className,
        )}
      >
        {SIGILO_LABELS.publico}
      </span>
    )
  }

  if (sigilo === 'restrito') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full border border-amber-900 bg-amber-950 px-2 py-0.5 text-xs font-medium text-amber-400',
          className,
        )}
      >
        <Lock className="size-3" />
        {SIGILO_LABELS.restrito}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-red-900 bg-red-950 px-2 py-0.5 text-xs font-medium text-red-400',
        className,
      )}
    >
      <LockKeyhole className="size-3" />
      {SIGILO_LABELS.segredo_de_justica}
    </span>
  )
}
