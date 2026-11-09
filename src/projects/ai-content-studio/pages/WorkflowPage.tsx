import {
  Bot, CheckCircle2, CircleDashed, Cloud, FileCheck2, FileDown, FileJson, LayoutTemplate, Lightbulb, PenTool, ShieldCheck, Sheet, UserCheck, Workflow, Zap,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { aiProvider } from '../ai'
import { SLIDES_JSON_EXAMPLE } from '../ai/schema'
import { PageHeader } from '../ui'

type Mode = 'auto' | 'human' | 'both'
type Proto = 'real' | 'mock' | 'none'

const FLOW: { icon: typeof Bot; title: string; tool: string; mode: Mode; proto: Proto; text: string }[] = [
  { icon: Lightbulb, title: 'Founder enters raw idea', tool: 'Content Studio UI', mode: 'human', proto: 'real', text: 'Topic, audience, platform, tone and slide count are captured as a structured brief.' },
  { icon: Zap, title: 'n8n automation trigger', tool: 'n8n webhook', mode: 'auto', proto: 'none', text: 'The studio POSTs the brief to an n8n webhook. n8n logs a new row in Google Sheets with status “Generating”.' },
  { icon: Bot, title: 'LLM research & content generation', tool: 'Claude / OpenAI', mode: 'auto', proto: 'mock', text: 'Prompt chain: research (summary, insights, angle) → outline → slide copy with examples → CTA. Brand voice and rules are sent as a system prompt.' },
  { icon: FileJson, title: 'Structured JSON output', tool: 'LLM structured output', mode: 'auto', proto: 'mock', text: 'The model must return JSON matching a fixed schema: slides[], kinds, titles, bodies and suggested theme. No free-form text reaches the design step.' },
  { icon: ShieldCheck, title: 'Content validation', tool: 'n8n Code node', mode: 'auto', proto: 'real', text: 'Checks the schema, length limits, a cover first and CTA last, and banned claims. On failure it retries with the errors attached, at most twice.' },
  { icon: LayoutTemplate, title: 'Visual template selection', tool: 'Rules + LLM suggestion', mode: 'both', proto: 'mock', text: 'Picks a brand-approved theme from platform, tone and topic, and offers three variations. The founder can override.' },
  { icon: PenTool, title: 'Canva integration or automated rendering', tool: 'Canva Autofill API / in-app renderer', mode: 'auto', proto: 'real', text: 'Option A: fill a Canva brand template through the Autofill API so the result stays editable in Canva. Option B (built here): render slides in-app from the same JSON.' },
  { icon: Workflow, title: 'Editable carousel output', tool: 'Content Studio editor', mode: 'human', proto: 'real', text: 'The founder edits text, reorders, adds or removes slides and switches themes with a live preview.' },
  { icon: UserCheck, title: 'Founder approval', tool: 'Review + Export (prototype) · Approve → n8n (production)', mode: 'human', proto: 'real', text: 'Nothing is exported without the founder reviewing it. In this prototype, approval means reviewing the slides in the editor and choosing Export. In production, an Approve action would also update the Google Sheets row to “Approved” (not connected).' },
  { icon: FileDown, title: 'PDF / PNG export', tool: 'html-to-image + jsPDF → Google Drive', mode: 'auto', proto: 'real', text: 'Exports a PDF for LinkedIn and PNGs for Instagram. In production, files are uploaded to a dated Drive folder and the link is written back to Sheets.' },
]

const MODE: Record<Mode, { label: string; cls: string }> = {
  auto: { label: 'Automated', cls: 'bg-sky-50 text-sky-700 ring-sky-200' },
  human: { label: 'Founder action', cls: 'bg-amber-50 text-amber-800 ring-amber-200' },
  both: { label: 'AI suggests · founder decides', cls: 'bg-violet-50 text-violet-700 ring-violet-200' },
}
const PROTO: Record<Proto, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  real: { label: 'Working in prototype', cls: 'text-emerald-700', icon: CheckCircle2 },
  mock: { label: 'Mocked in prototype', cls: 'text-amber-700', icon: CircleDashed },
  none: { label: 'Not connected yet', cls: 'text-zinc-500', icon: CircleDashed },
}

const TOOLS = [
  { icon: Bot, name: 'Claude or OpenAI', role: 'Research & copywriting', why: 'Strong long-form reasoning, reliable structured JSON output and good control over brand voice through system prompts. Claude is the default for research-heavy, nuanced copy. The provider sits behind an interface, so models can be swapped.' },
  { icon: Workflow, name: 'n8n', role: 'Orchestration', why: 'A visual workflow builder with code nodes for validation, retries and branching. It can be self-hosted (data control, low cost at volume) and has native nodes for LLMs, Google Sheets, Drive and webhooks.' },
  { icon: PenTool, name: 'Canva', role: 'Editable brand templates', why: 'Founders and teams already know it. Brand Kit and template autofill keep output on-brand while staying editable without a designer. The in-app renderer is the fallback.' },
  { icon: Sheet, name: 'Google Sheets', role: 'Content tracker', why: 'A zero-setup content calendar and status board (Idea → Generating → Review → Approved → Exported) that non-technical teammates can read and edit.' },
  { icon: Cloud, name: 'Google Drive', role: 'Asset storage', why: 'Organised, shareable storage for exported PDFs and PNGs, with folder-per-month structure and links written back to Sheets.' },
]

const DATA_FLOW = [
  ['Studio UI', 'n8n webhook', 'Brief JSON { topic, audience, platform, tone, slideCount }'],
  ['n8n', 'Google Sheets', 'New row: id, topic, platform, status = Generating'],
  ['n8n', 'Claude / OpenAI', 'System prompt (brand rules) + brief → research, then slides'],
  ['LLM', 'n8n validator', 'Structured JSON (slides[], design) → validated or retried'],
  ['n8n', 'Canva / Studio', 'Validated JSON → template fields or in-app renderer'],
  ['Studio', 'n8n', 'Approval event + final JSON'],
  ['n8n', 'Google Drive / Sheets', 'PDF & PNG files → Drive; link and status = Exported → Sheets'],
]

export function WorkflowPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      <PageHeader title="AI automation architecture" subtitle="How a raw idea becomes an approved, exported carousel, and how it scales." />

      <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <FileCheck2 className="mt-0.5 size-5 shrink-0" />
        <p>
          <strong>Honest status:</strong> this page describes the proposed production workflow. In this prototype, AI generation runs on a{' '}
          <strong>{aiProvider.isMock ? 'local mock engine' : aiProvider.label}</strong> with the same JSON contract. Editing, validation rules and PDF/PNG export work for real.
          n8n, Canva, Google Sheets and Drive are <strong>not connected</strong>.
        </p>
      </div>

      {/* ------------------------------ Flow ------------------------------ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">End-to-end workflow</h2>
        <ol className="relative mt-6 space-y-3">
          <span className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-violet-300 via-indigo-300 to-emerald-300" aria-hidden />
          {FLOW.map((f, i) => {
            const P = PROTO[f.proto]
            return (
              <li key={f.title} className="relative flex gap-4">
                <span className={cn('relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border bg-white shadow-sm', f.mode === 'human' ? 'border-amber-200 text-amber-600' : 'border-violet-200 text-violet-600')}>
                  <f.icon className="size-6" />
                </span>
                <div className="flex-1 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-zinc-400">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="font-semibold">{f.title}</h3>
                    <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1', MODE[f.mode].cls)}>{MODE[f.mode].label}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-zinc-600">{f.text}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="rounded-md bg-zinc-100 px-2 py-1 font-medium text-zinc-700">{f.tool}</span>
                    <span className={cn('flex items-center gap-1 font-medium', P.cls)}><P.icon className="size-3.5" /> {P.label}</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {/* ------------------------------ Tools ----------------------------- */}
      <section className="mt-14">
        <h2 className="text-lg font-semibold">Recommended tools and why</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <article key={t.name} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-zinc-900 text-white"><t.icon className="size-5" /></span>
                <div><h3 className="font-semibold">{t.name}</h3><p className="text-xs text-zinc-500">{t.role}</p></div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">{t.why}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------------------- Data flow --------------------------- */}
      <section className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="text-lg font-semibold">How data moves between tools</h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
                <tr><th className="px-4 py-3 font-medium">From</th><th className="px-4 py-3 font-medium">To</th><th className="px-4 py-3 font-medium">Payload</th></tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {DATA_FLOW.map(([a, b, c]) => (
                  <tr key={a + b + c}><td className="px-4 py-3 font-medium">{a}</td><td className="px-4 py-3 font-medium">{b}</td><td className="px-4 py-3 text-zinc-600">{c}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">The JSON contract</h2>
          <pre className="mt-5 overflow-x-auto rounded-2xl bg-zinc-900 p-5 text-[12.5px] leading-relaxed text-zinc-100"><code>{SLIDES_JSON_EXAMPLE}</code></pre>
          <p className="mt-2 text-xs text-zinc-500">One schema is used by the mock engine, the validator (<code>ai/schema.ts</code>) and the future n8n provider (<code>ai/n8nProvider.ts</code>).</p>
        </div>
      </section>

      {/* ---------------------- Automated vs approval -------------------- */}
      <section className="mt-14 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-6">
          <h2 className="flex items-center gap-2 font-semibold text-sky-900"><Zap className="size-5" /> Automated</h2>
          <ul className="mt-4 space-y-2 text-sm text-sky-950/80">
            {['Topic research, insights and outline', 'Slide copy, examples and CTA drafting', 'Schema and length validation, with automatic retries', 'Theme suggestion and slide rendering', 'File export, Drive upload and Sheets status updates'].map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sky-600" />{x}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
          <h2 className="flex items-center gap-2 font-semibold text-amber-900"><UserCheck className="size-5" /> Requires founder approval</h2>
          <ul className="mt-4 space-y-2 text-sm text-amber-950/80">
            {['The brief: what to say and to whom', 'Choosing the angle and headline (editable at step 2)', 'Final wording, including any factual or medical claims', 'Choosing the visual variation', 'Approving before any export or scheduled publishing'].map((x) => <li key={x} className="flex gap-2"><UserCheck className="mt-0.5 size-4 shrink-0 text-amber-600" />{x}</li>)}
          </ul>
        </div>
      </section>

      {/* ------------------------------ Scale ----------------------------- */}
      <section className="mt-14">
        <h2 className="text-lg font-semibold">How the system scales</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Batch generation', 'Queue a month of ideas from a Google Sheet. n8n processes them in parallel with rate limiting and the founder reviews them in one sitting.'],
            ['Reusable brand system', 'Brand rules, tone and themes live in one config used by prompts and templates, so output stays consistent as volume grows.'],
            ['Swappable models', 'The provider interface lets you route cheap models to drafts and stronger models to final copy, or switch vendors without UI changes.'],
            ['More formats', 'The same JSON can render LinkedIn PDFs, Instagram carousels, single posts, threads or blog outlines.'],
            ['Team workflows', 'Add roles such as writer, reviewer and approver, comment threads and a scheduling step (Buffer, Meta and LinkedIn APIs) after approval.'],
            ['Quality loop', 'Log edits the founder makes to AI drafts and engagement after posting, then feed both back into the prompts.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
