export default function ConfiguracoesPage() {
  const sections = [
    { title: 'Escritório', desc: 'Nome, endereço, OAB e dados do titular' },
    { title: 'Equipe', desc: 'Convidar membros e gerenciar permissões — M12' },
    { title: 'Notificações', desc: 'Alertas por e-mail e push mobile — M11' },
    { title: 'Segurança', desc: 'Senha, sessões ativas e autenticação' },
  ]

  return (
    <div className="max-w-2xl space-y-3">
      {sections.map(({ title, desc }) => (
        <div
          key={title}
          className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4"
        >
          <div>
            <p className="text-sm font-medium text-zinc-200">{title}</p>
            <p className="text-xs text-zinc-500">{desc}</p>
          </div>
          <button className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200">
            Editar
          </button>
        </div>
      ))}
    </div>
  )
}
