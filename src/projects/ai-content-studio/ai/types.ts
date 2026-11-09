import type { Brief, Research, Slide, VisualDirection } from '../types'

/**
 * Every generation step goes through this interface. The UI never knows whether
 * content came from the local mock engine or a real LLM pipeline (n8n → Claude/OpenAI).
 */
export interface CarouselAIProvider {
  id: string
  label: string
  isMock: boolean
  research(brief: Brief): Promise<Research>
  writeSlides(brief: Brief, research: Research): Promise<Slide[]>
  designDirection(brief: Brief, research: Research): Promise<VisualDirection>
}
