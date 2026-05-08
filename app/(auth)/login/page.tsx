'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  email: z.string().min(1, 'Campo obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type FormData = z.infer<typeof schema>

function LPMonogram() {
  return (
    <svg viewBox="0 0 100 100" width="42" height="42" aria-label="LP">
      <defs>
        <linearGradient id="lp_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a1057" />
          <stop offset="35%" stopColor="#a36bd6" />
          <stop offset="55%" stopColor="#6a2bb0" />
          <stop offset="80%" stopColor="#c39ce8" />
          <stop offset="100%" stopColor="#3a1057" />
        </linearGradient>
        <linearGradient id="lp_shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform="translate(50,50)">
        <path d="M 0 -42 L 30 0 L 0 42 L -30 0 Z" fill="url(#lp_grad)" />
        <path d="M 0 -42 L 30 0 L 0 42 L -30 0 Z" fill="url(#lp_shine)" />
        <path
          d="M 0 -34 L 24 0 L 0 34 L -24 0 Z"
          fill="none"
          stroke="#1a0a28"
          strokeWidth="0.6"
          opacity="0.6"
        />
        <g transform="translate(-9,0)">
          <path
            d="M -10 -22 L -3 -22 L -3 16 L 16 16 L 16 22 L -10 22 Z"
            fill="#0a0610"
            stroke="#c39ce8"
            strokeWidth="0.8"
          />
          <rect x="-13" y="-23" width="6" height="2" fill="#c39ce8" />
        </g>
        <g transform="translate(6,4) rotate(-8)">
          <path
            d="M -5 -17 C -7 -13 -8 -5 -6 4 C -4 13 1 17 11 18 L 16 18 L 16 14 L 11 13 C 3 12 -2 7 -3 2 C -5 -5 -3 -12 -1 -17 Z"
            fill="url(#lp_grad)"
            stroke="#c39ce8"
            strokeWidth="0.4"
          />
        </g>
      </g>
    </svg>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(20,10,32,0.6)',
  border: '1px solid #3a1d5c',
  color: '#c39ce8',
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
    <div className="lp-login-grid" style={{ background: '#08050d' }}>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <aside
        className="lp-hero flex-col justify-between overflow-hidden relative"
        style={{
          padding: '56px 64px',
          background: `
            radial-gradient(ellipse at 30% 30%, rgba(106,43,176,0.22) 0%, transparent 55%),
            radial-gradient(ellipse at 70% 80%, rgba(58,16,87,0.45) 0%, transparent 60%),
            linear-gradient(180deg, #08050d 0%, #0e0818 100%)
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
          <path d="M 400 100 L 700 400 L 400 700 L 100 400 Z" fill="none" stroke="#a36bd6" strokeWidth="1" />
          <path d="M 400 180 L 620 400 L 400 620 L 180 400 Z" fill="none" stroke="#a36bd6" strokeWidth="1" />
          <path d="M 400 260 L 540 400 L 400 540 L 260 400 Z" fill="none" stroke="#a36bd6" strokeWidth="1" />
        </svg>

        {/* Topo: monograma + nome */}
        <div className="relative z-10 flex items-center gap-3.5">
          <LPMonogram />
          <div>
            <div
              className="font-cinzel text-[16px] tracking-[0.16em]"
              style={{ color: '#c39ce8' }}
            >
              LEANDRO PEDROSA
            </div>
            <div
              className="font-display text-[11px] tracking-[0.28em] uppercase mt-0.5"
              style={{ color: '#8a73a8' }}
            >
              Advocacia&nbsp;e&nbsp;Assessoria&nbsp;Jurídica
            </div>
          </div>
        </div>

        {/* Bloco central */}
        <div className="relative z-10" style={{ maxWidth: 520 }}>
          <div
            className="font-cinzel text-[13px] tracking-[0.32em] uppercase mb-[18px]"
            style={{ color: '#a36bd6' }}
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
                'linear-gradient(180deg, #3a1057 0%, #a36bd6 35%, #6a2bb0 55%, #c39ce8 75%, #3a1057 100%)',
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
                  'linear-gradient(90deg, transparent 0%, #6a2bb0 20%, #c39ce8 50%, #6a2bb0 80%, transparent 100%)',
                opacity: 0.7,
              }}
            />
            <span
              className="font-display text-[14px] tracking-[0.18em] uppercase"
              style={{ color: '#8a73a8' }}
            >
              Sigilo&nbsp;·&nbsp;Disciplina&nbsp;·&nbsp;Estratégia
            </span>
            <span
              className="flex-1 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, #6a2bb0 20%, #c39ce8 50%, #6a2bb0 80%, transparent 100%)',
                opacity: 0.7,
              }}
            />
          </div>
        </div>

        {/* Rodapé */}
        <div
          className="relative z-10 flex justify-between text-[12px] tracking-[0.04em]"
          style={{ color: '#5e4d77' }}
        >
          <span>© 2026 Leandro Pedrosa Advocacia.</span>
          <span>Acesso restrito&nbsp;·&nbsp;Conexão segura TLS 1.3</span>
        </div>
      </aside>

      {/* ══════════════════════ FORM ══════════════════════ */}
      <section
        className="flex items-center justify-center"
        style={{
          padding: '48px',
          background: 'linear-gradient(180deg, #0e0818 0%, #08050d 100%)',
        }}
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
            style={{ color: '#a36bd6' }}
          >
            Acesso
          </div>

          {/* Título */}
          <h1
            className="font-cinzel font-light mt-2 mb-1.5"
            style={{ fontSize: 36, letterSpacing: '0.04em', color: '#c39ce8' }}
          >
            Bem-vindo de volta
          </h1>

          {/* Subtítulo */}
          <p
            className="text-[14px] leading-relaxed mb-9"
            style={{ color: '#8a73a8' }}
          >
            Acesse o painel para gerir processos, audiências e prazos.
          </p>

          {/* Campo: E-mail / OAB */}
          <div className="mb-[18px]">
            <label
              htmlFor="email"
              className="block font-cinzel text-[11px] tracking-[0.16em] uppercase mb-2"
              style={{ color: '#8a73a8' }}
            >
              OAB ou e-mail
            </label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#a36bd6' }}
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
              style={{ color: '#8a73a8' }}
            >
              Senha
            </label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#a36bd6' }}
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
                    stroke="#8a73a8"
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
                    stroke="#8a73a8"
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
              style={{ color: '#8a73a8' }}
              onClick={() => setRemember((v) => !v)}
            >
              <span
                className="inline-flex items-center justify-center rounded-[3px] transition-all"
                style={{
                  width: 16,
                  height: 16,
                  border: `1px solid ${remember ? '#a36bd6' : '#3a1d5c'}`,
                  background: remember ? '#6a2bb0' : 'transparent',
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
              style={{ color: '#a36bd6' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#c39ce8')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#a36bd6')}
            >
              Esqueci minha senha
            </Link>
          </div>

          {/* Botão submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="lp-btn-shimmer w-full rounded border-none text-white font-cinzel font-medium tracking-[0.22em] uppercase flex items-center justify-center gap-3 transition-transform hover:enabled:-translate-y-px"
            style={{
              padding: '15px 20px',
              fontSize: 14,
              boxShadow:
                '0 8px 32px rgba(106,43,176,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
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
                  stroke="white"
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
              borderTop: '1px solid #2a1645',
              color: '#5e4d77',
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
