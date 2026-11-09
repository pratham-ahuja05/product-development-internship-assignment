import { BadgeCheck, Clock, MapPin, Phone, Siren, Star } from 'lucide-react'
import { SmartImage } from '@/components/SmartImage'
import { cn } from '@/lib/cn'
import { categoryById, type Provider } from './data'
import { usePracto } from './PractoLayout'

export function Rating({ value, reviews, className }: { value: number; reviews?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm font-semibold', className)}>
      <Star className="size-4 fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
      {reviews !== undefined && <span className="font-normal text-forest-950/45">({reviews.toLocaleString('en-IN')})</span>}
    </span>
  )
}

export function availabilityLabel(p: Provider) {
  if (p.open24x7) return { text: p.category === 'ambulance' ? 'Dispatch 24×7' : 'Open 24×7', tone: 'open' as const }
  if (p.closesAt) return { text: `Open · closes ${p.closesAt}`, tone: 'open' as const }
  return { text: p.hours.split('·')[0].trim(), tone: 'neutral' as const }
}

export function ProviderCard({ provider: p, layout = 'grid' }: { provider: Provider; layout?: 'grid' | 'row' }) {
  const ui = usePracto()
  const cat = categoryById(p.category)
  const avail = availabilityLabel(p)
  const row = layout === 'row'

  return (
    <article
      className={cn(
        'group flex overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(10,55,38,0.06),0_8px_24px_-12px_rgba(10,55,38,0.15)] ring-1 ring-forest-900/5 transition hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(10,55,38,0.06),0_20px_40px_-16px_rgba(10,55,38,0.25)]',
        row ? 'flex-col sm:flex-row' : 'flex-col',
      )}
    >
      <button onClick={() => ui.openProvider(p.id)} className={cn('relative block shrink-0 text-left', row ? 'aspect-[16/10] sm:aspect-auto sm:w-64' : 'aspect-[16/10]')} aria-label={`View details for ${p.name}`}>
        <SmartImage src={p.image} alt={`${p.name}`} className="absolute inset-0 transition duration-500 group-hover:scale-[1.03]" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-forest-900 shadow-sm backdrop-blur">
          <cat.icon className="size-3.5 text-forest-600" /> {cat.label}
        </span>
        {p.emergency && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            <Siren className="size-3.5" /> Emergency
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-bold leading-snug tracking-tight">
            <button onClick={() => ui.openProvider(p.id)} className="text-left hover:text-forest-700">{p.name}</button>
            {p.verified && <BadgeCheck className="ml-1 inline size-[18px] -translate-y-px fill-forest-600 text-white" aria-label="Verified provider" />}
          </h3>
          <Rating value={p.rating} className="shrink-0" />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-forest-950/55">
          <MapPin className="size-3.5" /> {p.area}, {p.city}
          {p.distanceKm > 0 && <span className="text-forest-950/35">· {p.distanceKm} km</span>}
        </p>

        <ul className="mt-3.5 flex flex-wrap gap-1.5" aria-label="Services">
          {p.services.slice(0, row ? 4 : 3).map((s) => (
            <li key={s} className="rounded-md bg-mint-50 px-2 py-1 text-xs font-medium text-forest-800">{s}</li>
          ))}
          {p.services.length > (row ? 4 : 3) && (
            <li className="rounded-md px-1 py-1 text-xs font-medium text-forest-950/40">+{p.services.length - (row ? 4 : 3)}</li>
          )}
        </ul>

        <p className={cn('mt-3.5 flex items-center gap-1.5 text-sm font-semibold', avail.tone === 'open' ? 'text-forest-600' : 'text-forest-950/55')}>
          <Clock className="size-4" /> {avail.text}
          {p.feeFrom && <span className="ml-auto text-xs font-medium text-forest-950/45">from ₹{p.feeFrom}</span>}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <a
            href={`tel:${p.phone.replace(/\s/g, '')}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-forest-800/15 py-2.5 text-sm font-semibold text-forest-800 transition hover:border-forest-700 hover:bg-mint-50"
          >
            <Phone className="size-4" /> Contact
          </a>
          <button
            onClick={() => ui.openProvider(p.id)}
            className="rounded-xl bg-forest-800 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-900"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  )
}
