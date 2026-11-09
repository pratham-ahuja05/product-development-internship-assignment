import { useState, type ImgHTMLAttributes } from 'react'
import { PawPrint } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Image with lazy loading, a soft skeleton while loading and a branded fallback if the URL fails. */
export function SmartImage({ className, alt = '', ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  return (
    <div className={cn('relative overflow-hidden bg-mint-100', className)}>
      {state !== 'ok' && (
        <div className={cn('absolute inset-0 grid place-items-center', state === 'loading' && 'skeleton')}>
          {state === 'error' && <PawPrint className="size-8 text-forest-700/40" aria-hidden />}
        </div>
      )}
      {state !== 'error' && (
        <img
          loading="lazy"
          decoding="async"
          alt={alt}
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
          className={cn('size-full object-cover transition-opacity duration-500', state === 'ok' ? 'opacity-100' : 'opacity-0')}
          {...rest}
        />
      )}
    </div>
  )
}

/** Unsplash helper so every photo is requested at an appropriate size. */
export const unsplash = (id: string, w = 800, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=75`
