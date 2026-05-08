'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { FormField, inputWithIconClass } from '@/components/auth/form-field'
import { AuthShell } from '@/components/auth/auth-shell'

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Deve conter pelo menos um número'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [done, setDone] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(_data: FormData) {
    await new Promise((r) => setTimeout(r, 1000))
    setDone(true)
  }

  if (done) {
    return (
      <AuthShell>
      <div className="relative overflow-hidden rounded border border-zinc-800/80 bg-zinc-900 px-7 py-10 text-center shadow-2xl shadow-black/30">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="mb-5 flex justify-center">
          <div className="flex size-11 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/8">
            <ShieldCheck className="size-5 text-emerald-400" />
          </div>
        </div>

        <h1 className="mb-2 font-display text-[22px] font-normal text-zinc-50">
          Senha redefinida
        </h1>
        <p className="mb-8 text-xs leading-relaxed tracking-wide text-zinc-500">
          Sua senha foi atualizada com sucesso.
          <br />
          Você já pode fazer login.
        </p>

        <Link
          href="/login"
          className="flex items-center justify-center rounded border border-primary bg-primary px-4 py-2.5 text-sm font-medium tracking-wide text-white transition-all duration-200 hover:border-primary/80 hover:bg-primary/80"
        >
          Ir para o login
        </Link>
      </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
    <div className="relative overflow-hidden rounded border border-zinc-800/80 bg-zinc-900 px-7 py-8 shadow-2xl shadow-black/30">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <h1 className="mb-1 font-display text-[26px] font-normal leading-tight text-zinc-50">
        Redefinir senha
      </h1>
      <p className="mb-7 text-xs tracking-wide text-zinc-500">
        Escolha uma nova senha para sua conta.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormField
          htmlFor="password"
          label="Nova senha"
          error={errors.password?.message}
          hint="Mín. 8 caracteres, uma maiúscula e um número"
        >
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              className={inputWithIconClass}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors hover:text-zinc-400"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </FormField>

        <FormField
          htmlFor="confirmPassword"
          label="Confirmar senha"
          error={errors.confirmPassword?.message}
        >
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.confirmPassword}
              className={inputWithIconClass}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors hover:text-zinc-400"
              aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </FormField>

        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded border border-primary bg-primary px-4 py-2.5 text-sm font-medium tracking-wide text-white transition-all duration-200 hover:border-primary/80 hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Salvando…
              </>
            ) : (
              'Salvar nova senha'
            )}
          </button>
        </div>
      </form>
    </div>
    </AuthShell>
  )
}
