import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { uid } from '@/lib/cn'
import { ScaledSlide } from '../SlideCanvas'
import { useStudio } from '../store'
import { TEMPLATES } from '../templates'
import { THEME_LIST, THEMES } from '../themes'
import type { Slide } from '../types'
import { PageHeader } from '../ui'

const demoSlide = (title: string): Slide => ({ id: uid('d'), kind: 'cover', eyebrow: 'Template', title, body: 'Your idea, researched, written and designed.' })
const demoContent: Slide = { id: 'demo-c', kind: 'content', eyebrow: 'Example', title: 'One idea per slide', body: 'Short, scannable copy with one concrete example.', example: 'Keep slide copy under 40 words.' }

export function TemplatesPage() {
  const { brand } = useStudio()
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
      <PageHeader title="Templates" subtitle="Start from a proven structure and visual style. Everything stays editable." />

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-zinc-400">Content structures</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <Link key={t.id} to={`/studio/create?template=${t.id}`} className="group flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-violet-300 hover:shadow-md">
            <div className="w-28 shrink-0 overflow-hidden rounded-lg shadow">
              <ScaledSlide slide={demoSlide(t.name)} index={0} total={6} themeId={t.themeId} aspect="portrait" brand={brand} />
            </div>
            <div className="flex min-w-0 flex-col">
              <h3 className="font-semibold">{t.name}</h3>
              <p className="mt-1 text-sm text-zinc-500">{t.description}</p>
              <p className="mt-2 text-xs font-medium text-zinc-400">{t.structure}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-violet-700">Use template <ArrowRight className="size-4 transition group-hover:translate-x-0.5" /></span>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wider text-zinc-400">Visual themes</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {THEME_LIST.map((th) => (
          <div key={th.id} className="rounded-2xl border border-zinc-200 bg-white p-3">
            <div className="grid grid-cols-2 gap-1.5">
              <ScaledSlide slide={demoSlide(th.name)} index={0} total={5} themeId={th.id} aspect="portrait" brand={brand} className="rounded" />
              <ScaledSlide slide={demoContent} index={1} total={5} themeId={th.id} aspect="portrait" brand={brand} className="rounded" />
            </div>
            <h3 className="mt-3 text-sm font-semibold">{th.name}</h3>
            <p className="mt-0.5 text-xs text-zinc-500">{THEMES[th.id].description}</p>
            <div className="mt-2 flex gap-1">
              {[th.coverBg, th.bg, th.accent, th.text].map((c, i) => <span key={i} className="size-4 rounded-full ring-1 ring-black/10" style={{ background: c }} />)}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
