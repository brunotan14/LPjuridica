'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
})

type FormData = z.infer<typeof schema>

const inputStyle: React.CSSProperties = {
  background: 'rgba(20,16,8,0.6)',
  border: '1px solid #3a2d0a',
  color: '#ffffff',
}

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    await new Promise((r) => setTimeout(r, 1000))
    setSubmittedEmail(data.email)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AuthShell>
        <div
          className="relative overflow-hidden rounded text-center"
          style={{
            background: 'rgba(20,16,8,0.8)',
            border: '1px solid #3a2d0a',
            padding: '40px 28px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #c9a84c 50%, transparent 100%)',
              opacity: 0.5,
            }}
          />

          <div className="mb-5 flex justify-center">
            <div
              className="flex size-11 items-center justify-center rounded-full"
              style={{ border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.08)' }}
            >
              <MailCheck className="size-5" style={{ color: '#c9a84c' }} />
            </div>
          </div>

          <h1
            className="mb-2 font-cinzel text-[22px] font-light"
            style={{ color: '#e8d09a', letterSpacing: '0.04em' }}
          >
            Verifique seu e-mail
          </h1>
          <p className="mb-1 text-xs tracking-wide" style={{ color: '#7a6840' }}>
            Enviamos um link de recuperação para
          </p>
          <p className="mb-6 text-sm font-medium" style={{ color: '#c9a84c' }}>
            {submittedEmail}
          </p>
          <p className="mb-8 text-[11px] leading-relaxed" style={{ color: '#5a4a28' }}>
            O link expira em 1 hora.
            <br />
            Verifique também a caixa de spam.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs tracking-wide transition-colors"
            style={{ color: '#7a6840' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#c9a84c')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a6840')}
          >
            <ArrowLeft className="size-3" />
            Voltar para o login
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <div
        className="relative overflow-hidden rounded"
        style={{
          background: 'rgba(20,16,8,0.8)',
          border: '1px solid #3a2d0a',
          padding: '32px 28px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #c9a84c 50%, transparent 100%)',
            opacity: 0.5,
          }}
        />

        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-1.5 text-xs tracking-wide transition-colors"
          style={{ color: '#7a6840' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#c9a84c')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a6840')}
        >
          <ArrowLeft className="size-3" />
          Voltar
        </Link>

        <div
          className="font-display text-[12px] tracking-[0.32em] uppercase mb-2"
          style={{ color: '#c9a84c' }}
        >
          Recuperação
        </div>

        <h1
          className="font-cinzel font-light mb-1"
          style={{ fontSize: 28, letterSpacing: '0.04em', color: '#e8d09a' }}
        >
          Recuperar senha
        </h1>
        <p className="text-[14px] leading-relaxed mb-7" style={{ color: '#7a6840' }}>
          Informe seu e-mail e enviaremos um link para redefinir a senha.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block font-cinzel text-[11px] tracking-[0.16em] uppercase mb-2"
              style={{ color: '#8a7a5a' }}
            >
              E-mail
            </label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#c9a84c' }}
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
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="dr@escritorio.com.br"
                aria-invalid={!!errors.email}
                className="lp-field-input w-full py-[13px] pl-10 pr-3.5 rounded text-[14px] outline-none"
                style={inputStyle}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p role="alert" className="mt-1.5 text-xs" style={{ color: '#f87171' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="lp-btn-shimmer w-full rounded border-none text-white font-cinzel font-medium tracking-[0.22em] uppercase flex items-center justify-center gap-3 transition-transform hover:enabled:-translate-y-px"
              style={{
                padding: '15px 20px',
                fontSize: 13,
                boxShadow: '0 8px 32px rgba(201,168,76,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Enviando…
                </>
              ) : (
                'Enviar link de recuperação'
              )}
            </button>
          </div>
        </form>
      </div>
    </AuthShell>
  )
}
