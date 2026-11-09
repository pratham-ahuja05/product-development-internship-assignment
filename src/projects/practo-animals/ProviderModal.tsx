import { useState, type FormEvent } from 'react'
import { BadgeCheck, CalendarCheck, Clock, Flag, MapPin, Navigation, PawPrint, Phone, ShieldCheck, Siren, X } from 'lucide-react'
import { Modal } from '@/components/Modal'
import { SmartImage } from '@/components/SmartImage'
import { useToast } from '@/components/Toast'
import { cn } from '@/lib/cn'
import { categoryById, type Provider } from './data'
import { availabilityLabel, Rating } from './ProviderCard'
import { usePracto } from './PractoLayout'

function nextDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      key: d.toISOString().slice(0, 10),
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    }
  })
}
const SLOTS = ['10:00 AM', '11:30 AM', '1:00 PM', '4:00 PM', '5:30 PM', '7:00 PM']

export function ProviderModal({ provider: p, onClose }: { provider: Provider; onClose: () => void }) {
  const ui = usePracto()
  const toast = useToast()
  const cat = categoryById(p.category)
  const avail = availabilityLabel(p)
  const days = nextDays(5)
  const [day, setDay] = useState(days[0].key)
  const [slot, setSlot] = useState<string | null>(null)
  const [pet, setPet] = useState('')
  const [booked, setBooked] = useState(false)
  const bookable = p.category === 'clinic' || p.category === 'hospital' || p.category === 'diagnostics' || p.category === 'boarding'

  const book = (e: FormEvent) => {
    e.preventDefault()
    if (!slot) return toast('Pick a time slot first', 'error')
    setBooked(true)
    toast('Visit request sent')
  }

  return (
    <Modal open onClose={onClose} size="lg" hideHeader className="font-jakarta" bodyClassName="p-0 sm:p-0">
      <div className="relative aspect-[16/7] min-h-44">
        <SmartImage src={p.image.replace('w=800', 'w=1400').replace('h=600', 'h=700')} alt={p.name} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent" />
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/90 text-forest-950 shadow">
          <X className="size-5" />
        </button>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur">
            <cat.icon className="size-3.5" /> {cat.label}
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {p.name}
            {p.verified && <BadgeCheck className="ml-1.5 inline size-6 -translate-y-0.5 fill-mint-400 text-forest-950" />}
          </h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
            <Rating value={p.rating} reviews={p.reviews} className="text-white [&_span]:text-white/60" />
            <span className="flex items-center gap-1"><MapPin className="size-4" /> {p.area}, {p.city}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 p-5 sm:p-7 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <p className="leading-relaxed text-forest-950/75">{p.about}</p>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-forest-600">Services</h3>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {p.services.map((s) => (
                <li key={s} className="flex items-center gap-2 rounded-xl bg-mint-50 px-3 py-2.5 text-sm font-medium text-forest-900">
                  <span className="size-1.5 rounded-full bg-forest-500" /> {s}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-forest-600">Animals treated</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.species.map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 px-3 py-1.5 text-sm">
                  <PawPrint className="size-3.5 text-forest-600" /> {s}
                </span>
              ))}
            </div>
          </section>

          <section className="grid gap-3 rounded-2xl border border-forest-900/8 p-4 text-sm">
            <p className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-forest-600" /> {p.address}</p>
            <p className="flex gap-3"><Clock className="mt-0.5 size-4 shrink-0 text-forest-600" /> {p.hours}</p>
            <p className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-forest-600" /> {p.phone}</p>
            {p.feeFrom && <p className="flex gap-3"><span className="w-4 text-center font-bold text-forest-600">₹</span> Consultation / service from ₹{p.feeFrom}</p>}
          </section>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-forest-950/55">
            {p.verified ? (
              <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-forest-600" /> Registration and address verified by our team</span>
            ) : (
              <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-amber-500" /> Verification pending · community-submitted listing</span>
            )}
            <button onClick={() => ui.openCorrection(p.id)} className="flex items-center gap-1.5 font-semibold text-forest-700 hover:underline">
              <Flag className="size-3.5" /> Suggest a correction
            </button>
          </div>
        </div>

        <aside className="space-y-3 md:sticky md:top-0 md:self-start">
          <div className={cn('flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold', avail.tone === 'open' ? 'bg-mint-100 text-forest-800' : 'bg-zinc-100 text-forest-950/70')}>
            <span className={cn('size-2 rounded-full', avail.tone === 'open' ? 'animate-pulse bg-forest-500' : 'bg-zinc-400')} />
            {avail.text}
          </div>
          {p.emergency && (
            <a href={`tel:${p.phone.replace(/\s/g, '')}`} className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700">
              <Siren className="size-4" /> Emergency call
            </a>
          )}
          <div className="grid grid-cols-2 gap-2">
            <a href={`tel:${p.phone.replace(/\s/g, '')}`} className="flex items-center justify-center gap-1.5 rounded-xl border border-forest-800/15 py-2.5 text-sm font-semibold text-forest-800 hover:bg-mint-50">
              <Phone className="size-4" /> Call
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-forest-800/15 py-2.5 text-sm font-semibold text-forest-800 hover:bg-mint-50"
            >
              <Navigation className="size-4" /> Directions
            </a>
          </div>

          {bookable && (
            <div className="rounded-2xl border border-forest-900/8 p-4">
              {booked ? (
                <div className="py-3 text-center">
                  <CalendarCheck className="mx-auto size-8 text-forest-600" />
                  <p className="mt-2 font-bold">Request sent</p>
                  <p className="mt-1 text-sm text-forest-950/60">
                    {days.find((d) => d.key === day)?.day}, {slot}. {p.name} will confirm by SMS.
                  </p>
                  <p className="mt-2 text-xs text-forest-950/40">Demo booking, no message is sent.</p>
                </div>
              ) : (
                <form onSubmit={book}>
                  <h3 className="text-sm font-bold">{p.category === 'boarding' ? 'Request a check-in' : 'Request a visit'}</h3>
                  <div className="no-scrollbar -mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1">
                    {days.map((d) => (
                      <button type="button" key={d.key} onClick={() => setDay(d.key)} aria-pressed={day === d.key}
                        className={cn('shrink-0 rounded-xl border px-2.5 py-1.5 text-center text-xs transition', day === d.key ? 'border-forest-700 bg-forest-800 text-white' : 'border-forest-900/10 hover:border-forest-600')}>
                        <span className="block font-bold">{d.day}</span>
                        <span className="opacity-70">{d.date}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    {SLOTS.map((s) => (
                      <button type="button" key={s} onClick={() => setSlot(s)} aria-pressed={slot === s}
                        className={cn('rounded-lg border py-1.5 text-xs font-semibold transition', slot === s ? 'border-forest-600 bg-mint-100 text-forest-900' : 'border-forest-900/10 text-forest-950/70 hover:border-forest-600')}>
                        {s}
                      </button>
                    ))}
                  </div>
                  <label className="sr-only" htmlFor="pet-name">Pet name and species</label>
                  <input id="pet-name" value={pet} onChange={(e) => setPet(e.target.value)} placeholder="Pet’s name & species (optional)"
                    className="mt-2 w-full rounded-lg border border-forest-900/10 px-3 py-2 text-sm outline-none focus:border-forest-600" />
                  <button className="mt-3 w-full rounded-xl bg-forest-800 py-2.5 text-sm font-semibold text-white hover:bg-forest-900">Request slot</button>
                </form>
              )}
            </div>
          )}
        </aside>
      </div>
    </Modal>
  )
}
