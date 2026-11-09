/**
 * FUTURE INTEGRATION: NOT ACTIVE IN THIS PROTOTYPE.
 *
 * Calls an n8n workflow that runs the LLM (Claude or OpenAI) and returns JSON matching
 * ./schema.ts. It is only used when VITE_N8N_WEBHOOK_URL is set, and that workflow
 * isn't part of this repo. See the Workflow page in the app for the proposed design.
 *
 * Expected n8n webhook contract:
 *   POST {base}/carousel  body: { step: 'research' | 'slides' | 'design', brief, research? }
 *   200  → { data: <Research | Slide[] | VisualDirection> }
 */
import { uid } from '@/lib/cn'
import type { Brief, Research, Slide, VisualDirection } from '../types'
import { assertResearch, assertSlides, assertVisual } from './schema'
import type { CarouselAIProvider } from './types'

async function call<T>(base: string, step: string, payload: object): Promise<T> {
  const res = await fetch(`${base.replace(/\/$/, '')}/carousel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ step, ...payload }),
  })
  if (!res.ok) throw new Error(`n8n ${step} failed (${res.status})`)
  return ((await res.json()) as { data: T }).data
}

export function createN8nProvider(base: string): CarouselAIProvider {
  return {
    id: 'n8n',
    label: 'n8n → LLM pipeline',
    isMock: false,
    async research(brief: Brief) {
      return assertResearch(await call<Research>(base, 'research', { brief }))
    },
    async writeSlides(brief: Brief, research: Research) {
      const slides = assertSlides(await call<Slide[]>(base, 'slides', { brief, research }))
      return slides.map((s) => ({ ...s, id: s.id || uid('s') }))
    },
    async designDirection(brief: Brief, research: Research) {
      return assertVisual(await call<VisualDirection>(base, 'design', { brief, research }))
    },
  }
}
