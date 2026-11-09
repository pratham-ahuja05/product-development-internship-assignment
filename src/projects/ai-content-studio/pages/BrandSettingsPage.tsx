import { useState } from 'react'
import { Check, Save } from 'lucide-react'
import { Field } from '@/components/Field'
import { useToast } from '@/components/Toast'
import { cn } from '@/lib/cn'
import { ScaledSlide } from '../SlideCanvas'
import { SAMPLE_SLIDES } from '../sampleCarousel'
import { useStudio } from '../store'
import { THEME_LIST } from '../themes'
import type { BrandSettings } from '../types'
import { btn, PageHeader } from '../ui'

export function BrandSettingsPage() {
  const { brand, setBrand } = useStudio()
  const [v, setV] = useState<BrandSettings>(brand)
  const [errors, setErrors] = useState<Partial<Record<keyof BrandSettings, string>>>({})
  const toast = useToast()
  const dirty = JSON.stringify(v) !== JSON.stringify(brand)

  const save = () => {
    const e: typeof errors = {}
    if (!v.name.trim()) e.name = 'Brand name is required'
    if (!/^@[\w.]{2,30}$/.test(v.handle.trim())) e.handle = 'Use a handle like @yourbrand'
    setErrors(e)
    if (Object.keys(e).length) return
    setBrand({ ...v, name: v.name.trim(), handle: v.handle.trim() })
    toast('Brand settings saved')
  }

  const preview = (i: number) => ({ ...SAMPLE_SLIDES[i], id: `bp-${i}` })

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      <PageHeader title="Brand Settings" subtitle="Applied to every carousel: footer identity, default theme and slide chrome."
        actions={<button onClick={save} disabled={!dirty} className={btn.primary}><Save className="size-4" /> Save changes</button>} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold">Identity</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Brand name" tone="studio" required error={errors.name}>
                {(p) => <input {...p} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />}
              </Field>
              <Field label="Social handle" tone="studio" required error={errors.handle}>
                {(p) => <input {...p} value={v.handle} onChange={(e) => setV({ ...v, handle: e.target.value })} placeholder="@yourbrand" />}
              </Field>
              <Field label="Website" tone="studio" className="sm:col-span-2" hint="Shown on the closing CTA slide.">
                {(p) => <input {...p} value={v.website} onChange={(e) => setV({ ...v, website: e.target.value })} />}
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold">Default theme</h2>
            <p className="text-sm text-zinc-500">Used for new carousels unless the AI suggests otherwise.</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {THEME_LIST.map((t) => (
                <button key={t.id} onClick={() => setV({ ...v, defaultTheme: t.id })} aria-pressed={v.defaultTheme === t.id}
                  className={cn('relative rounded-xl border p-3 text-left transition', v.defaultTheme === t.id ? 'border-violet-500 ring-4 ring-violet-100' : 'border-zinc-200 hover:border-zinc-300')}>
                  <div className="flex h-10 overflow-hidden rounded-lg">
                    {[t.coverBg, t.bg, t.accent].map((c, i) => <span key={i} className="flex-1" style={{ background: c }} />)}
                  </div>
                  <p className="mt-2 text-sm font-medium">{t.name}</p>
                  {v.defaultTheme === t.id && <Check className="absolute right-2 top-2 size-4 rounded-full bg-violet-600 p-0.5 text-white" />}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold">Slide chrome</h2>
            {([['showNumbers', 'Show slide numbers (01 / 07)'], ['showHandle', 'Show brand name & handle in footer']] as const).map(([k, label]) => (
              <label key={k} className="mt-4 flex cursor-pointer items-center justify-between gap-4">
                <span className="text-sm">{label}</span>
                <span className="relative">
                  <input type="checkbox" className="peer sr-only" checked={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.checked })} />
                  <span className="block h-6 w-11 rounded-full bg-zinc-200 transition peer-checked:bg-violet-600 peer-focus-visible:ring-4 peer-focus-visible:ring-violet-100" />
                  <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </span>
              </label>
            ))}
          </section>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="text-sm font-medium text-zinc-500">Live preview</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <ScaledSlide slide={preview(0)} index={0} total={7} themeId={v.defaultTheme} aspect="portrait" brand={v} className="rounded-lg shadow-lg" />
            <ScaledSlide slide={preview(1)} index={1} total={7} themeId={v.defaultTheme} aspect="portrait" brand={v} className="rounded-lg shadow-lg" />
          </div>
        </aside>
      </div>
    </main>
  )
}
