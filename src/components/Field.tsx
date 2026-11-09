import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

type Tone = 'light' | 'dark' | 'forest' | 'studio'

const control: Record<Tone, string> = {
  light:
    'border-black/10 bg-white text-ink placeholder:text-ink/35 focus:border-ink/40 focus:ring-ink/10',
  forest:
    'border-forest-900/12 bg-white text-ink placeholder:text-ink/35 focus:border-forest-600 focus:ring-mint-200',
  studio:
    'border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:ring-violet-100',
  dark:
    'border-white/12 bg-white/[0.04] text-white placeholder:text-white/30 focus:border-electric focus:ring-electric/25',
}

const labelTone: Record<Tone, string> = {
  light: 'text-ink/80',
  forest: 'text-forest-950/85',
  studio: 'text-zinc-700',
  dark: 'text-white/80',
}

interface FieldProps {
  label: ReactNode
  error?: string
  hint?: ReactNode
  tone?: Tone
  required?: boolean
  className?: string
  children: (props: { id: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string; className: string }) => ReactNode
}

/** Label + control + hint/error wiring with proper aria attributes. */
export function Field({ label, error, hint, tone = 'light', required, className, children }: FieldProps) {
  const id = useId()
  const descId = `${id}-desc`
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cn('text-sm font-medium', labelTone[tone])}>
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error || hint ? descId : undefined,
        className: cn(
          'w-full rounded-xl border px-3.5 py-2.5 text-[15px] outline-none transition focus:ring-4',
          control[tone],
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/15',
        ),
      })}
      {error ? (
        <p id={descId} className="flex items-center gap-1.5 text-xs font-medium text-red-500">
          <AlertCircle className="size-3.5" /> {error}
        </p>
      ) : hint ? (
        <p id={descId} className={cn('text-xs', tone === 'dark' ? 'text-white/45' : 'text-ink/45')}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} />
export const Select = (p: SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} />
export const Textarea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} />
