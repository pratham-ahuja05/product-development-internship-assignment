/**
 * MOCK AI ENGINE. No model is called.
 *
 * Builds structured content from predefined templates so the full workflow can be
 * demonstrated without API credentials. The output has exactly the same shape a
 * real LLM would be asked to return (see ./schema.ts).
 */
import { uid, wait } from '@/lib/cn'
import { SAMPLE_RESEARCH, SAMPLE_SLIDES, SAMPLE_VISUAL } from '../sampleCarousel'
import type { Brief, Research, Slide, ThemeId, VisualDirection } from '../types'
import type { CarouselAIProvider } from './types'
import { assertResearch, assertSlides, assertVisual } from './schema'

const isSampleTopic = (topic: string) => /animal|vet|pet/i.test(topic) && /\bai\b|artificial intelligence/i.test(topic)

const clean = (s: string) => s.trim().replace(/[.?!]+$/, '')
const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s)

const FRAMES = [
  { eyebrow: 'Context', title: (t: string) => `Why ${lowerFirst(t)} matters now`, body: (t: string, a: string) => `For ${lowerFirst(a)}, ${lowerFirst(t)} is no longer optional. The people who understand it early make better decisions and move faster.`, example: () => 'Teams that start small with one clear use case learn faster than teams waiting for the perfect plan.' },
  { eyebrow: 'Myth', title: () => 'The biggest misconception', body: (t: string) => `Most people think ${lowerFirst(t)} needs a big budget or deep expertise. In practice, it starts with a clear problem and a simple first step.`, example: () => 'One founder ran a two-week pilot with free tools before spending anything.' },
  { eyebrow: 'Step 1', title: () => 'Start with the problem', body: () => 'Write down the one outcome you want to improve. If you can’t measure it, you can’t tell whether it’s working.', example: () => '“Cut response time from 24 hours to 4” beats “use more AI.”' },
  { eyebrow: 'Step 2', title: () => 'Use a simple framework', body: () => 'Map the current process, find the slowest or most repetitive step, and improve that first. Ignore the rest for now.', example: () => 'Map → find the bottleneck → test one change → measure → repeat.' },
  { eyebrow: 'Quality', title: () => 'What good looks like', body: (t: string) => `Good ${lowerFirst(t)} is consistent, easy to explain and measurable. If you can’t show it to a colleague in two minutes, simplify it.`, example: () => 'A one-page dashboard that the whole team actually opens every week.' },
  { eyebrow: 'Avoid', title: () => 'Mistakes to avoid', body: () => 'Doing too much at once, skipping measurement and copying what worked for someone else without checking your own context.', example: () => 'Launching five initiatives in a month, then not knowing which one worked.' },
  { eyebrow: 'Toolkit', title: () => 'Tools that help', body: () => 'You don’t need a complex stack. A shared doc, a spreadsheet and one automation tool cover most early needs.', example: () => 'Google Sheets + n8n + an LLM can automate a surprising amount.' },
  { eyebrow: 'Measure', title: () => 'Measure what matters', body: () => 'Choose one leading and one lagging metric. Review them weekly and drop anything that doesn’t move them.', example: () => 'Leading: replies sent per day. Lagging: customer satisfaction.' },
]

function headlineFor(b: Brief, n: number) {
  const t = clean(b.topic)
  if (/^\d+\s/.test(t)) return t
  if (b.tone === 'Educational') return `${n} things ${lowerFirst(clean(b.audience) || 'everyone')} should know about ${lowerFirst(t)}`
  if (b.tone === 'Professional') return `${t}: a practical playbook`
  return `Let’s talk about ${lowerFirst(t)}, honestly`
}

/* --------------------------- Synchronous builders --------------------------- */

export function buildResearch(b: Brief): Research {
  if (isSampleTopic(b.topic)) return structuredClone(SAMPLE_RESEARCH)
  const t = clean(b.topic)
  const a = clean(b.audience) || 'your audience'
  const contentCount = Math.max(1, b.slideCount - 2)
  const frames = FRAMES.slice(0, contentCount)
  return {
    summary: `${t} is a growing priority for ${lowerFirst(a)}. The opportunity is real, but most people get stuck between interest and action. They need a clear starting point, a simple framework and examples they can relate to.`,
    insights: [
      `Your audience (${lowerFirst(a)}) responds best to practical, specific advice over abstract trends.`,
      `Common objection: “${t} sounds complex or expensive.” Address it early.`,
      'Concrete examples raise saves and shares on carousel posts.',
      `A ${b.tone.toLowerCase()} tone suits ${b.platform === 'linkedin' ? 'LinkedIn’s professional feed' : 'Instagram’s fast, visual feed'}.`,
    ],
    angle: `Take “${t}” from abstract to actionable: name the misconception, give a simple step-by-step path and close with one clear action.`,
    headline: headlineFor(b, contentCount),
    outline: [
      { title: 'Hook', point: headlineFor(b, contentCount) },
      ...frames.map((f) => ({ title: f.title(t), point: f.body(t, a).split('.')[0] })),
      { title: 'Conclusion + CTA', point: 'One next step and a reason to follow' },
    ],
  }
}

export function buildSlides(b: Brief, r: Research): Slide[] {
  const n = Math.min(10, Math.max(4, b.slideCount))
  if (isSampleTopic(b.topic)) {
    // The curated sample has 5 content slides; shorter requests keep the strongest ones.
    const content = SAMPLE_SLIDES.filter((s) => s.kind === 'content')
    const picked = [SAMPLE_SLIDES[0], ...content.slice(0, n - 2), SAMPLE_SLIDES[SAMPLE_SLIDES.length - 1]]
    return picked.map((s) => ({ ...s, id: uid('s') }))
  }
  const t = clean(b.topic)
  const a = clean(b.audience) || 'your audience'
  const frames = FRAMES.slice(0, n - 2)
  return [
    { id: uid('s'), kind: 'cover', eyebrow: b.platform === 'linkedin' ? 'Playbook' : 'Save this', title: r.headline, body: `A short, practical guide for ${lowerFirst(a)}. Swipe through.` },
    ...frames.map((f) => ({ id: uid('s'), kind: 'content' as const, eyebrow: f.eyebrow, title: f.title(t), body: f.body(t, a), example: f.example() })),
    {
      id: uid('s'), kind: 'cta', eyebrow: 'Your next step',
      title: b.tone === 'Conversational' ? 'Pick one idea and try it this week.' : `Start small. Measure. Then scale ${lowerFirst(t)}.`,
      body: 'Save this carousel for later and share it with someone who needs it.',
      cta: b.platform === 'linkedin' ? 'Follow for weekly playbooks →' : 'Follow for more →',
    },
  ]
}

const PALETTE_BY_THEME: Record<ThemeId, VisualDirection['palette']> = {
  forest: SAMPLE_VISUAL.palette,
  midnight: [{ role: 'Primary', hex: '#0b0d1a' }, { role: 'Accent', hex: '#8b7bff' }, { role: 'Background', hex: '#0b0d1a' }, { role: 'Surface', hex: '#171a2e' }, { role: 'Text', hex: '#ffffff' }],
  paper: [{ role: 'Primary', hex: '#0e1117' }, { role: 'Accent', hex: '#4f46e5' }, { role: 'Background', hex: '#ffffff' }, { role: 'Surface', hex: '#f3f4f6' }, { role: 'Text', hex: '#0e1117' }],
  sunrise: [{ role: 'Primary', hex: '#ff6b4a' }, { role: 'Accent', hex: '#ff6b4a' }, { role: 'Background', hex: '#fff4ec' }, { role: 'Surface', hex: '#ffe3d3' }, { role: 'Text', hex: '#2b1610' }],
  ocean: [{ role: 'Primary', hex: '#0c2340' }, { role: 'Accent', hex: '#1fb5c9' }, { role: 'Background', hex: '#eef5f8' }, { role: 'Surface', hex: '#dbe9f0' }, { role: 'Text', hex: '#0c2340' }],
}

export function buildVisual(b: Brief): VisualDirection {
  if (isSampleTopic(b.topic)) return structuredClone(SAMPLE_VISUAL)
  const techy = /ai|tech|data|software|automation|code|product/i.test(b.topic)
  const primary: ThemeId = b.platform === 'linkedin' ? (techy ? 'midnight' : 'paper') : b.tone === 'Conversational' ? 'sunrise' : 'ocean'
  const variations = [primary, ...(['paper', 'midnight', 'sunrise', 'ocean', 'forest'] as ThemeId[]).filter((x) => x !== primary)].slice(0, 3)
  return {
    palette: PALETTE_BY_THEME[primary],
    typography:
      primary === 'midnight'
        ? { heading: 'Space Grotesk SemiBold', body: 'Inter Regular', note: 'Geometric grotesk headlines signal technology while staying readable.' }
        : primary === 'ocean'
          ? { heading: 'Fraunces SemiBold', body: 'Inter Regular', note: 'Serif headlines add authority and a premium feel.' }
          : { heading: 'Plus Jakarta Sans ExtraBold', body: 'Inter / DM Sans', note: 'Heavy sans headlines stop the scroll and stay legible on mobile.' },
    layout: b.platform === 'linkedin'
      ? 'Text-led, one idea per slide, high contrast and generous margins, so it’s readable as a PDF document post.'
      : 'Bold cover, short lines and strong colour blocking. Optimised for a 4:5 feed and quick swipes.',
    elements: ['Large slide numbers', 'Example callout cards', 'Progress indicator', 'Brand handle footer', 'Swipe cue on cover'],
    variations,
  }
}

/* ----------------------------- Provider wrapper ----------------------------- */

export const mockProvider: CarouselAIProvider = {
  id: 'mock',
  label: 'Mock AI engine (templates, no API calls)',
  isMock: true,
  async research(b) {
    await wait(2200)
    return assertResearch(buildResearch(b)) // same validation step a real LLM response goes through
  },
  async writeSlides(b, r) {
    await wait(1800)
    return assertSlides(buildSlides(b, r))
  },
  async designDirection(b) {
    await wait(1300)
    return assertVisual(buildVisual(b))
  },
}
