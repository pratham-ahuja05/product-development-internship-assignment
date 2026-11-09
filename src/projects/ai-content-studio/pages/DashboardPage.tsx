import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, FileDown, FilePen, Layers, Plus, Sparkles, Workflow } from 'lucide-react'
import { ScaledSlide } from '../SlideCanvas'
import { SAMPLE_PROJECT_ID, useStudio } from '../store'
import { TEMPLATES } from '../templates'
import { THEMES } from '../themes'
import { PlatformIcon, ProjectCard, StatusBadge, timeAgo } from '../ui'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export function DashboardPage() {
  const { projects, brand } = useStudio()
  const drafts = projects.filter((p) => p.status === 'draft')
  const exported = projects.filter((p) => p.status === 'exported')
  const sample = projects.find((p) => p.id === SAMPLE_PROJECT_ID)

  const stats = [
    { label: 'Total carousels', value: projects.length, icon: Layers },
    { label: 'Drafts', value: drafts.length, icon: FilePen },
    { label: 'Exported', value: exported.length, icon: FileDown },
    { label: 'Slides created', value: projects.reduce((n, p) => n + p.slides.length, 0), icon: Sparkles },
  ]

  return (
    <main className="mx-auto w-full max-w-7xl space-y-10 px-4 py-8 sm:px-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 p-7 text-white sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-24 size-80 rounded-full bg-violet-600/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-48 size-64 rounded-full bg-indigo-500/40 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-sm text-white/60">{greeting()}, Founder 👋</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Turn a raw idea into a polished carousel in minutes.</h1>
            <p className="mt-3 max-w-lg text-white/65">Describe your idea. The studio researches it, writes the slides and designs them in {brand.name}’s style. You stay in control of every word.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/studio/create" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white/90">
                <Plus className="size-4" /> Create New Carousel
              </Link>
              {sample && (
                <Link to={`/studio/editor/${sample.id}`} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Open sample carousel <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
          {sample && (
            <div className="relative hidden h-64 sm:block">
              {[2, 1, 0].map((i) => (
                <div key={i} className="absolute top-1/2 w-40 -translate-y-1/2 shadow-2xl transition"
                  style={{ left: `${18 + i * 22}%`, transform: `translateY(-50%) rotate(${(i - 1) * 7}deg)`, zIndex: 3 - Math.abs(i - 1) }}>
                  <ScaledSlide slide={sample.slides[i]} index={i} total={sample.slides.length} themeId={sample.themeId} aspect={sample.aspect} brand={brand} className="rounded-lg" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Overview">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-zinc-200 bg-white p-5">
            <s.icon className="size-5 text-violet-600" />
            <p className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</p>
            <p className="text-sm text-zinc-500">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Recent */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent projects</h2>
          <Link to="/studio/projects" className="text-sm font-medium text-violet-700 hover:underline">View all</Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {projects.slice(0, 4).map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {/* Drafts + exported */}
      <section className="grid gap-6 lg:grid-cols-2">
        {[
          { title: 'Drafts', icon: FilePen, items: drafts, empty: 'No drafts. Everything is exported!' },
          { title: 'Published / exported', icon: CheckCircle2, items: exported, empty: 'Nothing exported yet.' },
        ].map((col) => (
          <div key={col.title} className="rounded-2xl border border-zinc-200 bg-white">
            <h2 className="flex items-center gap-2 border-b border-zinc-100 px-5 py-4 font-semibold"><col.icon className="size-4 text-zinc-400" /> {col.title} <span className="text-sm font-normal text-zinc-400">{col.items.length}</span></h2>
            <ul className="divide-y divide-zinc-100">
              {col.items.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <Link to={`/studio/editor/${p.id}`} className="flex items-center gap-4 px-5 py-3 transition hover:bg-zinc-50">
                    <div className="w-10 shrink-0 overflow-hidden rounded">
                      <ScaledSlide slide={p.slides[0]} index={0} total={p.slides.length} themeId={p.themeId} aspect={p.aspect} brand={brand} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="flex items-center gap-1.5 text-xs text-zinc-500"><PlatformIcon platform={p.brief.platform} /> {THEMES[p.themeId].name} · {p.status === 'exported' && p.exportedAt ? `exported ${timeAgo(p.exportedAt)}` : `edited ${timeAgo(p.updatedAt)}`}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </Link>
                </li>
              ))}
              {!col.items.length && <li className="px-5 py-8 text-center text-sm text-zinc-400">{col.empty}</li>}
            </ul>
          </div>
        ))}
      </section>

      {/* Quick start */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quick-start templates</h2>
          <Link to="/studio/templates" className="text-sm font-medium text-violet-700 hover:underline">All templates</Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 xl:grid-cols-6">
          {TEMPLATES.map((t) => {
            const th = THEMES[t.themeId]
            return (
              <Link key={t.id} to={`/studio/create?template=${t.id}`} className="group w-44 shrink-0 rounded-2xl border border-zinc-200 bg-white p-3 transition hover:border-violet-300 hover:shadow-md sm:w-auto">
                <div className="flex aspect-[4/3] flex-col justify-end rounded-xl p-3" style={{ background: th.coverBg, color: th.coverText }}>
                  <span className="mb-auto h-1 w-6 rounded" style={{ background: th.accent === th.coverBg ? th.coverText : th.accent }} />
                  <span className="text-sm font-semibold leading-tight" style={{ fontFamily: th.headingFont }}>{t.name}</span>
                </div>
                <p className="mt-2.5 text-xs text-zinc-500">{t.structure}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <Link to="/studio/workflow" className="flex items-center gap-4 rounded-2xl border border-dashed border-violet-300 bg-violet-50/60 p-5 transition hover:bg-violet-50">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet-600 text-white"><Workflow className="size-5" /></span>
        <div className="flex-1">
          <p className="font-semibold">How the AI automation works</p>
          <p className="text-sm text-zinc-600">n8n → LLM → validated JSON → templates → founder approval → export. See the proposed architecture.</p>
        </div>
        <ArrowRight className="size-5 text-violet-600" />
      </Link>
    </main>
  )
}
