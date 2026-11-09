/**
 * Content validation step. LLM output is untrusted, so every response is checked
 * before it reaches the editor. The same rules can run inside n8n (Code node).
 */
import type { Research, Slide, VisualDirection } from '../types'

const str = (v: unknown, max = 400): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= max

export function assertResearch(r: Research): Research {
  if (!str(r?.summary, 1200) || !Array.isArray(r.insights) || !str(r.headline, 160) || !Array.isArray(r.outline))
    throw new Error('Research output failed validation')
  return r
}

export function assertSlides(slides: Slide[]): Slide[] {
  if (!Array.isArray(slides) || slides.length < 3 || slides.length > 12) throw new Error('Slide count out of range')
  if (slides[0].kind !== 'cover' || slides[slides.length - 1].kind !== 'cta') throw new Error('Carousel must start with a cover and end with a CTA')
  for (const s of slides) {
    if (!str(s.title, 140)) throw new Error('Slide title missing or too long')
    if (!str(s.body, 320)) throw new Error('Slide body missing or too long')
  }
  return slides
}

export function assertVisual(v: VisualDirection): VisualDirection {
  if (!Array.isArray(v?.palette) || !v.palette.every((p) => /^#[0-9a-f]{6}$/i.test(p.hex))) throw new Error('Invalid palette')
  return v
}

/** JSON contract shown on the workflow page and sent to the LLM as the output format. */
export const SLIDES_JSON_EXAMPLE = `{
  "headline": "5 Ways AI Is Transforming Animal Healthcare",
  "slides": [
    { "kind": "cover",   "eyebrow": "AI × Animal Healthcare", "title": "…", "body": "…" },
    { "kind": "content", "eyebrow": "Detection", "title": "AI-assisted disease detection",
      "body": "≤ 320 chars", "example": "One concrete example" },
    { "kind": "cta",     "title": "…", "body": "…", "cta": "Follow for more →" }
  ],
  "design": { "theme": "forest", "palette": ["#0b3a28", "#2f9e6e", "#f6f1e7"] }
}`
