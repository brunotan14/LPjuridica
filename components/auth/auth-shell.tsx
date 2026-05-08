import { LPMonogram } from '@/components/brand/lp-monogram'

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16"
      style={{
        backgroundColor: '#09090b',
        backgroundImage: `
          radial-gradient(ellipse 100% 55% at 50% -5%, rgba(201, 168, 76, 0.07) 0%, transparent 100%),
          radial-gradient(circle, rgba(255,255,255,0.022) 0.5px, transparent 0.5px)
        `,
        backgroundSize: 'auto, 22px 22px',
      }}
    >
      <div className="animate-auth-in mb-10" style={{ animationDelay: '0ms' }}>
        {/* Bloco de identidade — idêntico ao hero da página de login */}
        <div className="flex items-center gap-3.5">
          <LPMonogram size={48} />
          <div>
            <div
              className="font-cinzel text-[16px] tracking-[0.16em]"
              style={{ color: '#e8d09a' }}
            >
              LEANDRO PEDROSA
            </div>
            <div
              className="font-display text-[11px] tracking-[0.28em] uppercase mt-0.5"
              style={{ color: '#b8985a' }}
            >
              Advocacia&nbsp;e&nbsp;Assessoria&nbsp;Jurídica
            </div>
          </div>
        </div>

        <div
          className="mt-4 h-px w-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #3a2d0a 50%, transparent 100%)',
          }}
        />
        <p
          className="mt-3 text-[10px] font-sans font-normal uppercase tracking-[0.25em]"
          style={{ color: '#7a6840' }}
        >
          Advocacia Criminal e Cível
        </p>
      </div>

      <div className="animate-auth-in w-full max-w-[380px]" style={{ animationDelay: '80ms' }}>
        {children}
      </div>

      <p
        className="animate-auth-in absolute bottom-6 text-[10px] tracking-widest text-zinc-800"
        style={{ animationDelay: '150ms' }}
      >
        © {new Date().getFullYear()} LP Consultoria Jurídica
      </p>
    </div>
  )
}
