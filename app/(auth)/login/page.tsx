'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { FormField, inputClass, inputWithIconClass } from '@/components/auth/form-field'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(_data: FormData) {
    await new Promise((r) => setTimeout(r, 1000))
    router.push('/dashboard')
  }

  return (
    <div className="relative overflow-hidden rounded border border-zinc-800/80 bg-zinc-900 px-7 py-8 shadow-2xl shadow-black/30">
      {/* Linha gradiente no topo */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <h1 className="mb-1 font-display text-[26px] font-normal leading-tight text-zinc-50">
        Entrar
      </h1>
      <p className="mb-7 text-xs tracking-wide text-zinc-500">
        Acesso restrito ao escritório
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

        <FormField htmlFor="password" label="Senha" error={errors.password?.message}>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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

        <div className="space-y-3 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-4 py-2.5 text-sm font-medium tracking-wide text-white transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Entrando…
              </>
            ) : (
              'Entrar'
            )}
          </button>

          <Link
            href="/forgot-password"
            className="block text-center text-xs tracking-wide text-zinc-600 transition-colors hover:text-zinc-400"
          >
            Esqueceu a senha?
          </Link>
        </div>
      </form>
    </div>
  )
}
