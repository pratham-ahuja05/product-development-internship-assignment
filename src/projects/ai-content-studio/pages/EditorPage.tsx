import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useBlocker, useParams } from 'react-router-dom'
import {
  ArrowDown, ArrowLeft, ArrowUp, ChevronLeft, ChevronRight, Copy, Download, Eye, FileImage, FileText, Images, Loader2, Plus, Save, Trash2,
} from 'lucide-react'
import { Modal } from '@/components/Modal'
import { useToast } from '@/components/Toast'
import { cn, uid } from '@/lib/cn'
// Export libraries (html-to-image, jsPDF) load on demand.
const loadExporter = () => import('../exporter')
import { ScaledSlide, SlideCanvas } from '../SlideCanvas'
import { useStudio } from '../store'
import { THEME_LIST } from '../themes'
import { ASPECTS, type AspectId, type CarouselProject, type Slide, type SlideKind } from '../types'
import { btn, PlatformIcon, StatusBadge } from '../ui'

const LIMITS = { eyebrow: 28, title: 110, body: 300, example: 140, cta: 40 }

export function EditorPage() {
  const { id } = useParams()
  const { getProject } = useStudio()
  const project = id ? getProject(id) : undefined
  if (!project)
    return (
      <main className="grid flex-1 place-items-center p-10 text-center">
        <div>
          <p className="font-semibold">Project not found</p>
          <Link to="/studio/projects" className={cn(btn.primary, 'mt-4')}>Back to projects</Link>
        </div>
      </main>
    )
  return <Editor key={project.id} initial={project} />
}

function Editor({ initial }: { initial: CarouselProject }) {
  const { updateProject, brand } = useStudio()
  const toast = useToast()
  const [doc, setDoc] = useState<CarouselProject>(initial)
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState<'content' | 'design'>('content')
  const [dirty, setDirty] = useState(false)
  const [preview, setPreview] = useState(false)
  const [exporting, setExporting] = useState(false)

  const slide = doc.slides[Math.min(sel, doc.slides.length - 1)]
  const total = doc.slides.length

  const edit = (patch: Partial<CarouselProject>) => { setDoc((d) => ({ ...d, ...patch })); setDirty(true) }
  const editSlide = (patch: Partial<Slide>) => edit({ slides: doc.slides.map((s, i) => (i === sel ? { ...s, ...patch } : s)) })

  const save = (extra: Partial<CarouselProject> = {}) => {
    const next = { ...doc, ...extra }
    setDoc(next)
    updateProject(doc.id, next)
    setDirty(false)
  }

  // Warn before leaving with unsaved changes (in-app navigation + tab close).
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname)
  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (confirm('You have unsaved changes. Leave without saving?')) blocker.proceed()
      else blocker.reset()
    }
  }, [blocker])
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault() }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [dirty])

  // Keyboard: ⌘/Ctrl+S saves, ↑/↓ move between slides when not typing.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); toast('Draft saved') }
      const typing = /input|textarea|select/i.test((e.target as HTMLElement).tagName)
      if (typing || preview || exporting) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') setSel((s) => Math.min(s + 1, total - 1))
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') setSel((s) => Math.max(s - 1, 0))
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  const addSlide = () => {
    const at = Math.min(sel + 1, total - (doc.slides[total - 1]?.kind === 'cta' ? 1 : 0))
    const s: Slide = { id: uid('s'), kind: 'content', eyebrow: 'New point', title: 'Add a clear, specific heading', body: 'Explain one idea in one or two short sentences.', example: 'A concrete example makes it stick.' }
    const slides = [...doc.slides]
    slides.splice(at, 0, s)
    edit({ slides })
    setSel(at)
  }
  const removeSlide = () => {
    if (total <= 2) return toast('A carousel needs at least 2 slides', 'error')
    edit({ slides: doc.slides.filter((_, i) => i !== sel) })
    setSel((s) => Math.max(0, Math.min(s, total - 2)))
  }
  const duplicateSlide = () => {
    const slides = [...doc.slides]
    slides.splice(sel + 1, 0, { ...slide, id: uid('s') })
    edit({ slides })
    setSel(sel + 1)
  }
  const move = (dir: -1 | 1) => {
    const to = sel + dir
    if (to < 0 || to >= total) return
    const slides = [...doc.slides]
    ;[slides[sel], slides[to]] = [slides[to], slides[sel]]
    edit({ slides })
    setSel(to)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* --------------------------- Toolbar --------------------------- */}
      <header className="flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-white px-3 py-2.5 sm:px-5">
        <Link to="/studio/projects" className={cn(btn.ghost, 'px-2')} aria-label="Back to projects"><ArrowLeft className="size-4" /></Link>
        <div className="min-w-0 flex-1">
          <label htmlFor="doc-title" className="sr-only">Carousel title</label>
          <input id="doc-title" value={doc.title} onChange={(e) => edit({ title: e.target.value })}
            className="w-full truncate rounded-lg border border-transparent bg-transparent px-2 py-1 font-semibold outline-none hover:border-zinc-200 focus:border-violet-400" />
          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 px-2 text-xs text-zinc-500">
            <PlatformIcon platform={doc.brief.platform} /> {total} slides · <StatusBadge status={doc.status} />
            <span className={cn('transition', dirty ? 'text-amber-600' : 'hidden text-zinc-400 sm:inline')}>{dirty ? '● Unsaved changes' : 'All changes saved'}</span>
          </p>
        </div>
        <button onClick={() => { save(); toast('Draft saved') }} className={btn.secondary} title="Save draft (Ctrl+S)"><Save className="size-4" /><span className="hidden sm:inline">Save draft</span></button>
        <button onClick={() => setPreview(true)} className={btn.secondary}><Eye className="size-4" /><span className="hidden sm:inline">Preview</span></button>
        <button onClick={() => setExporting(true)} className={btn.primary}><Download className="size-4" /> Export</button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* ------------------------- Slide list ------------------------ */}
        <aside className="border-b border-zinc-200 bg-white lg:w-52 lg:shrink-0 lg:border-b-0 lg:border-r" aria-label="Slides">
          <div className="flex items-center justify-between px-4 pt-3 lg:pb-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Slides</p>
            <button onClick={addSlide} className="flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-semibold text-violet-700 hover:bg-violet-50"><Plus className="size-3.5" /> Add</button>
          </div>
          <ol className="no-scrollbar flex gap-3 overflow-x-auto p-3 lg:max-h-[calc(100vh-170px)] lg:flex-col lg:overflow-y-auto lg:overflow-x-visible lg:px-4">
            {doc.slides.map((s, i) => (
              <li key={s.id} className="w-24 shrink-0 lg:w-full">
                <button onClick={() => setSel(i)} aria-current={i === sel} aria-label={`Slide ${i + 1}: ${s.title}`}
                  className={cn('flex w-full items-start gap-2 rounded-lg p-1 text-left transition', i === sel ? 'bg-violet-50 ring-2 ring-violet-500' : 'hover:bg-zinc-50')}>
                  <span className="hidden w-4 pt-0.5 text-right font-mono text-[11px] text-zinc-400 lg:block">{i + 1}</span>
                  <ScaledSlide slide={s} index={i} total={total} themeId={doc.themeId} aspect={doc.aspect} brand={brand} className="flex-1 rounded shadow-sm ring-1 ring-black/5" />
                </button>
              </li>
            ))}
          </ol>
        </aside>

        {/* --------------------------- Canvas -------------------------- */}
        <section className="flex min-w-0 flex-1 flex-col items-center bg-zinc-100 px-4 py-6 lg:py-8" aria-label="Live preview">
          <div className="flex w-full max-w-[460px] items-center justify-between pb-3 text-xs text-zinc-500">
            <span>Slide {sel + 1} of {total} · {ASPECTS[doc.aspect].label}</span>
            <div className="flex gap-1">
              <button onClick={() => move(-1)} disabled={sel === 0} className="rounded-md p-1.5 hover:bg-white disabled:opacity-30" aria-label="Move slide up"><ArrowUp className="size-4" /></button>
              <button onClick={() => move(1)} disabled={sel === total - 1} className="rounded-md p-1.5 hover:bg-white disabled:opacity-30" aria-label="Move slide down"><ArrowDown className="size-4" /></button>
              <button onClick={duplicateSlide} className="rounded-md p-1.5 hover:bg-white" aria-label="Duplicate slide"><Copy className="size-4" /></button>
              <button onClick={removeSlide} className="rounded-md p-1.5 text-red-600 hover:bg-white" aria-label="Delete slide"><Trash2 className="size-4" /></button>
            </div>
          </div>
          <div className="flex w-full max-w-[560px] items-center gap-2">
            <button onClick={() => setSel(Math.max(0, sel - 1))} disabled={sel === 0} aria-label="Previous slide" className="hidden rounded-full bg-white p-2 shadow-sm disabled:opacity-30 sm:block"><ChevronLeft className="size-5" /></button>
            <div className="mx-auto w-full max-w-[460px]">
              <ScaledSlide slide={slide} index={sel} total={total} themeId={doc.themeId} aspect={doc.aspect} brand={brand} className="rounded-xl shadow-2xl shadow-zinc-900/20" />
            </div>
            <button onClick={() => setSel(Math.min(total - 1, sel + 1))} disabled={sel === total - 1} aria-label="Next slide" className="hidden rounded-full bg-white p-2 shadow-sm disabled:opacity-30 sm:block"><ChevronRight className="size-5" /></button>
          </div>
          <p className="mt-4 hidden text-xs text-zinc-400 lg:block">Tip: use ← → to switch slides and Ctrl+S to save.</p>
        </section>

        {/* -------------------------- Inspector ------------------------ */}
        <aside className="border-t border-zinc-200 bg-white lg:w-80 lg:shrink-0 lg:border-l lg:border-t-0" aria-label="Inspector">
          <div className="flex border-b border-zinc-200" role="tablist">
            {(['content', 'design'] as const).map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                className={cn('flex-1 py-3 text-sm font-semibold capitalize transition', tab === t ? 'border-b-2 border-violet-600 text-violet-700' : 'text-zinc-500 hover:text-zinc-800')}>{t}</button>
            ))}
          </div>
          <div className="space-y-5 p-5 lg:max-h-[calc(100vh-170px)] lg:overflow-y-auto">
            {tab === 'content' ? (
              <>
                <div>
                  <label htmlFor="kind" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Slide type</label>
                  <select id="kind" value={slide.kind} onChange={(e) => editSlide({ kind: e.target.value as SlideKind, ...(e.target.value === 'cta' && !slide.cta ? { cta: 'Follow for more →' } : {}) })}
                    className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-violet-500">
                    <option value="cover">Cover</option>
                    <option value="content">Content</option>
                    <option value="cta">Call to action</option>
                  </select>
                </div>
                <TextInput label="Eyebrow" value={slide.eyebrow} max={LIMITS.eyebrow} onChange={(v) => editSlide({ eyebrow: v })} />
                <TextInput label="Heading" value={slide.title} max={LIMITS.title} rows={3} onChange={(v) => editSlide({ title: v })} />
                <TextInput label="Body text" value={slide.body} max={LIMITS.body} rows={5} onChange={(v) => editSlide({ body: v })} />
                {slide.kind === 'content' && <TextInput label="Example (“In practice”)" value={slide.example ?? ''} max={LIMITS.example} rows={3} onChange={(v) => editSlide({ example: v })} />}
                {slide.kind === 'cta' && <TextInput label="Button text" value={slide.cta ?? ''} max={LIMITS.cta} onChange={(v) => editSlide({ cta: v })} />}
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Theme</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {THEME_LIST.map((t) => (
                      <button key={t.id} onClick={() => edit({ themeId: t.id })} aria-pressed={doc.themeId === t.id}
                        className={cn('rounded-xl border p-2 text-left transition', doc.themeId === t.id ? 'border-violet-500 ring-2 ring-violet-100' : 'border-zinc-200 hover:border-zinc-300')}>
                        <div className="flex h-8 overflow-hidden rounded-md">{[t.coverBg, t.bg, t.accent].map((c, i) => <span key={i} className="flex-1" style={{ background: c }} />)}</div>
                        <p className="mt-1.5 text-xs font-semibold">{t.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Format</p>
                  <div className="mt-2 grid gap-2">
                    {(Object.keys(ASPECTS) as AspectId[]).map((a) => (
                      <label key={a} className={cn('flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition', doc.aspect === a ? 'border-violet-500 bg-violet-50' : 'border-zinc-200')}>
                        <input type="radio" name="aspect" checked={doc.aspect === a} onChange={() => edit({ aspect: a })} className="accent-violet-600" />
                        <span className={cn('rounded-sm border-2 border-current', a === 'portrait' ? 'h-5 w-4' : 'size-4')} />
                        {ASPECTS[a].label}
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">4:5 works for both Instagram and LinkedIn document posts.</p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 text-xs text-zinc-600">
                  Brand name, handle and slide numbers come from <Link to="/studio/brand" className="font-semibold text-violet-700 hover:underline">Brand Settings</Link>.
                </div>
                {doc.visual && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">AI design notes</p>
                    <p className="mt-2 text-sm text-zinc-600">{doc.visual.layout}</p>
                    <p className="mt-2 text-xs text-zinc-500">Type: {doc.visual.typography.heading} / {doc.visual.typography.body}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </aside>
      </div>

      <PreviewModal open={preview} onClose={() => setPreview(false)} doc={doc} start={sel} />
      <ExportModal open={exporting} onClose={() => setExporting(false)} doc={doc} current={sel}
        onExported={() => { save({ status: 'exported', exportedAt: new Date().toISOString() }) }} />
    </div>
  )
}

function TextInput({ label, value, onChange, max, rows }: { label: string; value: string; onChange: (v: string) => void; max: number; rows?: number }) {
  const id = label.replace(/\W/g, '').toLowerCase()
  const over = value.length > max
  const cls = cn('mt-1.5 w-full resize-none rounded-lg border px-3 py-2 text-sm leading-relaxed outline-none transition focus:ring-4',
    over ? 'border-amber-400 focus:ring-amber-100' : 'border-zinc-200 focus:border-violet-500 focus:ring-violet-100')
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</label>
        <span className={cn('text-[11px] tabular-nums', over ? 'font-semibold text-amber-600' : 'text-zinc-400')}>{value.length}/{max}</span>
      </div>
      {rows ? <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
        : <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />}
      {over && <p className="mt-1 text-[11px] text-amber-600">Long text may feel crowded on mobile. Try trimming it.</p>}
    </div>
  )
}

/* ------------------------------ Preview ------------------------------ */

function PreviewModal({ open, onClose, doc, start }: { open: boolean; onClose: () => void; doc: CarouselProject; start: number }) {
  const { brand } = useStudio()
  const [i, setI] = useState(start)
  useEffect(() => { if (open) setI(start) }, [open, start])
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setI((x) => Math.min(x + 1, doc.slides.length - 1))
      if (e.key === 'ArrowLeft') setI((x) => Math.max(x - 1, 0))
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, doc.slides.length])

  return (
    <Modal open={open} onClose={onClose} tone="dark" size="md" title="Carousel preview" description={`As it would appear on ${doc.brief.platform === 'linkedin' ? 'LinkedIn' : 'Instagram'}. Use ← → to swipe.`}>
      <div className="mx-auto max-w-[400px] overflow-hidden rounded-2xl bg-white text-zinc-900">
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-zinc-900 text-xs font-bold text-white">{brand.name[0]}</span>
          <div className="leading-tight"><p className="text-sm font-semibold">{brand.name}</p><p className="text-[11px] text-zinc-500">{doc.brief.platform === 'linkedin' ? 'Document · 1 of ' + doc.slides.length : brand.handle}</p></div>
        </div>
        <div className="relative">
          <ScaledSlide slide={doc.slides[i]} index={i} total={doc.slides.length} themeId={doc.themeId} aspect={doc.aspect} brand={brand} />
          <button onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow disabled:opacity-0"><ChevronLeft className="size-4" /></button>
          <button onClick={() => setI(Math.min(doc.slides.length - 1, i + 1))} disabled={i === doc.slides.length - 1} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow disabled:opacity-0"><ChevronRight className="size-4" /></button>
        </div>
        <div className="flex justify-center gap-1.5 py-3">
          {doc.slides.map((s, k) => <button key={s.id} onClick={() => setI(k)} aria-label={`Go to slide ${k + 1}`} className={cn('size-1.5 rounded-full transition', k === i ? 'w-4 bg-violet-600' : 'bg-zinc-300')} />)}
        </div>
      </div>
    </Modal>
  )
}

/* ------------------------------- Export ------------------------------ */

function ExportModal({ open, onClose, doc, current, onExported }: { open: boolean; onClose: () => void; doc: CarouselProject; current: number; onExported: () => void }) {
  const { brand } = useStudio()
  const toast = useToast()
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const { w, h } = ASPECTS[doc.aspect]

  const run = async (kind: string, fn: (nodes: HTMLElement[]) => Promise<void>) => {
    const nodes = refs.current.slice(0, doc.slides.length).filter(Boolean) as HTMLElement[]
    setBusy(kind)
    setProgress(0)
    try {
      await fn(nodes)
      onExported()
      toast('Export complete. Check your downloads.')
    } catch (e) {
      console.error(e)
      toast('Export failed. Please try again.', 'error')
    } finally {
      setBusy(null)
    }
  }

  const options = [
    { id: 'pdf', icon: FileText, title: 'PDF document', sub: `All ${doc.slides.length} slides · best for LinkedIn`, action: () => run('pdf', async (n) => (await loadExporter()).exportPDF(n, w, h, doc.title, setProgress)) },
    { id: 'png-all', icon: Images, title: 'All slides as PNG', sub: `${doc.slides.length} files · ${w}×${h} · best for Instagram`, action: () => run('png-all', async (n) => (await loadExporter()).exportAllPNG(n, w, h, doc.title, setProgress)) },
    { id: 'png-one', icon: FileImage, title: `Current slide (${current + 1}) as PNG`, sub: `${w}×${h}`, action: () => run('png-one', async (n) => (await loadExporter()).exportSlidePNG(n[current], w, h, doc.title, current)) },
  ]

  return (
    <Modal open={open} onClose={() => !busy && onClose()} title="Export carousel" description="Rendered in your browser at full resolution. Nothing is uploaded." size="sm">
      <div className="space-y-2">
        {options.map((o) => (
          <button key={o.id} onClick={o.action} disabled={!!busy}
            className="flex w-full items-center gap-4 rounded-xl border border-zinc-200 p-4 text-left transition hover:border-violet-400 hover:bg-violet-50/50 disabled:opacity-60">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-700">
              {busy === o.id ? <Loader2 className="size-5 animate-spin" /> : <o.icon className="size-5" />}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{o.title}</span>
              <span className="block text-xs text-zinc-500">{busy === o.id && o.id !== 'png-one' ? `Rendering slide ${progress + 1} of ${doc.slides.length}…` : o.sub}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-zinc-500">Exporting marks this project as <strong>Exported</strong> and saves it. Publishing to Instagram or LinkedIn is not connected in this prototype.</p>

      {/* Off-screen, full-size render targets for export */}
      {open && createPortal(
        <div aria-hidden style={{ position: 'fixed', left: -100000, top: 0, pointerEvents: 'none' }}>
          {doc.slides.map((s, i) => (
            <SlideCanvas key={s.id} ref={(el) => { refs.current[i] = el }} slide={s} index={i} total={doc.slides.length} themeId={doc.themeId} aspect={doc.aspect} brand={brand} />
          ))}
        </div>,
        document.body,
      )}
    </Modal>
  )
}
