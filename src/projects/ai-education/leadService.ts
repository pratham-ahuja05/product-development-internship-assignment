/**
 * Lead capture service.
 *
 * Journey: Visitor → Registration form → validateLead() → leadService.submit() → LeadSink(s)
 *
 * The form only talks to `leadService`, so the storage backend can change without touching the UI:
 *   • LocalSink (default, active in this prototype): stores leads in localStorage.
 *   • WebhookSink (ready, inactive until configured): POSTs JSON to any endpoint, such as a
 *     Google Apps Script web app that appends rows to Google Sheets, an n8n webhook or your own API.
 *     Enable it by setting VITE_LEAD_WEBHOOK_URL in a .env file.
 */
import { readStorage, writeStorage } from '@/lib/useLocalStorage'
import { uid } from '@/lib/cn'
import { programmeById, type ProgrammeId } from './data'

export type LearnerStatus = 'Student' | 'Graduate' | 'Professional'

export interface LeadInput {
  fullName: string
  email: string
  phone: string
  status: LearnerStatus | ''
  programme: ProgrammeId | ''
  consent: boolean
}

export interface Lead extends Omit<LeadInput, 'status' | 'programme' | 'consent'> {
  id: string
  status: LearnerStatus
  programme: ProgrammeId
  programmeName: string
  createdAt: string
  source: string
  stage: 'New'
}

export type LeadErrors = Partial<Record<keyof LeadInput, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/

/** Pure validation, so the same rules can run on a server later. */
export function validateLead(v: LeadInput): LeadErrors {
  const e: LeadErrors = {}
  const name = v.fullName.trim()
  if (!name) e.fullName = 'Please enter your full name'
  else if (name.length < 3 || !/^[\p{L} .'-]+$/u.test(name)) e.fullName = 'Use letters only, at least 3 characters'
  if (!v.email.trim()) e.email = 'Please enter your email'
  else if (!EMAIL.test(v.email.trim())) e.email = 'That email doesn’t look right'
  if (!v.phone.trim()) e.phone = 'Please enter your phone number'
  else if (!PHONE.test(v.phone.trim())) e.phone = 'Enter a valid 10-digit Indian mobile number'
  if (!v.status) e.status = 'Select your current status'
  if (!v.programme) e.programme = 'Choose a programme'
  if (!v.consent) e.consent = 'Please agree so we can contact you'
  return e
}

export interface LeadSink {
  name: string
  save(lead: Lead): Promise<void>
}

const STORAGE_KEY = 'arcline.leads'

export const LocalSink: LeadSink = {
  name: 'Browser storage (mock)',
  async save(lead) {
    await new Promise((r) => setTimeout(r, 900)) // simulate network latency
    writeStorage(STORAGE_KEY, [lead, ...readStorage<Lead[]>(STORAGE_KEY, [])])
  },
}

export const WebhookSink = (url: string): LeadSink => ({
  name: 'Webhook',
  async save(lead) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })
    if (!res.ok) throw new Error(`Lead webhook failed: ${res.status}`)
  },
})

const webhookUrl = import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined
const sinks: LeadSink[] = webhookUrl ? [LocalSink, WebhookSink(webhookUrl)] : [LocalSink]

export const leadService = {
  sinks: sinks.map((s) => s.name),

  async submit(input: LeadInput): Promise<Lead> {
    const errors = validateLead(input)
    if (Object.keys(errors).length) throw Object.assign(new Error('Invalid lead'), { errors })
    const lead: Lead = {
      id: uid('LD-').toUpperCase(),
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.replace(/[\s-]/g, ''),
      status: input.status as LearnerStatus,
      programme: input.programme as ProgrammeId,
      programmeName: programmeById(input.programme)!.name,
      createdAt: new Date().toISOString(),
      source: 'landing-page',
      stage: 'New',
    }
    await Promise.all(sinks.map((s) => s.save(lead)))
    return lead
  },

  list: (): Lead[] => readStorage<Lead[]>(STORAGE_KEY, []),
  clear: () => writeStorage(STORAGE_KEY, []),

  toCSV(leads: Lead[]) {
    const cols: (keyof Lead)[] = ['id', 'createdAt', 'fullName', 'email', 'phone', 'status', 'programmeName', 'source', 'stage']
    const esc = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`
    return [cols.join(','), ...leads.map((l) => cols.map((c) => esc(l[c])).join(','))].join('\n')
  },
}
