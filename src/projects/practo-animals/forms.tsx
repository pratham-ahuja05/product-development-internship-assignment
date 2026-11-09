import { useState, type FormEvent, type ReactNode } from 'react'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { Field } from '@/components/Field'
import { Modal } from '@/components/Modal'
import { useToast } from '@/components/Toast'
import { cn, uid } from '@/lib/cn'
import { readStorage, writeStorage } from '@/lib/useLocalStorage'
import { CATEGORIES, CITIES, PROVIDERS, SPECIES } from './data'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/

/** Prototype persistence: submissions are queued in localStorage for an admin review step. */
function queue(key: string, record: object) {
  const id = uid('REF-').toUpperCase()
  writeStorage(key, [{ id, createdAt: new Date().toISOString(), ...record }, ...readStorage<object[]>(key, [])])
  return id
}

const btnPrimary =
  'inline-flex w-full items-center justify-center rounded-xl bg-forest-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest-900 disabled:opacity-60'

function Success({ title, children, onDone }: { title: string; children: ReactNode; onDone: () => void }) {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-mint-100 text-forest-700">
        <CheckCircle2 className="size-7" />
      </div>
      <h3 className="mt-4 text-xl font-bold tracking-tight">{title}</h3>
      <div className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-forest-950/60">{children}</div>
      <button onClick={onDone} className={cn(btnPrimary, 'mt-6 w-auto px-8')}>Done</button>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
        active ? 'border-forest-700 bg-forest-800 text-white' : 'border-forest-900/12 text-forest-950/70 hover:border-forest-600',
      )}
    >
      {children}
    </button>
  )
}

/* ---------------------------------- Business ---------------------------------- */

export function BusinessForm({ onDone }: { onDone: () => void }) {
  const [v, setV] = useState({ name: '', category: '', city: '', address: '', contact: '', phone: '', email: '', open24x7: false, consent: false })
  const [species, setSpecies] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [ref, setRef] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (v.name.trim().length < 3) err.name = 'Enter your business name'
    if (!v.category) err.category = 'Choose a category'
    if (!v.city) err.city = 'Choose a city'
    if (v.address.trim().length < 10) err.address = 'Enter the full address so owners can find you'
    if (v.contact.trim().length < 2) err.contact = 'Enter a contact person'
    if (!PHONE.test(v.phone.trim())) err.phone = 'Enter a valid 10-digit Indian mobile number'
    if (!EMAIL.test(v.email.trim())) err.email = 'Enter a valid email address'
    if (!species.length) err.species = 'Select at least one'
    if (!v.consent) err.consent = 'Please confirm the details are accurate'
    setErrors(err)
    if (Object.keys(err).length) return
    setBusy(true)
    await new Promise((r) => setTimeout(r, 700))
    setRef(queue('pfa.listings', { ...v, species }))
    setBusy(false)
  }

  if (ref)
    return (
      <Success title="Listing submitted for verification" onDone={onDone}>
        Reference <strong className="font-mono text-forest-800">{ref}</strong>. Our team will contact <strong>{v.email}</strong> to verify
        your registration documents before <strong>{v.name}</strong> goes live.
      </Success>
    )

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Business name" required tone="forest" error={errors.name} className="sm:col-span-2">
        {(p) => <input {...p} value={v.name} onChange={set('name')} placeholder="e.g. Greenleaf Veterinary Clinic" />}
      </Field>
      <Field label="Category" required tone="forest" error={errors.category}>
        {(p) => (
          <select {...p} value={v.category} onChange={set('category')}>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        )}
      </Field>
      <Field label="City" required tone="forest" error={errors.city}>
        {(p) => (
          <select {...p} value={v.city} onChange={set('city')}>
            <option value="">Select city</option>
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        )}
      </Field>
      <Field label="Full address" required tone="forest" error={errors.address} className="sm:col-span-2">
        {(p) => <textarea {...p} rows={2} value={v.address} onChange={set('address')} placeholder="Building, street, area, pincode" />}
      </Field>
      <Field label="Contact person" required tone="forest" error={errors.contact}>
        {(p) => <input {...p} value={v.contact} onChange={set('contact')} autoComplete="name" />}
      </Field>
      <Field label="Phone" required tone="forest" error={errors.phone}>
        {(p) => <input {...p} value={v.phone} onChange={set('phone')} inputMode="tel" placeholder="98765 43210" autoComplete="tel" />}
      </Field>
      <Field label="Email" required tone="forest" error={errors.email} className="sm:col-span-2">
        {(p) => <input {...p} type="email" value={v.email} onChange={set('email')} autoComplete="email" placeholder="you@clinic.in" />}
      </Field>
      <div className="sm:col-span-2">
        <p className="text-sm font-medium text-forest-950/85">Animals you care for <span className="text-red-500">*</span></p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SPECIES.map((s) => (
            <Chip key={s} active={species.includes(s)} onClick={() => setSpecies((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s]))}>
              {s}
            </Chip>
          ))}
        </div>
        {errors.species && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.species}</p>}
      </div>
      <label className="flex items-center gap-3 rounded-xl bg-mint-50 p-3 text-sm sm:col-span-2">
        <input type="checkbox" checked={v.open24x7} onChange={(e) => setV({ ...v, open24x7: e.target.checked })} className="size-4 accent-forest-700" />
        We are open 24×7 or offer emergency services
      </label>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-forest-950/70">
          <input type="checkbox" checked={v.consent} onChange={(e) => setV({ ...v, consent: e.target.checked })} className="mt-0.5 size-4 accent-forest-700" />
          I confirm these details are accurate and I’m authorised to list this business.
        </label>
        {errors.consent && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.consent}</p>}
      </div>
      <div className="flex items-center gap-2 text-xs text-forest-950/50 sm:col-span-2">
        <ShieldCheck className="size-4 text-forest-600" /> Every listing is manually verified before it appears in search.
      </div>
      <button disabled={busy} className={cn(btnPrimary, 'sm:col-span-2')}>{busy ? 'Submitting…' : 'Submit listing'}</button>
    </form>
  )
}

/* --------------------------------- Correction --------------------------------- */

const ISSUES = ['Phone number', 'Address / location', 'Opening hours', 'Services offered', 'Permanently closed', 'Other']

export function CorrectionForm({ onDone, providerId }: { onDone: () => void; providerId?: string }) {
  const [provider, setProvider] = useState(providerId ?? '')
  const [issue, setIssue] = useState('')
  const [details, setDetails] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [ref, setRef] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (!provider) err.provider = 'Choose the listing to correct'
    if (!issue) err.issue = 'What needs correcting?'
    if (details.trim().length < 10) err.details = 'Add a few details (at least 10 characters)'
    if (email && !EMAIL.test(email)) err.email = 'Enter a valid email or leave it empty'
    setErrors(err)
    if (!Object.keys(err).length) setRef(queue('pfa.corrections', { provider, issue, details, email }))
  }

  if (ref)
    return (
      <Success title="Thanks for helping the community" onDone={onDone}>
        Correction <strong className="font-mono text-forest-800">{ref}</strong> is in our review queue. Verified corrections usually go live within 48 hours.
      </Success>
    )

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <Field label="Listing" required tone="forest" error={errors.provider}>
        {(p) => (
          <select {...p} value={provider} onChange={(e) => setProvider(e.target.value)}>
            <option value="">Select a provider</option>
            {PROVIDERS.map((x) => <option key={x.id} value={x.id}>{x.name} · {x.area}, {x.city}</option>)}
          </select>
        )}
      </Field>
      <div>
        <p className="text-sm font-medium text-forest-950/85">What’s wrong? <span className="text-red-500">*</span></p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ISSUES.map((i) => <Chip key={i} active={issue === i} onClick={() => setIssue(i)}>{i}</Chip>)}
        </div>
        {errors.issue && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.issue}</p>}
      </div>
      <Field label="Correct information" required tone="forest" error={errors.details}>
        {(p) => <textarea {...p} rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g. The clinic now closes at 8 PM on Sundays." />}
      </Field>
      <Field label="Your email" tone="forest" error={errors.email} hint="Optional: we’ll let you know when it’s updated.">
        {(p) => <input {...p} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />}
      </Field>
      <button className={btnPrimary}>Submit correction</button>
    </form>
  )
}

/* ----------------------------------- Sign in ---------------------------------- */

export function SignInForm({ onDone }: { onDone: (name: string) => void }) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const toast = useToast()

  if (step === 'phone')
    return (
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          if (!PHONE.test(phone.trim())) return setError('Enter a valid 10-digit mobile number')
          setError('')
          setStep('otp')
          toast('OTP sent (demo code: 1234)', 'info')
        }}
        className="grid gap-4"
      >
        <Field label="Mobile number" tone="forest" error={error}>
          {(p) => <input {...p} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="98765 43210" autoComplete="tel" />}
        </Field>
        <button className={btnPrimary}>Send OTP</button>
        <p className="text-center text-xs text-forest-950/45">Demo sign-in. No SMS is actually sent.</p>
      </form>
    )

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (otp !== '1234') return setError('Incorrect code. Use 1234 in this demo.')
        toast('Signed in')
        onDone('Guest')
      }}
      className="grid gap-4"
    >
      <Field label={`Enter the code sent to ${phone}`} tone="forest" error={error}>
        {(p) => <input {...p} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" autoComplete="one-time-code" placeholder="••••" className={cn(p.className, 'text-center font-mono text-xl tracking-[0.6em]')} />}
      </Field>
      <button className={btnPrimary}>Verify & sign in</button>
      <button type="button" onClick={() => setStep('phone')} className="text-sm font-medium text-forest-700">Change number</button>
    </form>
  )
}

/* ------------------------------------ Info ------------------------------------ */

export type InfoTopic = 'about' | 'contact' | 'privacy'

const INFO: Record<InfoTopic, { title: string; body: ReactNode }> = {
  about: {
    title: 'About Practo for Animals',
    body: (
      <>
        <p>Finding reliable animal care is still mostly word of mouth. Listings are scattered, out of date and hard to trust, and that hurts most in an emergency.</p>
        <p>Practo for Animals brings veterinary clinics, hospitals, diagnostics, boarding, ambulances and NGOs into one verified directory. Pet owners and rescuers can compare providers on what matters: services, species treated, availability and distance.</p>
      </>
    ),
  },
  contact: {
    title: 'Contact us',
    body: (
      <>
        <p><strong>Support:</strong> support@practoforanimals.example</p>
        <p><strong>Partnerships:</strong> partners@practoforanimals.example</p>
        <p className="text-forest-950/50">These are placeholder addresses for this prototype.</p>
      </>
    ),
  },
  privacy: {
    title: 'Privacy policy (summary)',
    body: (
      <>
        <p>We only collect what we need to connect you with care providers: your location (when you allow it), your searches and the contact details you choose to share.</p>
        <p>We never sell personal data. Providers only see your details when you contact or book them. You can ask for your data to be deleted at any time.</p>
        <p className="text-forest-950/50">This prototype keeps form submissions only in your browser’s local storage.</p>
      </>
    ),
  },
}

export function InfoDialog({ topic, onClose }: { topic: InfoTopic; onClose: () => void }) {
  return (
    <Modal open onClose={onClose} title={INFO[topic].title} size="sm" className="font-jakarta">
      <div className="space-y-3 text-sm leading-relaxed text-forest-950/75">{INFO[topic].body}</div>
    </Modal>
  )
}
