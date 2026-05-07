export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight text-zinc-50">
            LP<span className="text-indigo-500">.</span>
          </span>
          <p className="mt-1 text-sm text-zinc-500">Advocacia Criminal</p>
        </div>
        {children}
      </div>
    </div>
  )
}
