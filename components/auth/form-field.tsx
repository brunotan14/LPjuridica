interface FormFieldProps {
  htmlFor: string
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}

export function FormField({ htmlFor, label, error, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-red-400/90">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-zinc-600">{hint}</p>
      ) : null}
    </div>
  )
}

export const inputClass =
  'w-full rounded border border-zinc-700/70 bg-zinc-800/60 px-3.5 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-zinc-800 focus:ring-2 focus:ring-inset focus:ring-indigo-500/10 aria-invalid:border-red-500/60 aria-invalid:focus:ring-red-500/10'

export const inputWithIconClass = inputClass + ' pr-10'
