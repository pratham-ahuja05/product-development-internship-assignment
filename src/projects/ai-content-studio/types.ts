export type Platform = 'instagram' | 'linkedin'
export type Tone = 'Educational' | 'Professional' | 'Conversational'
export type AspectId = 'portrait' | 'square'
export type ThemeId = 'forest' | 'midnight' | 'paper' | 'sunrise' | 'ocean'
export type SlideKind = 'cover' | 'content' | 'cta'

export interface Brief {
  topic: string
  audience: string
  platform: Platform
  tone: Tone
  slideCount: number
}

export interface Slide {
  id: string
  kind: SlideKind
  eyebrow: string
  title: string
  body: string
  example?: string
  cta?: string
}

export interface Research {
  summary: string
  insights: string[]
  angle: string
  headline: string
  outline: { title: string; point: string }[]
}

export interface VisualDirection {
  palette: { role: string; hex: string }[]
  typography: { heading: string; body: string; note: string }
  layout: string
  elements: string[]
  variations: ThemeId[]
}

export interface CarouselProject {
  id: string
  title: string
  brief: Brief
  research?: Research
  visual?: VisualDirection
  slides: Slide[]
  themeId: ThemeId
  aspect: AspectId
  status: 'draft' | 'exported'
  createdAt: string
  updatedAt: string
  exportedAt?: string
}

export interface BrandSettings {
  name: string
  handle: string
  website: string
  defaultTheme: ThemeId
  showNumbers: boolean
  showHandle: boolean
}

export const ASPECTS: Record<AspectId, { w: number; h: number; label: string }> = {
  portrait: { w: 1080, h: 1350, label: 'Portrait 4:5 · 1080×1350' },
  square: { w: 1080, h: 1080, label: 'Square 1:1 · 1080×1080' },
}
