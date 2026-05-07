export default function LoginPage() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h1 className="mb-1 text-lg font-semibold text-zinc-50">Entrar</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Acesso restrito ao escritório
      </p>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">E-mail</label>
          <input
            type="email"
            placeholder="dr@escritorio.com.br"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-50 placeholder-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-50 placeholder-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors">
          Entrar
        </button>
        <a
          href="/forgot-password"
          className="block text-center text-sm text-zinc-500 hover:text-zinc-400 transition-colors"
        >
          Esqueceu a senha?
        </a>
      </div>
    </div>
  )
}
