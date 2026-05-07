'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'

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
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-indigo-500/10">
            <MailCheck className="size-6 text-indigo-400" />
          </div>
        </div>
        <h1 className="mb-2 text-lg font-semibold text-zinc-50">
          Verifique seu e-mail
        </h1>
        <p className="mb-1 text-sm text-zinc-400">
          Enviamos um link de recuperação para
        </p>
        <p className="mb-6 text-sm font-medium text-zinc-200">{submittedEmail}</p>
        <p className="mb-6 text-xs text-zinc-500">
          O link expira em 1 hora. Verifique também a caixa de spam.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-400"
        >
          <ArrowLeft className="size-3.5" />
          Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <Link
        href="/login"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-400"
      >
        <ArrowLeft className="size-3.5" />
        Voltar
      </Link>

      <h1 className="mb-1 text-lg font-semibold text-zinc-50">
        Recuperar senha
      </h1>
      <p className="mb-6 text-sm text-zinc-500">
        Informe seu e-mail e enviaremos um link para redefinir a senha.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-300">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="dr@escritorio.com.br"
            aria-invalid={!!errors.email}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-50 placeholder-zinc-600 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
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
      </form>
    </div>
  )
}
