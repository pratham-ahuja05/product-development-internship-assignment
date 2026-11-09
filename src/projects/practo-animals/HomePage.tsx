import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, ChevronRight, Eye, MapPin, Phone, Search, Siren, Sparkles, Star, Users } from 'lucide-react'
import { SmartImage, unsplash } from '@/components/SmartImage'
import { CATEGORIES, CITIES, PROVIDERS } from './data'
import { ProviderCard } from './ProviderCard'
import { buildSearchUrl, SearchBar } from './SearchBar'
import { usePracto } from './PractoLayout'

const CITY_IMAGES: Record<string, string> = {
  Bengaluru: '1543466835-00a7907e9de1',
  Mumbai: '1514888286974-6c03e2ca1dba',
  Delhi: '1517849845537-4d257902454a',
  Pune: '1548199973-03cce0bbc87b',
  Hyderabad: '1592194996308-7b43878e84a6',
  Chennai: '1587300003388-59208cc962cb',
}

function SectionHead({ eyebrow, title, action }: { eyebrow: string; title: string; action?: { to: string; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-600">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-[32px]">{title}</h2>
      </div>
      {action && (
        <Link to={action.to} className="hidden shrink-0 items-center gap-1 text-sm font-bold text-forest-700 hover:text-forest-900 sm:flex">
          {action.label} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}

export function PractoHomePage() {
  const ui = usePracto()
  const featured = [...PROVIDERS].filter((p) => p.verified).sort((a, b) => b.rating * Math.log(b.reviews) - a.rating * Math.log(a.reviews)).slice(0, 6)
  const recommended = PROVIDERS.filter((p) => p.category === 'clinic' || p.category === 'diagnostics').sort((a, b) => b.rating - a.rating).slice(0, 4)
  const recent = [...PROVIDERS].sort((a, b) => a.addedDaysAgo - b.addedDaysAgo).slice(0, 4)
  const emergency = PROVIDERS.filter((p) => p.emergency && p.open24x7)

  return (
    <main>
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-20 size-[520px] rounded-full bg-mint-200/50 blur-3xl" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.08fr_1fr] lg:gap-14 lg:pb-24 lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-forest-700 shadow-sm ring-1 ring-forest-900/5">
              <BadgeCheck className="size-4 fill-forest-600 text-white" /> Verified animal-care providers across 6 cities
            </p>
            <h1 className="mt-6 text-[44px] font-extrabold leading-[1.02] tracking-[-0.035em] text-forest-950 sm:text-6xl lg:text-[68px]">
              Better Care for <span className="relative whitespace-nowrap text-forest-600">Every Paw<span className="text-forest-950">.</span>
                <svg aria-hidden viewBox="0 0 300 12" className="absolute -bottom-2 left-0 w-full text-mint-300" preserveAspectRatio="none"><path d="M2 9c60-6 140-8 296-3" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" /></svg>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-forest-950/65">
              Find and compare vets, animal hospitals, diagnostic labs, boarding and rescue NGOs near you. See services, species treated,
              live availability and verified contact details in one place.
            </p>
            <SearchBar className="mt-8" />
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to={buildSearchUrl({ sort: 'distance' })} className="inline-flex items-center gap-2 rounded-full bg-forest-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-forest-800">
                Find Care Near You <ArrowRight className="size-4" />
              </Link>
              <Link to={buildSearchUrl({ emergency: true })} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50">
                <Siren className="size-4" /> Need emergency care?
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative aspect-[4/4.4] overflow-hidden rounded-[36px] shadow-2xl shadow-forest-950/20 sm:aspect-[4/3.8]">
              <SmartImage src={unsplash('1628009368231-7bb7cfcb0def', 1200)} alt="A caregiver gently examining a tabby cat" className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent" />
            </div>
            <div className="absolute -left-3 bottom-8 w-60 animate-float rounded-2xl bg-white p-3.5 shadow-xl ring-1 ring-forest-900/5 sm:-left-8">
              <div className="flex items-center gap-3">
                <SmartImage src={PROVIDERS[0].image} alt="" className="size-12 shrink-0 rounded-xl" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{PROVIDERS[0].name}</p>
                  <p className="flex items-center gap-1 text-xs text-forest-950/55"><Star className="size-3 fill-amber-400 text-amber-400" /> 4.8 · 1.2 km</p>
                </div>
              </div>
              <p className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-mint-50 px-2.5 py-1.5 text-xs font-bold text-forest-700">
                <span className="size-1.5 animate-pulse rounded-full bg-forest-500" /> Slots available today
              </p>
            </div>
            <div className="absolute -right-2 top-8 rounded-2xl bg-forest-900 px-4 py-3 text-white shadow-xl sm:-right-6" style={{ animation: 'float 8s ease-in-out infinite 1s' }}>
              <p className="flex items-center gap-2 text-xs font-semibold text-mint-300"><Siren className="size-3.5" /> 24×7 emergency</p>
              <p className="mt-0.5 text-sm font-bold">{emergency.length} hospitals & ambulances</p>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------- Categories --------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHead eyebrow="Services" title="What does your animal need?" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => {
            const count = PROVIDERS.filter((p) => p.category === c.id).length
            const isEmergency = c.id === 'ambulance'
            return (
              <Link
                key={c.id}
                to={buildSearchUrl({ category: c.id })}
                className="group relative flex flex-col rounded-3xl bg-white p-5 ring-1 ring-forest-900/6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-900/10 hover:ring-forest-600/30"
              >
                <span className={`grid size-12 place-items-center rounded-2xl transition ${isEmergency ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' : 'bg-mint-100 text-forest-700 group-hover:bg-forest-800 group-hover:text-mint-300'}`}>
                  <c.icon className="size-6" />
                </span>
                <h3 className="mt-5 font-bold leading-tight">{c.label}</h3>
                <p className="mt-1 text-[13px] leading-snug text-forest-950/50">{c.description}</p>
                <p className="mt-4 flex items-center gap-1 text-xs font-bold text-forest-600">
                  {count} listed <ChevronRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ---------------------------- Featured ---------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <SectionHead eyebrow="Featured providers" title="Top-rated and verified" action={{ to: buildSearchUrl({ sort: 'rating' }), label: 'See all providers' }} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <ProviderCard key={p.id} provider={p} />)}
        </div>
      </section>

      {/* ---------------------------- Discovery --------------------------- */}
      <section className="mt-10 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead eyebrow="Discover" title="Explore care around you" />

          <h3 className="mt-10 flex items-center gap-2 text-lg font-bold"><MapPin className="size-5 text-forest-600" /> Popular locations</h3>
          <div className="no-scrollbar -mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
            {CITIES.map((city) => (
              <Link key={city} to={buildSearchUrl({ city })} className="group relative aspect-[4/5] w-36 shrink-0 snap-start overflow-hidden rounded-2xl sm:w-auto">
                <SmartImage src={unsplash(CITY_IMAGES[city], 400, 500)} alt="" className="absolute inset-0 transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
                  <p className="font-bold">{city}</p>
                  <p className="text-xs text-white/70">{PROVIDERS.filter((p) => p.city === city).length} providers</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold"><Sparkles className="size-5 text-forest-600" /> Recommended for routine care</h3>
                <Link to={buildSearchUrl({ category: 'clinic', sort: 'rating' })} className="text-sm font-bold text-forest-700">View all</Link>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {recommended.map((p) => (
                  <button key={p.id} onClick={() => ui.openProvider(p.id)} className="group flex gap-4 rounded-2xl p-2 text-left ring-1 ring-forest-900/6 transition hover:bg-mint-50 hover:ring-forest-600/20">
                    <SmartImage src={p.image} alt="" className="size-20 shrink-0 rounded-xl" />
                    <div className="min-w-0 py-1">
                      <p className="truncate font-bold group-hover:text-forest-700">{p.name}</p>
                      <p className="mt-0.5 text-xs text-forest-950/50">{p.area}, {p.city}</p>
                      <p className="mt-2 flex items-center gap-2 text-xs font-semibold">
                        <span className="flex items-center gap-1"><Star className="size-3.5 fill-amber-400 text-amber-400" /> {p.rating}</span>
                        <span className="text-forest-950/30">•</span>
                        <span className="truncate text-forest-600">{p.services[0]}</span>
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 to-red-700 p-6 text-white">
              <Siren className="absolute -right-6 -top-6 size-36 text-white/10" />
              <p className="text-xs font-bold uppercase tracking-widest text-red-100">Emergency animal care</p>
              <h3 className="mt-2 text-2xl font-extrabold leading-tight">Injured or critical? Get help now.</h3>
              <ul className="mt-5 space-y-2">
                {emergency.slice(0, 4).map((p) => (
                  <li key={p.id} className="flex items-center gap-3 rounded-xl bg-white/10 p-2.5 backdrop-blur">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{p.name}</p>
                      <p className="text-xs text-red-100">{p.area}, {p.city}</p>
                    </div>
                    <a href={`tel:${p.phone.replace(/\s/g, '')}`} aria-label={`Call ${p.name}`} className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-red-600 transition hover:scale-105">
                      <Phone className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
              <Link to={buildSearchUrl({ emergency: true })} className="mt-4 inline-flex items-center gap-1 text-sm font-bold underline-offset-4 hover:underline">
                All 24×7 emergency providers <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="mt-14">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold">Recently added</h3>
              <Link to={buildSearchUrl({ sort: 'recent' })} className="text-sm font-bold text-forest-700">View all</Link>
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recent.map((p) => (
                <button key={p.id} onClick={() => ui.openProvider(p.id)} className="group overflow-hidden rounded-2xl bg-cream text-left ring-1 ring-forest-900/6 transition hover:shadow-lg">
                  <div className="relative aspect-[16/10]">
                    <SmartImage src={p.image} alt="" className="absolute inset-0" />
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-mint-300 px-2 py-0.5 text-[11px] font-bold text-forest-950">
                      New · {p.addedDaysAgo === 0 ? 'today' : `${p.addedDaysAgo}d ago`}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="truncate font-bold group-hover:text-forest-700">{p.name}</p>
                    <p className="mt-0.5 text-xs text-forest-950/50">{CATEGORIES.find((c) => c.id === p.category)?.label} · {p.city}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ Trust ----------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-600">Why Practo for Animals</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Care decisions deserve information you can trust.</h2>
            <p className="mt-4 max-w-md text-forest-950/60">
              Listings come from providers and the community, and our team checks every one before it goes live. When something changes, anyone can flag it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={ui.openBusiness} className="rounded-full bg-forest-800 px-6 py-3 text-sm font-bold text-white hover:bg-forest-900">List your business</button>
              <button onClick={() => ui.openCorrection()} className="rounded-full border border-forest-800/20 px-6 py-3 text-sm font-bold text-forest-800 hover:bg-mint-50">Submit a correction</button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: BadgeCheck, title: 'Verified providers', text: 'We check registration, address and contact details before a listing shows a verified badge.' },
              { icon: Eye, title: 'Transparent information', text: 'Services, species treated, hours and starting fees up front, so you know before you call.' },
              { icon: Users, title: 'Community contributions', text: 'Pet owners and rescuers flag outdated details, and every correction is reviewed.' },
              { icon: Search, title: 'Easy discovery', text: 'Search by need, location and availability, including round-the-clock emergency care.' },
            ].map((t, i) => (
              <div key={t.title} className={`rounded-3xl p-6 ${i === 0 ? 'bg-forest-900 text-white' : 'bg-white ring-1 ring-forest-900/6'}`}>
                <t.icon className={`size-7 ${i === 0 ? 'text-mint-300' : 'text-forest-600'}`} />
                <h3 className="mt-4 text-lg font-bold">{t.title}</h3>
                <p className={`mt-1.5 text-sm leading-relaxed ${i === 0 ? 'text-white/70' : 'text-forest-950/55'}`}>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
