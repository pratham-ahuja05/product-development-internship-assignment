import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Clock, Menu, Minus, Plus, Signal, Target, Users, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { FAQS, JOURNEY, PROGRAMMES, SHOWCASE, WHY, programmeById, type ProgrammeId } from './data'
import { HeroVisual } from './HeroVisual'
import { RegistrationForm } from './RegistrationForm'

const NAV = [
  { href: '#programmes', label: 'Programmes' },
  { href: '#curriculum', label: 'Curriculum' },
  { href: '#outcomes', label: 'Outcomes' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <defs><linearGradient id="arc-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4f7cff" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient></defs>
        <rect width="32" height="32" rx="9" fill="url(#arc-g)" />
        <path d="M8 23 L16 8 L24 23" stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.5 17.5 Q16 13 20.5 17.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7" />
      </svg>
      <span className="font-grotesk text-xl font-semibold tracking-tight text-white">Arcline</span>
    </span>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-grotesk text-sm font-medium text-ion">{children}</p>
}
function H2({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn('mt-3 font-grotesk text-3xl font-semibold tracking-tight text-white sm:text-[44px] sm:leading-[1.1]', className)}>{children}</h2>
}

export function EducationPage() {
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [selected, setSelected] = useState<ProgrammeId | ''>('')
  const [curriculumTab, setCurriculumTab] = useState<ProgrammeId>('genai')
  const [openModule, setOpenModule] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [showcaseFilter, setShowcaseFilter] = useState<ProgrammeId | 'all'>('all')

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const applyFor = (id: ProgrammeId) => { setSelected(id); go('apply') }
  const viewCurriculum = (id: ProgrammeId) => { setCurriculumTab(id); setOpenModule(0); go('curriculum') }
  const prog = programmeById(curriculumTab)!

  return (
    <div className="min-h-screen bg-night-950 font-sans text-white selection:bg-electric/40">
      {/* ------------------------------ Nav ------------------------------ */}
      <header className={cn('sticky top-0 z-40 transition-all', scrolled ? 'border-b border-white/5 bg-night-950/80 backdrop-blur-xl' : 'bg-transparent')}>
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-4 sm:px-6">
          <a href="#top" aria-label="Arcline home"><Logo /></a>
          <nav aria-label="Primary" className="mx-auto hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 md:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="rounded-full px-4 py-1.5 text-sm text-white/65 transition hover:bg-white/10 hover:text-white">{n.label}</a>
            ))}
          </nav>
          <a href="#apply" className="ml-auto hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-night-950 transition hover:bg-white/90 md:ml-0 md:inline-flex">Apply Now</a>
          <button className="ml-auto rounded-lg p-2 md:hidden" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="arc-menu" aria-label={menu ? 'Close menu' : 'Open menu'}>
            {menu ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
        {menu && (
          <nav id="arc-menu" aria-label="Mobile" className="animate-fade-up border-t border-white/10 bg-night-900 px-4 pb-5 pt-2 md:hidden">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setMenu(false)} className="block border-b border-white/5 py-3.5 text-base text-white/80">{n.label}</a>
            ))}
            <a href="#apply" onClick={() => setMenu(false)} className="mt-4 block rounded-full bg-white py-3 text-center font-semibold text-night-950">Apply Now</a>
          </nav>
        )}
      </header>

      <main id="top" className="-mt-[72px]">
        {/* ------------------------------ Hero ----------------------------- */}
        <section className="relative overflow-hidden pt-[72px]">
          <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          <div className="pointer-events-none absolute -left-40 top-0 size-[600px] rounded-full bg-electric/20 blur-[120px]" />
          <div className="pointer-events-none absolute -right-40 top-40 size-[500px] rounded-full bg-plasma/20 blur-[120px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pb-28 lg:pt-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70">
                <span className="size-1.5 animate-pulse rounded-full bg-ion" /> Applications open for the next cohort
              </p>
              <h1 className="mt-6 font-grotesk text-[46px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-7xl">
                Don’t Just Learn AI.
                <br />
                <span className="bg-gradient-to-r from-electric via-plasma to-ion bg-clip-text text-transparent">Build With It.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
                Hands-on programmes in generative AI, automation, analytics and AI product building, for students, graduates and young professionals.
                You’ll work with the tools teams use today and finish with a portfolio of things you actually built.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#programmes" className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-night-950 transition hover:bg-white/90">
                  Explore Programmes <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </a>
                <a href="#apply" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.06]">
                  Apply Now
                </a>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
                {['Live, small cohorts', 'Project-first learning', 'Portfolio you can show'].map((t) => (
                  <li key={t} className="flex items-center gap-2"><Check className="size-4 text-ion" /> {t}</li>
                ))}
              </ul>
            </div>
            <HeroVisual />
          </div>
        </section>

        {/* -------------------------- Why learn ---------------------------- */}
        <section id="about" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <Eyebrow>Why learn with us</Eyebrow>
              <H2>Built for people who want to make things, not collect certificates.</H2>
              <p className="mt-5 text-white/55">
                Arcline is an AI education and digital-skills programme. We teach the way strong teams work: understand the problem, pick the right tool, build, test and show your work.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {WHY.map((w, i) => (
                <div key={w.title} className={cn('group rounded-2xl border border-white/8 bg-white/[0.025] p-6 transition hover:border-electric/40 hover:bg-white/[0.04]', i === 0 && 'sm:col-span-2')}>
                  <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-electric/20 to-plasma/20 text-electric ring-1 ring-inset ring-white/10">
                    <w.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-grotesk text-lg font-semibold">{w.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------- Programmes --------------------------- */}
        <section id="programmes" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Programmes</Eyebrow>
              <H2>Four tracks. One way of learning: build.</H2>
            </div>
            <p className="max-w-sm text-sm text-white/50">Not sure which fits you? Register and we’ll help you choose on a free counselling call.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {PROGRAMMES.map((p) => {
              const isSel = selected === p.id
              return (
                <article key={p.id} className={cn('group relative flex flex-col overflow-hidden rounded-3xl border bg-night-900 p-7 transition',
                  isSel ? 'border-electric shadow-[0_0_0_1px_rgba(79,124,255,0.6),0_20px_60px_-20px_rgba(79,124,255,0.5)]' : 'border-white/8 hover:border-white/20')}>
                  <div className={cn('pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-gradient-to-br opacity-25 blur-3xl transition group-hover:opacity-40', p.gradient)} />
                  <div className="relative flex items-start justify-between gap-3">
                    <span className={cn('h-1.5 w-12 rounded-full bg-gradient-to-r', p.gradient)} />
                    {isSel && <span className="flex items-center gap-1 rounded-full bg-electric/15 px-2.5 py-1 text-xs font-medium text-electric"><Check className="size-3.5" /> Selected</span>}
                  </div>
                  <h3 className="relative mt-5 font-grotesk text-2xl font-semibold tracking-tight">{p.name}</h3>
                  <p className="relative mt-2 text-white/60">{p.tagline}</p>
                  <dl className="relative mt-5 flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5"><Clock className="size-3.5 text-white/40" /><dt className="sr-only">Duration</dt><dd>{p.duration}</dd></div>
                    <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5"><Signal className="size-3.5 text-white/40" /><dt className="sr-only">Level</dt><dd>{p.level}</dd></div>
                    <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5"><Users className="size-3.5 text-white/40" /><dt className="sr-only">Format</dt><dd>{p.format}</dd></div>
                  </dl>
                  <p className="relative mt-5 text-sm text-white/50"><span className="text-white/80">For:</span> {p.forWho}</p>
                  <div className="relative mt-5 flex flex-wrap gap-1.5">
                    {p.tools.map((t) => <span key={t} className="rounded-md border border-white/10 px-2 py-1 font-mono text-[11px] text-white/60">{t}</span>)}
                  </div>
                  <div className="relative mt-auto flex flex-wrap gap-2 pt-7">
                    <button onClick={() => applyFor(p.id)} className={cn('rounded-full px-5 py-2.5 text-sm font-semibold transition', isSel ? 'bg-electric text-white' : 'bg-white text-night-950 hover:bg-white/90')}>
                      {isSel ? 'Continue to apply' : 'Select programme'}
                    </button>
                    <button onClick={() => viewCurriculum(p.id)} className="inline-flex items-center gap-1 rounded-full px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white">
                      View curriculum <ArrowUpRight className="size-4" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* -------------------------- Curriculum --------------------------- */}
        <section id="curriculum" className="relative border-y border-white/5 bg-night-900/60 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Eyebrow>Curriculum</Eyebrow>
            <H2>What you’ll learn, week by week.</H2>
            <div role="tablist" aria-label="Programme curriculum" className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              {PROGRAMMES.map((p) => (
                <button key={p.id} role="tab" aria-selected={curriculumTab === p.id} onClick={() => { setCurriculumTab(p.id); setOpenModule(0) }}
                  className={cn('shrink-0 rounded-full border px-4 py-2 text-sm transition', curriculumTab === p.id ? 'border-white bg-white font-semibold text-night-950' : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white')}>
                  {p.name}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]" role="tabpanel">
              <ol className="space-y-3">
                {prog.modules.map((m, i) => {
                  const open = openModule === i
                  return (
                    <li key={m.title} className={cn('rounded-2xl border transition', open ? 'border-electric/40 bg-white/[0.04]' : 'border-white/8 bg-white/[0.02]')}>
                      <button onClick={() => setOpenModule(open ? -1 : i)} aria-expanded={open} className="flex w-full items-center gap-4 p-5 text-left">
                        <span className="font-mono text-sm text-white/35">{String(i + 1).padStart(2, '0')}</span>
                        <span className="flex-1">
                          <span className="block font-grotesk text-lg font-medium">{m.title}</span>
                          <span className="text-xs text-white/45">{m.weeks}</span>
                        </span>
                        <ChevronDown className={cn('size-5 text-white/40 transition', open && 'rotate-180')} />
                      </button>
                      {open && (
                        <div className="grid gap-5 px-5 pb-5 sm:grid-cols-2 sm:pl-14">
                          <ul className="space-y-2 text-sm text-white/70">
                            {m.topics.map((t) => <li key={t} className="flex gap-2"><span className="mt-2 size-1 shrink-0 rounded-full bg-ion" />{t}</li>)}
                          </ul>
                          <div className="rounded-xl bg-gradient-to-br from-electric/10 to-plasma/10 p-4 ring-1 ring-inset ring-white/10">
                            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-ion"><Target className="size-3.5" /> Learning outcome</p>
                            <p className="mt-1.5 text-sm text-white/85">{m.outcome}</p>
                          </div>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ol>
              <aside className="h-fit rounded-2xl border border-white/8 bg-night-950 p-6 lg:sticky lg:top-24">
                <span className={cn('block h-1.5 w-12 rounded-full bg-gradient-to-r', prog.gradient)} />
                <h3 className="mt-4 font-grotesk text-xl font-semibold">{prog.name}</h3>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-white/45">Duration</dt><dd>{prog.duration}</dd></div>
                  <div className="flex justify-between"><dt className="text-white/45">Level</dt><dd>{prog.level}</dd></div>
                  <div className="flex justify-between"><dt className="text-white/45">Modules</dt><dd>{prog.modules.length}</dd></div>
                </dl>
                <p className="mt-5 text-xs font-medium uppercase tracking-wider text-white/40">Capstone</p>
                <p className="mt-1.5 text-sm text-white/75">{prog.capstone}</p>
                <button onClick={() => applyFor(prog.id)} className="mt-6 w-full rounded-full bg-white py-3 text-sm font-semibold text-night-950 hover:bg-white/90">Apply for this programme</button>
              </aside>
            </div>
          </div>
        </section>

        {/* --------------------------- Outcomes ---------------------------- */}
        <section id="outcomes" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Project showcase</Eyebrow>
              <H2>The kind of work you’ll ship.</H2>
              <p className="mt-4 max-w-xl text-white/55">Sample project briefs from across our tracks. Each one becomes a portfolio case study covering the problem, your approach, the build and what you learned.</p>
            </div>
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
              {(['all', ...PROGRAMMES.map((p) => p.id)] as const).map((id) => (
                <button key={id} onClick={() => setShowcaseFilter(id)} aria-pressed={showcaseFilter === id}
                  className={cn('shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition', showcaseFilter === id ? 'bg-white text-night-950' : 'bg-white/5 text-white/60 hover:text-white')}>
                  {id === 'all' ? 'All tracks' : programmeById(id)!.name.split(' ').slice(0, 2).join(' ').replace(/&$/, '')}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE.filter((s) => showcaseFilter === 'all' || s.programme === showcaseFilter).map((s, i) => {
              const p = programmeById(s.programme)!
              return (
                <article key={s.title} className="group relative overflow-hidden rounded-2xl border border-white/8 bg-night-900 transition hover:-translate-y-1 hover:border-white/20">
                  <div className="relative h-36 overflow-hidden border-b border-white/5 bg-night-800">
                    <div className={cn('absolute inset-0 bg-gradient-to-br opacity-30', p.gradient)} />
                    <MiniArt variant={i % 3} />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-white/40">{p.name}</p>
                    <h3 className="mt-1 font-grotesk text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{s.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {s.stack.map((t) => <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/60">{t}</span>)}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Journey */}
          <div className="mt-24">
            <Eyebrow>Learning journey</Eyebrow>
            <H2>Discover → Learn → Build → Showcase</H2>
            <ol className="relative mt-12 grid gap-4 md:grid-cols-4">
              <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-electric via-plasma to-ion opacity-50 md:block" aria-hidden />
              {JOURNEY.map((j, i) => (
                <li key={j.step} className="relative rounded-2xl border border-white/8 bg-night-950 p-6">
                  <span className="relative grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-electric to-plasma shadow-lg shadow-plasma/20">
                    <j.icon className="size-6" />
                  </span>
                  <p className="mt-5 font-mono text-xs text-white/35">Step {i + 1}</p>
                  <h3 className="font-grotesk text-xl font-semibold">{j.step}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{j.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------ FAQ ------------------------------ */}
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <H2>Questions, answered.</H2>
            <p className="mt-4 text-white/55">Still unsure? <a href="#apply" className="text-white underline underline-offset-4">Register your interest</a> and we’ll call you.</p>
          </div>
          <div className="divide-y divide-white/8 border-y border-white/8">
            {FAQS.map((f, i) => {
              const open = openFaq === i
              return (
                <div key={f.q}>
                  <h3>
                    <button onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open} className="flex w-full items-center justify-between gap-6 py-5 text-left font-grotesk text-lg font-medium">
                      {f.q}
                      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10">{open ? <Minus className="size-4" /> : <Plus className="size-4" />}</span>
                    </button>
                  </h3>
                  {open && <p className="animate-fade-up pb-5 pr-12 leading-relaxed text-white/60">{f.a}</p>}
                </div>
              )
            })}
          </div>
        </section>

        {/* -------------------------- Registration ------------------------- */}
        <section id="apply" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <RegistrationForm programme={selected} onProgrammeChange={setSelected} />
        </section>
      </main>

      {/* ----------------------------- Footer ------------------------------ */}
      <footer id="contact" className="border-t border-white/5 bg-night-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-white/50">Practical AI education for students, graduates and young professionals. Don’t just learn AI. Build with it.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Programmes</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/55">
              {PROGRAMMES.map((p) => <li key={p.id}><button onClick={() => viewCurriculum(p.id)} className="text-left hover:text-white">{p.name}</button></li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/55">
              {NAV.slice(0, 4).map((n) => <li key={n.href}><a href={n.href} className="hover:text-white">{n.label}</a></li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/55">
              <li>admissions@arcline.example</li>
              <li>Mon–Sat, 10 AM – 7 PM IST</li>
              <li><a href="#apply" className="text-ion hover:underline">Book a counselling call →</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5">
          <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-white/35 sm:px-6">
            © {new Date().getFullYear()} Arcline · Prototype landing page. Programme details are illustrative. No testimonials, placement figures or partnerships are claimed.
          </p>
        </div>
      </footer>
    </div>
  )
}

/** Lightweight abstract thumbnails for project cards (no stock imagery needed). */
function MiniArt({ variant }: { variant: number }) {
  if (variant === 0)
    return (
      <svg viewBox="0 0 300 140" className="absolute inset-0 size-full" aria-hidden>
        {[[40, 70], [120, 35], [120, 105], [200, 70], [260, 70]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" fill="white" fillOpacity=".85" />)}
        <path d="M40 70 L120 35 L200 70 L260 70 M40 70 L120 105 L200 70" stroke="white" strokeOpacity=".4" strokeWidth="1.5" fill="none" strokeDasharray="4 4" className="animate-dash" />
      </svg>
    )
  if (variant === 1)
    return (
      <div className="absolute inset-0 flex items-end gap-2 px-8 pb-6" aria-hidden>
        {[40, 65, 50, 85, 70, 95, 60].map((h, i) => <div key={i} className="flex-1 rounded-t bg-white/70" style={{ height: `${h}%`, opacity: 0.35 + i * 0.08 }} />)}
      </div>
    )
  return (
    <div className="absolute inset-0 grid place-items-center p-6" aria-hidden>
      <div className="w-full max-w-[220px] space-y-2 rounded-lg border border-white/20 bg-night-950/60 p-3 font-mono text-[10px] text-white/70 backdrop-blur">
        <p><span className="text-ion">user</span> › summarise this week’s sources</p>
        <p><span className="text-plasma">ai</span> › 3 key shifts, 5 citations…</p>
        <div className="h-1.5 w-2/3 rounded bg-white/20" />
      </div>
    </div>
  )
}
