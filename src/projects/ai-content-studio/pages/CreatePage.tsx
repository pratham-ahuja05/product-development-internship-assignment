import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Brain, Check, Lightbulb, ListOrdered, Loader2, Palette, PenLine, RefreshCw, Sparkles, Target, Type, Wand2,
} from 'lucide-react'
import { Field } from '@/components/Field'
import { InstagramIcon as Instagram, LinkedinIcon as Linkedin } from '@/components/BrandIcons'
import { useToast } from '@/components/Toast'
import { cn } from '@/lib/cn'
import { aiProvider } from '../ai'
import { ScaledSlide } from '../SlideCanvas'
import { SAMPLE_BRIEF } from '../sampleCarousel'
import { useStudio } from '../store'
import { TEMPLATES } from '../templates'
import { THEMES } from '../themes'
import type { Brief, Research, Slide, ThemeId, Tone, VisualDirection } from '../types'
import { btn } from '../ui'

const STEPS = ['Idea', 'Research', 'Content', 'Design', 'Edit', 'Export']
const TONES: Tone[] = ['Educational', 'Professional', 'Conversational']

const LOADING_COPY: Record<number, string[]> = {
  2: ['Understanding your idea', 'Analysing your audience', 'Extracting key insights', 'Choosing an angle', 'Structuring the outline'],
  3: ['Writing the cover hook', 'Drafting slide copy', 'Adding concrete examples', 'Writing the closing CTA', 'Validating JSON output'],
  4: ['Selecting a colour palette', 'Pairing typography', 'Choosing a layout system', 'Rendering design variations'],
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="no-scrollbar flex items-center gap-1 overflow-x-auto" aria-label="Progress">
      {STEPS.map((s, i) => {
        const n = i + 1
        const done = n < step
        const active = n === step
        return (
          <li key={s} className="flex shrink-0 items-center gap-1">
            <span className={cn('flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-medium transition',
              active ? 'bg-violet-600 text-white' : done ? 'text-violet-700' : 'text-zinc-400')} aria-current={active ? 'step' : undefined}>
              <span className={cn('grid size-6 place-items-center rounded-full text-xs font-semibold',
                active ? 'bg-white/20' : done ? 'bg-violet-100' : 'bg-zinc-100')}>
                {done ? <Check className="size-3.5" /> : n}
              </span>
              {s}
            </span>
            {i < STEPS.length - 1 && <span className={cn('h-px w-5', done ? 'bg-violet-300' : 'bg-zinc-200')} />}
          </li>
        )
      })}
    </ol>
  )
}

function Loading({ step }: { step: number }) {
  const lines = LOADING_COPY[step]
  const [i, setI] = useState(0)
  useEffect(() => {
    setI(0)
    const t = setInterval(() => setI((x) => Math.min(x + 1, lines.length - 1)), 420)
    return () => clearInterval(t)
  }, [step, lines.length])
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center" role="status" aria-live="polite">
      <div className="relative grid size-16 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-violet-400/30" />
        <span className="relative grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/30">
          <Sparkles className="size-7" />
        </span>
      </div>
      <ul className="mt-8 w-full space-y-2 text-left">
        {lines.map((l, k) => (
          <li key={l} className={cn('flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition', k < i ? 'text-zinc-500' : k === i ? 'bg-white font-medium text-zinc-900 shadow-sm ring-1 ring-zinc-200' : 'text-zinc-300')}>
            {k < i ? <Check className="size-4 text-emerald-500" /> : k === i ? <Loader2 className="size-4 animate-spin text-violet-600" /> : <span className="size-4" />}
            {l}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs text-zinc-400">{aiProvider.isMock ? 'Mock engine: simulated latency, predefined structured content.' : aiProvider.label}</p>
    </div>
  )
}

function Card({ icon: Icon, title, children, className }: { icon: typeof Brain; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-2xl border border-zinc-200 bg-white p-5', className)}>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-500"><Icon className="size-4 text-violet-600" /> {title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

/** Remount the flow whenever the chosen template changes so the brief re-initialises. */
export function CreatePage() {
  const [params] = useSearchParams()
  return <CreateFlow key={params.get('template') ?? 'blank'} templateId={params.get('template')} />
}

function CreateFlow({ templateId }: { templateId: string | null }) {
  const template = TEMPLATES.find((t) => t.id === templateId)
  const { brand, createProject } = useStudio()
  const navigate = useNavigate()
  const toast = useToast()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [brief, setBrief] = useState<Brief>({ topic: '', audience: '', platform: 'linkedin', tone: 'Educational', slideCount: 7, ...template?.brief })
  const [errors, setErrors] = useState<{ topic?: string; audience?: string }>({})
  const [research, setResearch] = useState<Research | null>(null)
  const [slides, setSlides] = useState<Slide[]>([])
  const [visual, setVisual] = useState<VisualDirection | null>(null)
  const [themeId, setThemeId] = useState<ThemeId>(template?.themeId ?? brand.defaultTheme)

  useEffect(() => { window.scrollTo({ top: 0 }) }, [step])

  const run = async <T,>(nextStep: number, fn: () => Promise<T>, apply: (v: T) => void) => {
    setStep(nextStep)
    setLoading(true)
    try {
      apply(await fn())
    } catch (e) {
      toast((e as Error).message || 'Generation failed', 'error')
      setStep(nextStep - 1)
    } finally {
      setLoading(false)
    }
  }

  const startResearch = () => {
    const e: typeof errors = {}
    if (brief.topic.trim().length < 8) e.topic = 'Describe your idea in at least a few words'
    if (brief.audience.trim().length < 3) e.audience = 'Who is this carousel for?'
    setErrors(e)
    if (Object.keys(e).length) return
    run(2, () => aiProvider.research(brief), setResearch)
  }
  const startWriting = () => research && run(3, () => aiProvider.writeSlides(brief, research), setSlides)
  const startDesign = () => research && run(4, () => aiProvider.designDirection(brief, research), (v) => { setVisual(v); if (!template) setThemeId(v.variations[0]) })

  const openEditor = () => {
    if (!research || !visual) return
    const p = createProject({ title: research.headline, brief, research, visual, slides, themeId, aspect: 'portrait' })
    toast('Carousel created. Now fine-tune it.')
    navigate(`/studio/editor/${p.id}`)
  }

  const updateSlide = (id: string, patch: Partial<Slide>) => setSlides((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  const coverPreview = useMemo(() => slides[0], [slides])

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">Create carousel</h1>
          <p className="mt-1 text-sm text-zinc-500">{template ? `Template: ${template.name}` : 'From raw idea to an editable, on-brand carousel.'}</p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200">{aiProvider.isMock ? 'Mock AI · no API calls' : 'Live AI'}</span>
      </div>
      <div className="mt-6"><Stepper step={step} /></div>

      <div className="mt-8">
        {loading ? <Loading step={step} /> : (
          <>
            {/* ------------------------- STEP 1 ------------------------- */}
            {step === 1 && (
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
                  <Field label="Topic or raw idea" tone="studio" required error={errors.topic} hint="Paste a rough thought. The AI will shape it.">
                    {(p) => <textarea {...p} rows={3} value={brief.topic} onChange={(e) => setBrief({ ...brief, topic: e.target.value })} placeholder="e.g. How small clinics can use AI to reduce missed appointments" />}
                  </Field>
                  <Field label="Target audience" tone="studio" required error={errors.audience}>
                    {(p) => <input {...p} value={brief.audience} onChange={(e) => setBrief({ ...brief, audience: e.target.value })} placeholder="e.g. Veterinary clinic owners in India" />}
                  </Field>

                  <fieldset>
                    <legend className="text-sm font-medium text-zinc-700">Platform</legend>
                    <div className="mt-1.5 grid grid-cols-2 gap-2">
                      {([['linkedin', 'LinkedIn', Linkedin, 'PDF document post'], ['instagram', 'Instagram', Instagram, '4:5 image carousel']] as const).map(([id, label, Icon, sub]) => (
                        <label key={id} className={cn('flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-violet-100', brief.platform === id ? 'border-violet-500 bg-violet-50' : 'border-zinc-200 hover:border-zinc-300')}>
                          <input type="radio" name="platform" className="sr-only" checked={brief.platform === id} onChange={() => setBrief({ ...brief, platform: id })} />
                          <Icon className={cn('size-5', brief.platform === id ? 'text-violet-600' : 'text-zinc-400')} />
                          <span><span className="block text-sm font-semibold">{label}</span><span className="block text-xs text-zinc-500">{sub}</span></span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-sm font-medium text-zinc-700">Tone</legend>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {TONES.map((t) => (
                        <button key={t} type="button" onClick={() => setBrief({ ...brief, tone: t })} aria-pressed={brief.tone === t}
                          className={cn('rounded-full border px-4 py-2 text-sm font-medium transition', brief.tone === t ? 'border-violet-600 bg-violet-600 text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-300')}>{t}</button>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="slide-count" className="flex justify-between text-sm font-medium text-zinc-700">Number of slides <span className="font-semibold text-violet-700">{brief.slideCount}</span></label>
                    <input id="slide-count" type="range" min={4} max={10} value={brief.slideCount} onChange={(e) => setBrief({ ...brief, slideCount: Number(e.target.value) })} className="mt-2 w-full accent-violet-600" />
                    <div className="flex justify-between text-xs text-zinc-400"><span>4</span><span>Cover + {brief.slideCount - 2} content + CTA</span><span>10</span></div>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-100 pt-5">
                    <button onClick={startResearch} className={btn.primary}><Wand2 className="size-4" /> Research & structure</button>
                  </div>
                </div>

                <aside className="space-y-4">
                  <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-5 text-white">
                    <p className="text-sm font-semibold">Try the sample brief</p>
                    <p className="mt-1 text-sm text-white/75">“{SAMPLE_BRIEF.topic}”, the required 7-slide carousel.</p>
                    <button onClick={() => { setBrief(SAMPLE_BRIEF); setErrors({}); setThemeId('forest') }} className="mt-4 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-violet-700">Use sample</button>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600">
                    <p className="font-semibold text-zinc-900">What happens next</p>
                    <ol className="mt-3 space-y-2">
                      {['Research: summary, insights, angle and outline', 'Content: every slide written, with examples', 'Design: palette, type and layout variations', 'Edit everything, then export as PDF or PNG'].map((s, i) => (
                        <li key={s} className="flex gap-2.5"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-violet-100 text-[11px] font-semibold text-violet-700">{i + 2}</span>{s}</li>
                      ))}
                    </ol>
                  </div>
                </aside>
              </div>
            )}

            {/* ------------------------- STEP 2 ------------------------- */}
            {step === 2 && research && (
              <div className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-2">
                  <Card icon={Brain} title="Topic summary"><p className="leading-relaxed text-zinc-700">{research.summary}</p></Card>
                  <Card icon={Target} title="Suggested angle"><p className="leading-relaxed text-zinc-700">{research.angle}</p></Card>
                </div>
                <Card icon={Lightbulb} title="Key insights">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {research.insights.map((ins) => <li key={ins} className="flex gap-2.5 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700"><Sparkles className="mt-0.5 size-4 shrink-0 text-violet-500" />{ins}</li>)}
                  </ul>
                </Card>
                <Card icon={Type} title="Carousel headline (editable)">
                  <label htmlFor="headline" className="sr-only">Headline</label>
                  <input id="headline" value={research.headline} onChange={(e) => setResearch({ ...research, headline: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-lg font-semibold outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" />
                </Card>
                <Card icon={ListOrdered} title="Slide-by-slide outline">
                  <ol className="divide-y divide-zinc-100">
                    {research.outline.map((o, i) => (
                      <li key={i} className="flex gap-4 py-2.5">
                        <span className="w-6 shrink-0 font-mono text-sm text-zinc-400">{String(i + 1).padStart(2, '0')}</span>
                        <span><span className="block text-sm font-semibold">{o.title}</span><span className="text-sm text-zinc-500">{o.point}</span></span>
                      </li>
                    ))}
                  </ol>
                </Card>
                <div className="flex flex-wrap justify-between gap-2">
                  <button onClick={() => setStep(1)} className={btn.ghost}><ArrowLeft className="size-4" /> Edit brief</button>
                  <div className="flex gap-2">
                    <button onClick={() => run(2, () => aiProvider.research(brief), setResearch)} className={btn.secondary}><RefreshCw className="size-4" /> Regenerate</button>
                    <button onClick={startWriting} className={btn.primary}><PenLine className="size-4" /> Write the slides</button>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------- STEP 3 ------------------------- */}
            {step === 3 && (
              <div className="space-y-5">
                <p className="text-sm text-zinc-500">Review the generated copy. Edit anything here, or later in the visual editor.</p>
                <div className="grid gap-4 md:grid-cols-2">
                  {slides.map((s, i) => (
                    <article key={s.id} className={cn('rounded-2xl border bg-white p-5', s.kind === 'content' ? 'border-zinc-200' : 'border-violet-200 bg-violet-50/40')}>
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        <span className="font-mono">{String(i + 1).padStart(2, '0')}</span>
                        <span className={cn('rounded-full px-2 py-0.5 normal-case tracking-normal', s.kind === 'cover' ? 'bg-violet-600 text-white' : s.kind === 'cta' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600')}>
                          {s.kind === 'cover' ? 'Cover' : s.kind === 'cta' ? 'Final CTA' : s.eyebrow}
                        </span>
                      </div>
                      <label className="sr-only" htmlFor={`t-${s.id}`}>Slide {i + 1} title</label>
                      <textarea id={`t-${s.id}`} rows={2} value={s.title} onChange={(e) => updateSlide(s.id, { title: e.target.value })}
                        className="mt-3 w-full resize-none rounded-lg border border-transparent px-2 py-1 -mx-2 text-lg font-semibold leading-snug outline-none hover:border-zinc-200 focus:border-violet-400" />
                      <label className="sr-only" htmlFor={`b-${s.id}`}>Slide {i + 1} body</label>
                      <textarea id={`b-${s.id}`} rows={3} value={s.body} onChange={(e) => updateSlide(s.id, { body: e.target.value })}
                        className="w-full resize-none rounded-lg border border-transparent px-2 py-1 -mx-2 text-sm leading-relaxed text-zinc-600 outline-none hover:border-zinc-200 focus:border-violet-400" />
                      {s.example && <p className="mt-2 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600"><span className="font-semibold text-zinc-800">Example: </span>{s.example}</p>}
                      {s.cta && <p className="mt-2 inline-flex rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">{s.cta}</p>}
                    </article>
                  ))}
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <button onClick={() => setStep(2)} className={btn.ghost}><ArrowLeft className="size-4" /> Back to research</button>
                  <div className="flex gap-2">
                    <button onClick={startWriting} className={btn.secondary}><RefreshCw className="size-4" /> Rewrite</button>
                    <button onClick={startDesign} className={btn.primary}><Palette className="size-4" /> Design it</button>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------- STEP 4 ------------------------- */}
            {step === 4 && visual && coverPreview && (
              <div className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-3">
                  <Card icon={Palette} title="Colour palette">
                    <div className="flex gap-2">
                      {visual.palette.map((c) => (
                        <div key={c.role} className="flex-1 text-center">
                          <div className="h-14 rounded-xl ring-1 ring-black/10" style={{ background: c.hex }} />
                          <p className="mt-1.5 text-[11px] font-medium text-zinc-700">{c.role}</p>
                          <p className="font-mono text-[10px] text-zinc-400">{c.hex}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card icon={Type} title="Typography">
                    <p className="text-sm"><span className="text-zinc-500">Headings:</span> <strong>{visual.typography.heading}</strong></p>
                    <p className="text-sm"><span className="text-zinc-500">Body:</span> <strong>{visual.typography.body}</strong></p>
                    <p className="mt-2 text-sm text-zinc-500">{visual.typography.note}</p>
                  </Card>
                  <Card icon={ListOrdered} title="Layout & visual elements">
                    <p className="text-sm text-zinc-700">{visual.layout}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {visual.elements.map((e) => <span key={e} className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600">{e}</span>)}
                    </div>
                  </Card>
                </div>

                <section className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-zinc-500">Slide design variations: pick one</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3" role="radiogroup">
                    {visual.variations.map((v, i) => (
                      <button key={v} role="radio" aria-checked={themeId === v} onClick={() => setThemeId(v)}
                        className={cn('rounded-2xl border p-3 text-left transition', themeId === v ? 'border-violet-500 ring-4 ring-violet-100' : 'border-zinc-200 hover:border-zinc-300')}>
                        <div className="grid grid-cols-2 gap-1.5">
                          <ScaledSlide slide={coverPreview} index={0} total={slides.length} themeId={v} aspect="portrait" brand={brand} className="rounded-md" />
                          <ScaledSlide slide={slides[1] ?? coverPreview} index={1} total={slides.length} themeId={v} aspect="portrait" brand={brand} className="rounded-md" />
                        </div>
                        <p className="mt-3 flex items-center gap-2 text-sm font-semibold">
                          {THEMES[v].name} {i === 0 && <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] text-violet-700">AI pick</span>}
                          {themeId === v && <Check className="ml-auto size-4 text-violet-600" />}
                        </p>
                        <p className="text-xs text-zinc-500">{THEMES[v].description}</p>
                      </button>
                    ))}
                  </div>
                </section>

                <div className="flex flex-wrap justify-between gap-2">
                  <button onClick={() => setStep(3)} className={btn.ghost}><ArrowLeft className="size-4" /> Back to content</button>
                  <button onClick={openEditor} className={btn.primary}>Open in editor <ArrowRight className="size-4" /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
