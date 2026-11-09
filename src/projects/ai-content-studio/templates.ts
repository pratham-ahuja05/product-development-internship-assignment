import type { Brief, ThemeId } from './types'
import { SAMPLE_BRIEF } from './sampleCarousel'

export interface QuickTemplate {
  id: string
  name: string
  description: string
  themeId: ThemeId
  structure: string
  brief: Partial<Brief>
}

export const TEMPLATES: QuickTemplate[] = [
  { id: 'sample', name: 'AI in Animal Healthcare', description: 'The finished 7-slide sample, ready to regenerate or customise.', themeId: 'forest', structure: 'Hook → 5 ways → CTA', brief: SAMPLE_BRIEF },
  { id: 'listicle', name: 'Listicle', description: 'Numbered tips or ways. The most saved carousel format.', themeId: 'paper', structure: 'Hook → N tips → CTA', brief: { tone: 'Educational', platform: 'linkedin', slideCount: 7 } },
  { id: 'myth', name: 'Myth vs. reality', description: 'Correct common misconceptions in your industry.', themeId: 'midnight', structure: 'Hook → myths → truth → CTA', brief: { tone: 'Professional', platform: 'linkedin', slideCount: 6 } },
  { id: 'howto', name: 'Step-by-step guide', description: 'Walk your audience through a process they can follow.', themeId: 'ocean', structure: 'Problem → steps → result → CTA', brief: { tone: 'Educational', platform: 'instagram', slideCount: 8 } },
  { id: 'story', name: 'Founder story', description: 'A personal lesson told across slides.', themeId: 'sunrise', structure: 'Moment → struggle → lesson → CTA', brief: { tone: 'Conversational', platform: 'instagram', slideCount: 6 } },
  { id: 'trends', name: 'Industry trends', description: 'What’s changing and what it means for your audience.', themeId: 'midnight', structure: 'Hook → trends → implication → CTA', brief: { tone: 'Professional', platform: 'linkedin', slideCount: 7 } },
]
