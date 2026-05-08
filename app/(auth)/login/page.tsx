'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { LPMonogram } from '@/components/brand/lp-monogram'

const schema = z.object({
  email: z.string().min(1, 'Campo obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type FormData = z.infer<typeof schema>

const inputStyle: React.CSSProperties = {
  background: 'rgba(20,16,8,0.6)',
  border: '1px solid #3a2d0a',
  color: '#e8d09a',
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(_data: FormData) {
    await new Promise((r) => setTimeout(r, 1200))
    router.push('/dashboard')
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] min-h-screen"
      style={{ background: '#050505' }}
    >

      {/* ══════════════════════ HERO ══════════════════════ */}
      <aside
        className="hidden md:flex flex-col justify-between overflow-hidden relative"
        style={{
          padding: '56px 64px',
          background: `
            radial-gradient(ellipse at 30% 30%, rgba(201,169,97,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 70% 80%, rgba(61,45,15,0.55) 0%, transparent 60%),
            linear-gradient(180deg, #050505 0%, #0f0c08 100%)
          `,
        }}
      >
        {/* Marca d'água */}
        <svg
          viewBox="0 0 800 800"
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: -200,
            bottom: -300,
            width: 900,
            height: 900,
            opacity: 0.08,
            pointerEvents: 'none',
          }}
        >
          <path d="M 400 100 L 700 400 L 400 700 L 100 400 Z" fill="none" stroke="#c9a961" strokeWidth="1" />
          <path d="M 400 180 L 620 400 L 400 620 L 180 400 Z" fill="none" stroke="#c9a961" strokeWidth="1" />
          <path d="M 400 260 L 540 400 L 400 540 L 260 400 Z" fill="none" stroke="#c9a961" strokeWidth="1" />
        </svg>

        {/* Topo: monograma + nome */}
        <div className="relative z-10 flex items-center gap-3.5">
          <LPMonogram size={42} />
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

        {/* Bloco central */}
        <div className="relative z-10" style={{ maxWidth: 520 }}>
          <div
            className="font-cinzel text-[13px] tracking-[0.32em] uppercase mb-[18px]"
            style={{ color: '#c9a961' }}
          >
            Plataforma&nbsp;Interna&nbsp;·&nbsp;v.&nbsp;2.4
          </div>
          <h2
            className="font-cinzel font-extralight m-0"
            style={{
              fontSize: 52,
              lineHeight: 1.1,
              letterSpacing: '0.03em',
              background:
                'linear-gradient(180deg, #3d2d0f 0%, #c9a961 35%, #8b6f1f 55%, #f5e6b8 75%, #3d2d0f 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            Excelência<br />jurídica em<br />
            <em
              className="font-display"
              style={{
                fontStyle: 'italic',
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
              }}
            >
              cada detalhe.
            </em>
          </h2>

          {/* Divisor */}
          <div className="flex items-center gap-3.5 mt-7">
            <span
              className="flex-1 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, #8b6f1f 20%, #f5e6b8 50%, #8b6f1f 80%, transparent 100%)',
                opacity: 0.7,
              }}
            />
            <span
              className="font-display text-[14px] tracking-[0.18em] uppercase"
              style={{ color: '#b8985a' }}
            >
              Sigilo&nbsp;·&nbsp;Disciplina&nbsp;·&nbsp;Estratégia
            </span>
            <span
              className="flex-1 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, #8b6f1f 20%, #f5e6b8 50%, #8b6f1f 80%, transparent 100%)',
                opacity: 0.7,
              }}
            />
          </div>
        </div>

        {/* Rodapé */}
        <div
          className="relative z-10 flex justify-between text-[12px] tracking-[0.04em]"
          style={{ color: '#6b5b3a' }}
        >
          <span>© 2026 Leandro Pedrosa Advocacia.</span>
          <span>Acesso restrito&nbsp;·&nbsp;Conexão segura TLS 1.3</span>
        </div>
      </aside>

      {/* ══════════════════════ FORM ══════════════════════ */}
      <section
        className="flex items-center justify-center p-6 md:p-12"
        style={{ background: 'linear-gradient(180deg, #0f0c08 0%, #050505 100%)' }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="w-full animate-auth-in"
          style={{ maxWidth: 420 }}
        >
          {/* Eyebrow */}
          <div
            className="font-display text-[12px] tracking-[0.32em] uppercase"
            style={{ color: '#c9a961' }}
          >
            Acesso
          </div>

          {/* Título */}
          <h1
            className="font-cinzel font-light mt-2 mb-1.5"
            style={{ fontSize: 36, letterSpacing: '0.04em', color: '#e8d09a' }}
          >
            Bem-vindo de volta
          </h1>

          {/* Subtítulo */}
          <p
            className="text-[14px] leading-relaxed mb-9"
            style={{ color: '#b8985a' }}
          >
            Acesse o painel para gerir processos, audiências e prazos.
          </p>

          {/* Campo: E-mail / OAB */}
          <div className="mb-[18px]">
            <label
              htmlFor="email"
              className="block font-cinzel text-[11px] tracking-[0.16em] uppercase mb-2"
              style={{ color: '#b8985a' }}
            >
              OAB ou e-mail
            </label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#c9a961' }}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </svg>
              </span>
              <input
                id="email"
                type="text"
                autoComplete="email"
                placeholder="leandro@pedrosa.adv.br"
                className="lp-field-input w-full py-[13px] pl-10 pr-3.5 rounded text-[14px] outline-none"
                style={inputStyle}
                {...register('email')}
              />
            </div>
          </div>

          {/* Campo: Senha */}
          <div className="mb-[18px]">
            <label
              htmlFor="password"
              className="block font-cinzel text-[11px] tracking-[0.16em] uppercase mb-2"
              style={{ color: '#b8985a' }}
            >
              Senha
            </label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#c9a961' }}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••••"
                className="lp-field-input w-full py-[13px] pl-10 pr-10 rounded text-[14px] outline-none"
                style={inputStyle}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-transparent border-none cursor-pointer"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#b8985a"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#b8985a"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Lembrar / Esqueci */}
          <div className="flex justify-between items-center mt-2 mb-7">
            <button
              type="button"
              className="flex items-center gap-2 text-[13px] cursor-pointer select-none bg-transparent border-none p-0"
              style={{ color: '#b8985a' }}
              onClick={() => setRemember((v) => !v)}
            >
              <span
                className="inline-flex items-center justify-center rounded-[3px] transition-all"
                style={{
                  width: 16,
                  height: 16,
                  border: `1px solid ${remember ? '#c9a961' : '#3a2d0a'}`,
                  background: remember ? '#8b6f1f' : 'transparent',
                  flexShrink: 0,
                }}
              >
                {remember && (
                  <svg
                    viewBox="0 0 24 24"
                    width="11"
                    height="11"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </span>
              Manter conectado
            </button>
            <Link
              href="/forgot-password"
              className="text-[13px] transition-colors"
              style={{ color: '#c9a961' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#e8d09a')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#c9a961')}
            >
              Esqueci minha senha
            </Link>
          </div>

          {/* Botão submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="lp-btn-shimmer w-full rounded border-none font-cinzel font-medium tracking-[0.22em] uppercase flex items-center justify-center gap-3 transition-transform hover:enabled:-translate-y-px"
            style={{
              padding: '15px 20px',
              fontSize: 14,
              boxShadow:
                '0 8px 32px rgba(201,169,97,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Autenticando…
              </>
            ) : (
              <>
                Entrar no painel
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="#0a0a0a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>

          {/* Rodapé do form */}
          <div
            className="mt-9 pt-6 flex justify-between items-center text-[12px] tracking-[0.04em]"
            style={{
              borderTop: '1px solid #2a2010',
              color: '#6b5b3a',
            }}
          >
            <span>Acesso restrito&nbsp;·&nbsp;uso exclusivo do escritório</span>
            <span className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                width="11"
                height="11"
                fill="none"
                stroke="#8fd9b8"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Conexão segura
            </span>
          </div>
        </form>
      </section>
    </div>
  )
}
