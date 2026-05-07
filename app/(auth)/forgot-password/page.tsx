'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'
import { FormField, inputClass } from '@/components/auth/form-field'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
})

type FormData = z.infer<typeof schema>

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
      <div className="relative overflow-hidden rounded border border-zinc-800/80 bg-zinc-900 px-7 py-10 text-center shadow-2xl shadow-black/30">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        <div className="mb-5 flex justify-center">
          <div className="flex size-11 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/8">
            <MailCheck className="size-5 text-indigo-400" />
          </div>
        </div>

        <h1 className="mb-2 font-display text-[22px] font-normal text-zinc-50">
          Verifique seu e-mail
        </h1>
        <p className="mb-1 text-xs tracking-wide text-zinc-500">
          Enviamos um link de recuperação para
        </p>
        <p className="mb-6 text-sm font-medium text-zinc-300">{submittedEmail}</p>
        <p className="mb-8 text-[11px] leading-relaxed text-zinc-600">
          O link expira em 1 hora.
          <br />
          Verifique também a caixa de spam.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs tracking-wide text-zinc-600 transition-colors hover:text-zinc-400"
        >
          <ArrowLeft className="size-3" />
          Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded border border-zinc-800/80 bg-zinc-900 px-7 py-8 shadow-2xl shadow-black/30">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <Link
        href="/login"
        className="mb-6 inline-flex items-center gap-1.5 text-xs tracking-wide text-zinc-600 transition-colors hover:text-zinc-400"
      >
        <ArrowLeft className="size-3" />
        Voltar
      </Link>

      <h1 className="mb-1 font-display text-[26px] font-normal leading-tight text-zinc-50">
        Recuperar senha
      </h1>
      <p className="mb-7 text-xs tracking-wide text-zinc-500">
        Informe seu e-mail e enviaremos um link para redefinir a senha.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormField htmlFor="email" label="E-mail" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="dr@escritorio.com.br"
            aria-invalid={!!errors.email}
            className={inputClass}
            {...register('email')}
          />
        </FormField>

        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-4 py-2.5 text-sm font-medium tracking-wide text-white transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
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
  )
}
