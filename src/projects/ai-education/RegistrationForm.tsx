import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, Check, CheckCircle2, Database, Download, FileInput, Loader2, MousePointerClick, Send, ShieldCheck, Trash2 } from 'lucide-react'
import { Field } from '@/components/Field'
import { Modal } from '@/components/Modal'
import { cn } from '@/lib/cn'
import { PROGRAMMES, type ProgrammeId } from './data'
import { leadService, validateLead, type Lead, type LeadErrors, type LeadInput, type LearnerStatus } from './leadService'

const STATUSES: LearnerStatus[] = ['Student', 'Graduate', 'Professional']
const EMPTY: LeadInput = { fullName: '', email: '', phone: '', status: '', programme: '', consent: false }

type Stage = 0 | 1 | 2 | 3 | 4 // visitor, form, validation, submission, stored
const PIPELINE = [
  { label: 'Visitor', icon: MousePointerClick },
  { label: 'Form', icon: FileInput },
  { label: 'Validation', icon: ShieldCheck },
  { label: 'Submission', icon: Send },
  { label: 'Lead stored', icon: Database },
]

export function RegistrationForm({ programme, onProgrammeChange }: { programme: ProgrammeId | ''; onProgrammeChange: (p: ProgrammeId | '') => void }) {
  const [v, setV] = useState<LeadInput>({ ...EMPTY, programme })
  const [errors, setErrors] = useState<LeadErrors>({})
  const [touched, setTouched] = useState(false)
  const [stage, setStage] = useState<Stage>(0)
  const [lead, setLead] = useState<Lead | null>(null)
  const [showLeads, setShowLeads] = useState(false)

  useEffect(() => setV((s) => ({ ...s, programme })), [programme])

  const set = <K extends keyof LeadInput>(k: K, value: LeadInput[K]) => {
    const next = { ...v, [k]: value }
    setV(next)
    if (k === 'programme') onProgrammeChange(value as ProgrammeId | '')
    if (stage < 1) setStage(1)
    if (touched) setErrors(validateLead(next)) // live re-validation after the first submit attempt
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    setStage(2)
    const errs = validateLead(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = document.querySelector<HTMLElement>('#apply [aria-invalid="true"]')
      first?.focus()
      return
    }
    setStage(3)
    try {
      const saved = await leadService.submit(v)
      setLead(saved)
      setStage(4)
    } catch {
      setStage(1)
    }
  }

  const reset = () => {
    setV({ ...EMPTY })
    onProgrammeChange('')
    setErrors({})
    setTouched(false)
    setLead(null)
    setStage(0)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      {/* Lead journey visual */}
      <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div>
          <p className="font-grotesk text-sm font-medium text-ion">Apply · Enquire</p>
          <h2 className="mt-3 font-grotesk text-3xl font-semibold tracking-tight text-white sm:text-4xl">Reserve your spot in the next cohort.</h2>
          <p className="mt-4 text-white/60">Tell us a little about yourself. Admissions will reach out within two working days to help you pick the right programme. Registering is free and commits you to nothing.</p>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Lead capture journey · live</p>
          <ol className="mt-4 space-y-0">
            {PIPELINE.map((p, i) => {
              const done = stage > i || stage === 4
              const active = stage === i && stage !== 4
              return (
                <li key={p.label} className="relative flex items-center gap-3 pb-4 last:pb-0">
                  {i < PIPELINE.length - 1 && (
                    <span className={cn('absolute left-[17px] top-9 h-[calc(100%-28px)] w-px', done ? 'bg-gradient-to-b from-electric to-plasma' : 'bg-white/10')} aria-hidden />
                  )}
                  <span className={cn('relative grid size-9 shrink-0 place-items-center rounded-full border transition',
                    done ? 'border-transparent bg-gradient-to-br from-electric to-plasma text-white' : active ? 'border-electric text-electric shadow-[0_0_0_4px_rgba(79,124,255,0.15)]' : 'border-white/15 text-white/35')}>
                    {done ? <Check className="size-4" /> : active && stage === 3 ? <Loader2 className="size-4 animate-spin" /> : <p.icon className="size-4" />}
                  </span>
                  <span className={cn('text-sm font-medium', done || active ? 'text-white' : 'text-white/40')}>{p.label}</span>
                  {i === 2 && stage >= 2 && Object.keys(errors).length > 0 && (
                    <span className="ml-auto rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-300">{Object.keys(errors).length} to fix</span>
                  )}
                  {i === 4 && lead && <span className="ml-auto font-mono text-xs text-ion">{lead.id}</span>}
                </li>
              )
            })}
          </ol>
          <button onClick={() => setShowLeads(true)} className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-white/50 underline-offset-4 hover:text-white hover:underline">
            <Database className="size-3.5" /> Admin preview: view captured leads
          </button>
        </div>
      </div>

      {/* Form or success */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-night-800/80 p-6 shadow-2xl shadow-electric/10 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-plasma/20 blur-3xl" aria-hidden />
        {lead ? (
          <div className="relative flex min-h-[460px] flex-col items-center justify-center text-center" role="status">
            <div className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-electric to-plasma shadow-lg shadow-electric/30">
              <CheckCircle2 className="size-8 text-white" />
            </div>
            <h3 className="mt-6 font-grotesk text-2xl font-semibold text-white">You’re on the list, {lead.fullName.split(' ')[0]}!</h3>
            <p className="mt-2 max-w-sm text-white/60">
              Thanks for your interest in <strong className="text-white">{lead.programmeName}</strong>. We’ll contact you at{' '}
              <strong className="text-white">{lead.email}</strong> within two working days.
            </p>
            <dl className="mt-6 grid w-full max-w-sm grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left text-sm">
              <div><dt className="text-white/40">Reference</dt><dd className="font-mono text-ion">{lead.id}</dd></div>
              <div><dt className="text-white/40">Status</dt><dd className="text-white">{lead.status}</dd></div>
              <div className="col-span-2"><dt className="text-white/40">Stored in</dt><dd className="text-white">{leadService.sinks.join(' + ')}</dd></div>
            </dl>
            <button onClick={reset} className="mt-6 text-sm font-medium text-white/60 hover:text-white">Submit another enquiry</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="relative grid gap-5 sm:grid-cols-2" onFocus={() => stage === 0 && setStage(1)}>
            <Field label="Full name" required tone="dark" error={errors.fullName} className="sm:col-span-2">
              {(p) => <input {...p} value={v.fullName} onChange={(e) => set('fullName', e.target.value)} autoComplete="name" placeholder="Aanya Sharma" />}
            </Field>
            <Field label="Email" required tone="dark" error={errors.email}>
              {(p) => <input {...p} type="email" value={v.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" placeholder="you@example.com" />}
            </Field>
            <Field label="Phone number" required tone="dark" error={errors.phone}>
              {(p) => <input {...p} type="tel" inputMode="tel" value={v.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" placeholder="98765 43210" />}
            </Field>

            <fieldset className="sm:col-span-2">
              <legend className="text-sm font-medium text-white/80">Current status <span className="text-red-500">*</span></legend>
              <div className="mt-1.5 grid grid-cols-3 gap-2" role="radiogroup">
                {STATUSES.map((s) => (
                  <label key={s} className={cn('cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-electric/25',
                    v.status === s ? 'border-electric bg-electric/15 text-white' : 'border-white/12 text-white/60 hover:border-white/30')}>
                    <input type="radio" name="status" value={s} checked={v.status === s} onChange={() => set('status', s)} className="sr-only" aria-invalid={errors.status ? true : undefined} />
                    {s}
                  </label>
                ))}
              </div>
              {errors.status && <p className="mt-1.5 text-xs font-medium text-red-400">{errors.status}</p>}
            </fieldset>

            <Field label="Programme interested in" required tone="dark" error={errors.programme} className="sm:col-span-2">
              {(p) => (
                <select {...p} value={v.programme} onChange={(e) => set('programme', e.target.value as ProgrammeId | '')} className={cn(p.className, '[&>option]:bg-night-900')}>
                  <option value="">Select a programme</option>
                  {PROGRAMMES.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </select>
              )}
            </Field>

            <div className="sm:col-span-2">
              <label className="flex items-start gap-3 text-sm text-white/60">
                <input type="checkbox" checked={v.consent} onChange={(e) => set('consent', e.target.checked)} aria-invalid={errors.consent ? true : undefined} className="mt-0.5 size-4 accent-electric" />
                I agree to be contacted about this programme by email, phone or WhatsApp.
              </label>
              {errors.consent && <p className="mt-1.5 text-xs font-medium text-red-400">{errors.consent}</p>}
            </div>

            <button disabled={stage === 3} className="group flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-night-950 transition hover:bg-white/90 disabled:opacity-70 sm:col-span-2">
              {stage === 3 ? <><Loader2 className="size-4 animate-spin" /> Submitting…</> : <>Submit registration <ArrowRight className="size-4 transition group-hover:translate-x-0.5" /></>}
            </button>
            <p className="text-center text-xs text-white/35 sm:col-span-2">Prototype: your details are saved only in this browser.</p>
          </form>
        )}
      </div>

      <LeadsModal open={showLeads} onClose={() => setShowLeads(false)} refreshKey={lead?.id} />
    </div>
  )
}

function LeadsModal({ open, onClose, refreshKey }: { open: boolean; onClose: () => void; refreshKey?: string }) {
  const [leads, setLeads] = useState<Lead[]>([])
  useEffect(() => { if (open) setLeads(leadService.list()) }, [open, refreshKey])

  const download = () => {
    const blob = new Blob([leadService.toCSV(leads)], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'arcline-leads.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <Modal open={open} onClose={onClose} tone="dark" size="xl" title="Captured leads" description={`Sink: ${leadService.sinks.join(' + ')}. Set VITE_LEAD_WEBHOOK_URL to also send leads to Google Sheets or an API.`}>
      {leads.length === 0 ? (
        <p className="py-10 text-center text-white/50">No leads yet. Submit the form to see the record appear here.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-white/45">
                <tr>{['Ref', 'Name', 'Email', 'Phone', 'Status', 'Programme', 'Created'].map((h) => <th key={h} className="px-3 py-2.5 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td className="px-3 py-2.5 font-mono text-xs text-ion">{l.id}</td>
                    <td className="px-3 py-2.5">{l.fullName}</td>
                    <td className="px-3 py-2.5">{l.email}</td>
                    <td className="px-3 py-2.5">{l.phone}</td>
                    <td className="px-3 py-2.5">{l.status}</td>
                    <td className="px-3 py-2.5">{l.programmeName}</td>
                    <td className="px-3 py-2.5 text-white/45">{new Date(l.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => { leadService.clear(); setLeads([]) }} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white">
              <Trash2 className="size-4" /> Clear
            </button>
            <button onClick={download} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-night-950">
              <Download className="size-4" /> Export CSV
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}
