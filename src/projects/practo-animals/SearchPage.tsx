import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutList, LayoutGrid, Search, SearchX, SlidersHorizontal, Star, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { CATEGORIES, CITIES, PROVIDERS, SPECIES, type Provider } from './data'
import { ProviderCard } from './ProviderCard'

const SORTS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'rating', label: 'Highest rated' },
  { id: 'distance', label: 'Nearest first' },
  { id: 'reviews', label: 'Most reviewed' },
  { id: 'recent', label: 'Recently added' },
  { id: 'fee', label: 'Lowest fee' },
] as const

type Filters = {
  q: string
  city: string
  categories: string[]
  species: string[]
  minRating: number
  open24x7: boolean
  emergency: boolean
  verified: boolean
  sort: string
}

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])

function readFilters(p: URLSearchParams): Filters {
  return {
    q: p.get('q') ?? '',
    city: p.get('city') ?? '',
    categories: list(p.get('category')),
    species: list(p.get('species')),
    minRating: Number(p.get('rating') ?? 0),
    open24x7: p.get('open') === '1',
    emergency: p.get('emergency') === '1',
    verified: p.get('verified') === '1',
    sort: p.get('sort') ?? 'relevance',
  }
}

function toParams(f: Filters) {
  const p = new URLSearchParams()
  if (f.q) p.set('q', f.q)
  if (f.city) p.set('city', f.city)
  if (f.categories.length) p.set('category', f.categories.join(','))
  if (f.species.length) p.set('species', f.species.join(','))
  if (f.minRating) p.set('rating', String(f.minRating))
  if (f.open24x7) p.set('open', '1')
  if (f.emergency) p.set('emergency', '1')
  if (f.verified) p.set('verified', '1')
  if (f.sort !== 'relevance') p.set('sort', f.sort)
  return p
}

function relevance(p: Provider, q: string) {
  if (!q) return p.rating * 10 + (p.verified ? 5 : 0)
  const t = q.toLowerCase()
  let s = 0
  if (p.name.toLowerCase().includes(t)) s += 50
  if (p.services.some((x) => x.toLowerCase().includes(t))) s += 30
  if (p.area.toLowerCase().includes(t)) s += 20
  return s + p.rating
}

function matchesQuery(p: Provider, q: string) {
  if (!q) return true
  const hay = [p.name, p.area, p.city, p.address, p.about, ...p.services, ...p.species, CATEGORIES.find((c) => c.id === p.category)!.label]
    .join(' ')
    .toLowerCase()
  return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))
}

export function PractoSearchPage() {
  const [params, setParams] = useSearchParams()
  const f = readFilters(params)
  const [qDraft, setQDraft] = useState(f.q)
  const [view, setView] = useState<'grid' | 'row'>('grid')
  const [drawer, setDrawer] = useState(false)

  useEffect(() => setQDraft(f.q), [f.q])
  const update = (patch: Partial<Filters>) => setParams(toParams({ ...f, ...patch }), { replace: true })
  const toggle = (key: 'categories' | 'species', v: string) =>
    update({ [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] })

  const results = useMemo(() => {
    const r = PROVIDERS.filter(
      (p) =>
        matchesQuery(p, f.q) &&
        (!f.city || p.city === f.city) &&
        (!f.categories.length || f.categories.includes(p.category)) &&
        (!f.species.length || f.species.some((s) => p.species.includes(s as Provider['species'][number]))) &&
        p.rating >= f.minRating &&
        (!f.open24x7 || p.open24x7) &&
        (!f.emergency || p.emergency) &&
        (!f.verified || p.verified),
    )
    const sorters: Record<string, (a: Provider, b: Provider) => number> = {
      relevance: (a, b) => relevance(b, f.q) - relevance(a, f.q),
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      distance: (a, b) => a.distanceKm - b.distanceKm,
      reviews: (a, b) => b.reviews - a.reviews,
      recent: (a, b) => a.addedDaysAgo - b.addedDaysAgo,
      fee: (a, b) => (a.feeFrom ?? 9999) - (b.feeFrom ?? 9999),
    }
    return r.sort(sorters[f.sort] ?? sorters.relevance)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const chips: { label: string; clear: () => void }[] = [
    ...(f.q ? [{ label: `“${f.q}”`, clear: () => update({ q: '' }) }] : []),
    ...(f.city ? [{ label: f.city, clear: () => update({ city: '' }) }] : []),
    ...f.categories.map((c) => ({ label: CATEGORIES.find((x) => x.id === c)?.label ?? c, clear: () => toggle('categories', c) })),
    ...f.species.map((s) => ({ label: s, clear: () => toggle('species', s) })),
    ...(f.minRating ? [{ label: `${f.minRating}+ rating`, clear: () => update({ minRating: 0 }) }] : []),
    ...(f.open24x7 ? [{ label: 'Open 24×7', clear: () => update({ open24x7: false }) }] : []),
    ...(f.emergency ? [{ label: 'Emergency', clear: () => update({ emergency: false }) }] : []),
    ...(f.verified ? [{ label: 'Verified', clear: () => update({ verified: false }) }] : []),
  ]
  const clearAll = () => setParams(f.sort !== 'relevance' ? { sort: f.sort } : {}, { replace: true })

  const heading = f.categories.length === 1 ? CATEGORIES.find((c) => c.id === f.categories[0])?.label : 'Animal-care providers'

  const filtersPanel = (
    <div className="space-y-7">
      <FilterGroup title="Location">
        <select value={f.city} onChange={(e) => update({ city: e.target.value })} aria-label="City"
          className="w-full rounded-xl border border-forest-900/10 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-forest-600">
          <option value="">All cities</option>
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </FilterGroup>
      <FilterGroup title="Service type">
        {CATEGORIES.map((c) => (
          <Check key={c.id} checked={f.categories.includes(c.id)} onChange={() => toggle('categories', c.id)}
            label={c.label} count={PROVIDERS.filter((p) => p.category === c.id && (!f.city || p.city === f.city)).length} />
        ))}
      </FilterGroup>
      <FilterGroup title="Availability">
        <Check checked={f.open24x7} onChange={() => update({ open24x7: !f.open24x7 })} label="Open 24×7" />
        <Check checked={f.emergency} onChange={() => update({ emergency: !f.emergency })} label="Emergency services" />
        <Check checked={f.verified} onChange={() => update({ verified: !f.verified })} label="Verified only" />
      </FilterGroup>
      <FilterGroup title="Rating">
        <div className="flex gap-1.5">
          {[0, 4, 4.5, 4.7].map((r) => (
            <button key={r} onClick={() => update({ minRating: r })} aria-pressed={f.minRating === r}
              className={cn('flex flex-1 items-center justify-center gap-1 rounded-lg border py-2 text-xs font-bold transition',
                f.minRating === r ? 'border-forest-700 bg-forest-800 text-white' : 'border-forest-900/10 bg-white hover:border-forest-600')}>
              {r === 0 ? 'Any' : <><Star className="size-3 fill-current" /> {r}+</>}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Animals treated">
        <div className="flex flex-wrap gap-1.5">
          {SPECIES.map((s) => (
            <button key={s} onClick={() => toggle('species', s)} aria-pressed={f.species.includes(s)}
              className={cn('rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                f.species.includes(s) ? 'border-forest-700 bg-forest-800 text-white' : 'border-forest-900/10 bg-white hover:border-forest-600')}>
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>
    </div>
  )

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
      <form
        role="search"
        onSubmit={(e) => { e.preventDefault(); update({ q: qDraft.trim() }) }}
        className="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-forest-900/8 focus-within:ring-2 focus-within:ring-forest-600/40"
      >
        <Search className="ml-3 size-5 shrink-0 text-forest-600" />
        <label htmlFor="results-q" className="sr-only">Search providers</label>
        <input id="results-q" value={qDraft} onChange={(e) => setQDraft(e.target.value)}
          placeholder="Search by name, service (e.g. X-ray, grooming) or area"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] font-medium outline-none placeholder:text-forest-950/35" />
        {qDraft && <button type="button" onClick={() => { setQDraft(''); update({ q: '' }) }} aria-label="Clear search" className="rounded-full p-1.5 text-forest-950/40 hover:bg-mint-50"><X className="size-4" /></button>}
        <button className="rounded-xl bg-forest-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-forest-900">Search</button>
      </form>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-24">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-bold">Filters</h2>
              {chips.length > 0 && <button onClick={clearAll} className="text-xs font-bold text-forest-700 hover:underline">Clear all</button>}
            </div>
            {filtersPanel}
          </div>
        </aside>

        <section aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{heading}{f.city && <span className="text-forest-600"> in {f.city}</span>}</h1>
              <p className="mt-1 text-sm text-forest-950/55">{results.length} {results.length === 1 ? 'result' : 'results'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setDrawer(true)} className="flex items-center gap-2 rounded-xl border border-forest-900/10 bg-white px-3.5 py-2 text-sm font-bold lg:hidden">
                <SlidersHorizontal className="size-4" /> Filters {chips.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-forest-800 text-[11px] text-white">{chips.length}</span>}
              </button>
              <label htmlFor="sort" className="sr-only">Sort by</label>
              <select id="sort" value={f.sort} onChange={(e) => update({ sort: e.target.value })}
                className="rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-forest-600">
                {SORTS.map((s) => <option key={s.id} value={s.id}>Sort: {s.label}</option>)}
              </select>
              <div className="hidden rounded-xl border border-forest-900/10 bg-white p-1 sm:flex" role="group" aria-label="Layout">
                {(['grid', 'row'] as const).map((v) => {
                  const Icon = v === 'grid' ? LayoutGrid : LayoutList
                  return (
                    <button key={v} onClick={() => setView(v)} aria-pressed={view === v} aria-label={`${v} view`}
                      className={cn('rounded-lg p-1.5', view === v ? 'bg-mint-100 text-forest-800' : 'text-forest-950/40')}>
                      <Icon className="size-4" />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button key={c.label} onClick={c.clear} className="flex items-center gap-1.5 rounded-full bg-mint-100 py-1 pl-3 pr-2 text-xs font-bold text-forest-800 hover:bg-mint-200">
                  {c.label} <X className="size-3.5" />
                </button>
              ))}
            </div>
          )}

          {results.length ? (
            <div className={cn('mt-6 grid gap-5', view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
              {results.map((p) => <ProviderCard key={p.id} provider={p} layout={view} />)}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-forest-900/15 bg-white px-6 py-16 text-center">
              <SearchX className="mx-auto size-10 text-forest-600/50" />
              <h2 className="mt-4 text-lg font-bold">No providers match these filters</h2>
              <p className="mx-auto mt-1 max-w-sm text-sm text-forest-950/55">Try a nearby city, remove a filter or search for a broader service.</p>
              <button onClick={clearAll} className="mt-5 rounded-full bg-forest-800 px-5 py-2.5 text-sm font-bold text-white">Clear all filters</button>
            </div>
          )}
        </section>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-forest-950/50" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm animate-fade-up flex-col bg-cream">
            <div className="flex items-center justify-between border-b border-forest-900/8 px-5 py-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setDrawer(false)} aria-label="Close filters" className="rounded-full p-2 hover:bg-mint-100"><X className="size-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{filtersPanel}</div>
            <div className="grid grid-cols-2 gap-2 border-t border-forest-900/8 p-4">
              <button onClick={clearAll} className="rounded-xl border border-forest-900/15 py-3 text-sm font-bold">Clear</button>
              <button onClick={() => setDrawer(false)} className="rounded-xl bg-forest-800 py-3 text-sm font-bold text-white">Show {results.length} results</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-forest-950/45">{title}</legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  )
}

function Check({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count?: number }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-sm font-medium hover:bg-mint-50">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-4 rounded accent-forest-700" />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-forest-950/35">{count}</span>}
    </label>
  )
}
