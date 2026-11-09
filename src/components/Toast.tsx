import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

type ToastKind = 'success' | 'info' | 'error'
interface ToastItem { id: number; kind: ToastKind; message: string }

const ToastContext = createContext<(message: string, kind?: ToastKind) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const push = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random()
    setItems((s) => [...s, { id, kind, message }])
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3200)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[200] flex flex-col items-center gap-2 px-4">
        {items.map((t) => {
          const Icon = t.kind === 'success' ? CheckCircle2 : t.kind === 'error' ? XCircle : Info
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex animate-fade-up items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-xl"
            >
              <Icon
                className={cn(
                  'size-4',
                  t.kind === 'success' && 'text-emerald-400',
                  t.kind === 'error' && 'text-red-400',
                  t.kind === 'info' && 'text-sky-400',
                )}
              />
              {t.message}
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
