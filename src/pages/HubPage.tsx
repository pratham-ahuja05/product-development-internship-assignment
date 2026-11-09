import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, GraduationCap, PawPrint, Sparkles } from 'lucide-react'
import { SmartImage, unsplash } from '@/components/SmartImage'

const deliverables = [
  {
    to: '/practo',
    n: '01',
    name: 'Practo for Animals',
    kind: 'Animal-care discovery marketplace',
    icon: PawPrint,
    accent: 'from-forest-700 to-forest-500',
    ring: 'group-hover:ring-forest-500/40',
    points: ['Search by location, service and species', 'Results page with filters and sorting', 'Provider details, business listing and correction forms'],
    preview: (
      <div className="relative h-full bg-cream">
        <SmartImage src={unsplash('1628009368231-7bb7cfcb0def', 700)} alt="" className="absolute inset-y-0 right-0 w-1/2" />
        <div className="relative w-1/2 p-5">
          <p className="font-jakarta text-[10px] font-bold uppercase tracking-widest text-forest-600">Practo for Animals</p>
          <p className="mt-2 font-jakarta text-xl font-extrabold leading-tight text-forest-950">Better Care for Every Paw.</p>
          <div className="mt-3 h-7 rounded-lg bg-white shadow-sm ring-1 ring-black/5" />
          <div className="mt-2 h-6 w-20 rounded-lg bg-forest-800" />
        </div>
      </div>
    ),
  },
  {
    to: '/education',
    n: '02',
    name: 'AI Education',
    kind: 'Programme landing page and lead capture',
    icon: GraduationCap,
    accent: 'from-electric to-plasma',
    ring: 'group-hover:ring-electric/40',
    points: ['Four programmes with full curriculum', 'Validated registration form', 'Lead pipeline that can be swapped for Sheets or an API'],
    preview: (
      <div className="relative h-full overflow-hidden bg-night-950 p-5">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-plasma/40 blur-3xl" />
        <div className="absolute -bottom-12 left-10 size-40 rounded-full bg-electric/40 blur-3xl" />
        <p className="relative font-grotesk text-[10px] uppercase tracking-widest text-ion">Arcline</p>
        <p className="relative mt-2 max-w-[70%] font-grotesk text-xl font-semibold leading-tight text-white">
          Don’t Just Learn AI. <span className="bg-gradient-to-r from-electric to-plasma bg-clip-text text-transparent">Build With It.</span>
        </p>
        <div className="relative mt-3 flex gap-2">
          <div className="h-6 w-20 rounded-full bg-white" />
          <div className="h-6 w-20 rounded-full border border-white/20" />
        </div>
      </div>
    ),
  },
  {
    to: '/studio',
    n: '03',
    name: 'AI Content Studio',
    kind: 'AI carousel creation dashboard',
    icon: Sparkles,
    accent: 'from-violet-600 to-indigo-500',
    ring: 'group-hover:ring-violet-500/40',
    points: ['Six-step workflow from idea to editable carousel', 'Finished 7-slide “AI in Animal Healthcare” sample', 'PDF and PNG export, plus the automation architecture'],
    preview: (
      <div className="flex h-full bg-zinc-50">
        <div className="w-14 border-r border-zinc-200 bg-white p-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`mb-1.5 h-2 rounded ${i === 1 ? 'bg-violet-500' : 'bg-zinc-200'}`} />
          ))}
        </div>
        <div className="flex flex-1 items-center justify-center gap-2 p-4">
          {['bg-forest-900', 'bg-[#f6f1e7]', 'bg-forest-900'].map((c, i) => (
            <div key={i} className={`aspect-[4/5] w-1/4 rounded-md shadow-md ${c} ${i === 1 ? 'scale-110 ring-2 ring-violet-500' : ''}`} />
          ))}
        </div>
      </div>
    ),
  },
]

export function HubPage() {
  return (
    <main className="min-h-[calc(100vh-40px)] bg-[#f4f3ef]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-sm font-medium text-ink/50">Product Development, Design & AI Systems Intern · Assignment</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
          Three products, built as working prototypes.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/60 sm:text-lg">
          Each one has its own brand and runs on the same React, TypeScript and Tailwind design system. All data is sample data.
          Where an integration is mocked, the interface says so.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {deliverables.map((d) => (
            <Link
              key={d.to}
              to={d.to}
              className={`group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl ${d.ring} hover:ring-2`}
            >
              <div className="aspect-[16/9] overflow-hidden border-b border-black/5">{d.preview}</div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br text-white ${d.accent}`}>
                    <d.icon className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-ink/30">{d.n}</span>
                </div>
                <h2 className="mt-4 text-xl font-semibold tracking-tight">{d.name}</h2>
                <p className="text-sm text-ink/50">{d.kind}</p>
                <ul className="mt-4 space-y-2 text-sm text-ink/70">
                  {d.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" /> {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-ink">
                  Open prototype <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-4 rounded-3xl border border-black/5 bg-white/60 p-6 text-sm text-ink/60 sm:grid-cols-3">
          <p><strong className="text-ink">Stack</strong> · React 19, TypeScript, Tailwind CSS v4, React Router, Lucide icons.</p>
          <p><strong className="text-ink">State</strong> · Local state and localStorage. Leads, listings and carousel drafts persist in the browser.</p>
          <p><strong className="text-ink">Integrations</strong> · AI generation is mocked behind a provider interface. PDF and PNG export work for real.</p>
        </div>
      </div>
    </main>
  )
}
