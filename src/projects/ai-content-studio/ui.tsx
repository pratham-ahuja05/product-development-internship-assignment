import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { InstagramIcon as Instagram, LinkedinIcon as Linkedin } from '@/components/BrandIcons'
import { cn } from '@/lib/cn'
import { ScaledSlide } from './SlideCanvas'
import { useStudio } from './store'
import type { CarouselProject, Platform } from './types'

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export const btn = {
  primary: 'inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-600/20 transition hover:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none',
  dark: 'inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50',
  secondary: 'inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50',
  ghost: 'inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900',
}

export function StatusBadge({ status }: { status: CarouselProject['status'] }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold',
      status === 'exported' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600')}>
      <span className={cn('size-1.5 rounded-full', status === 'exported' ? 'bg-emerald-500' : 'bg-zinc-400')} />
      {status === 'exported' ? 'Exported' : 'Draft'}
    </span>
  )
}

export function PlatformIcon({ platform, className }: { platform: Platform; className?: string }) {
  const Icon = platform === 'linkedin' ? Linkedin : Instagram
  return <Icon className={cn('size-3.5', className)} aria-label={platform === 'linkedin' ? 'LinkedIn' : 'Instagram'} />
}

export function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function ProjectCard({ project: p, actions }: { project: CarouselProject; actions?: ReactNode }) {
  const { brand } = useStudio()
  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5">
      <Link to={`/studio/editor/${p.id}`} className="block bg-zinc-100 p-4" aria-label={`Open ${p.title}`}>
        <div className="relative mx-auto w-[62%]">
          {p.slides[1] && (
            <div className="absolute inset-0 translate-x-[18%] rotate-6 scale-95 opacity-80 shadow-md transition group-hover:translate-x-[26%] group-hover:rotate-[9deg]">
              <ScaledSlide slide={p.slides[1]} index={1} total={p.slides.length} themeId={p.themeId} aspect={p.aspect} brand={brand} className="rounded-md" />
            </div>
          )}
          <ScaledSlide slide={p.slides[0]} index={0} total={p.slides.length} themeId={p.themeId} aspect={p.aspect} brand={brand} className="relative rounded-md shadow-lg" />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <PlatformIcon platform={p.brief.platform} /> {p.slides.length} slides · {timeAgo(p.updatedAt)}
          <span className="ml-auto"><StatusBadge status={p.status} /></span>
        </div>
        <h3 className="mt-2 line-clamp-2 font-semibold leading-snug text-zinc-900">
          <Link to={`/studio/editor/${p.id}`} className="hover:text-violet-700">{p.title}</Link>
        </h3>
        {actions && <div className="mt-3 flex gap-1">{actions}</div>}
      </div>
    </article>
  )
}
