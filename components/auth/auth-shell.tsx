export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16"
      style={{
        backgroundColor: '#09090b',
        backgroundImage: `
          radial-gradient(ellipse 100% 55% at 50% -5%, rgba(99, 102, 241, 0.055) 0%, transparent 100%),
          radial-gradient(circle, rgba(255,255,255,0.022) 0.5px, transparent 0.5px)
        `,
        backgroundSize: 'auto, 22px 22px',
      }}
    >
      <div className="animate-auth-in mb-10 text-center" style={{ animationDelay: '0ms' }}>
        <div className="font-display text-[54px] font-light leading-none tracking-[-0.03em] text-zinc-50 select-none">
          LP
        </div>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        <p className="mt-3 text-[10px] font-sans font-normal uppercase tracking-[0.25em] text-zinc-600">
          Advocacia Criminal
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
