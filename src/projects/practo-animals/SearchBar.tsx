import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid, LocateFixed, MapPin, Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { CATEGORIES, CITIES } from './data'

export function buildSearchUrl(q: { city?: string; category?: string; q?: string; sort?: string; emergency?: boolean }) {
  const p = new URLSearchParams()
  if (q.q) p.set('q', q.q)
  if (q.city) p.set('city', q.city)
  if (q.category) p.set('category', q.category)
  if (q.sort) p.set('sort', q.sort)
  if (q.emergency) p.set('emergency', '1')
  const s = p.toString()
  return `/practo/search${s ? `?${s}` : ''}`
}

/** Hero search: location + service category + free text. Submits to the results page via URL params. */
export function SearchBar({ className }: { className?: string }) {
  const navigate = useNavigate()
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [q, setQ] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(buildSearchUrl({ city, category, q: q.trim() }))
  }

  const cell = 'flex items-center gap-3 rounded-2xl px-4 py-3 transition focus-within:bg-mint-50 hover:bg-mint-50/60'
  const label = 'block text-[11px] font-bold uppercase tracking-wider text-forest-950/45'
  const control = 'w-full bg-transparent text-[15px] font-semibold text-forest-950 outline-none placeholder:font-medium placeholder:text-forest-950/35'

  return (
    <form
      onSubmit={submit}
      role="search"
      className={cn(
        'grid gap-1 rounded-3xl bg-white p-2 shadow-[0_24px_60px_-24px_rgba(6,38,26,0.35)] ring-1 ring-forest-900/5 md:grid-cols-[1fr_1fr_1.2fr_auto]',
        className,
      )}
    >
      <div className={cell}>
        <MapPin className="size-5 shrink-0 text-forest-600" />
        <div className="min-w-0 flex-1">
          <label htmlFor="hero-city" className={label}>Location</label>
          <select id="hero-city" value={city} onChange={(e) => setCity(e.target.value)} className={cn(control, 'cursor-pointer appearance-none')}>
            <option value="">All cities</option>
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button type="button" onClick={() => setCity('Bengaluru')} title="Use my location (demo: Bengaluru)" aria-label="Use my location" className="rounded-full p-1.5 text-forest-600 hover:bg-mint-100">
          <LocateFixed className="size-4" />
        </button>
      </div>
      <div className={cell}>
        <LayoutGrid className="size-5 shrink-0 text-forest-600" />
        <div className="min-w-0 flex-1">
          <label htmlFor="hero-cat" className={label}>Service</label>
          <select id="hero-cat" value={category} onChange={(e) => setCategory(e.target.value)} className={cn(control, 'cursor-pointer appearance-none')}>
            <option value="">All services</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
      </div>
      <div className={cell}>
        <Search className="size-5 shrink-0 text-forest-600" />
        <div className="min-w-0 flex-1">
          <label htmlFor="hero-q" className={label}>Search</label>
          <input id="hero-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Clinic, service or area" className={control} />
        </div>
      </div>
      <button className="flex items-center justify-center gap-2 rounded-2xl bg-forest-800 px-7 py-4 text-[15px] font-bold text-white transition hover:bg-forest-900 md:py-0">
        <Search className="size-5" /> Search
      </button>
    </form>
  )
}
