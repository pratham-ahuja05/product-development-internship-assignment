import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Visual tone: light surfaces for Practo/Studio, dark for AI Education. */
  tone?: 'light' | 'dark'
  className?: string
  bodyClassName?: string
  hideHeader?: boolean
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
  full: 'max-w-[min(1400px,96vw)]',
}

/** Accessible dialog: portal, ESC to close, scroll lock, focus moves inside and is restored on close. */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  tone = 'light',
  className,
  bodyClassName,
  hideHeader,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current()
    window.addEventListener('keydown', onKey)
    requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        'input, select, textarea, button:not([data-close])',
      )
      ;(first ?? panelRef.current)?.focus()
    })
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
  }, [open])

  if (!open) return null
  const dark = tone === 'dark'

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className={cn('absolute inset-0 backdrop-blur-sm', dark ? 'bg-black/70' : 'bg-ink/50')}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[92vh] w-full animate-fade-up flex-col overflow-hidden rounded-t-3xl shadow-2xl outline-none sm:rounded-3xl',
          dark ? 'border border-white/10 bg-night-900 text-white' : 'bg-white text-ink',
          sizes[size],
          className,
        )}
      >
        {!hideHeader && (
          <div
            className={cn(
              'flex items-start justify-between gap-4 border-b px-5 py-4 sm:px-7',
              dark ? 'border-white/10' : 'border-black/5',
            )}
          >
            <div className="min-w-0">
              {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
              {description && (
                <p className={cn('mt-0.5 text-sm', dark ? 'text-white/60' : 'text-ink/55')}>{description}</p>
              )}
            </div>
            <button
              data-close
              onClick={onClose}
              aria-label="Close dialog"
              className={cn(
                'shrink-0 rounded-full p-2 transition',
                dark ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-ink/50 hover:bg-black/5 hover:text-ink',
              )}
            >
              <X className="size-5" />
            </button>
          </div>
        )}
        <div className={cn('overflow-y-auto px-5 py-5 sm:px-7 sm:py-6', bodyClassName)}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
