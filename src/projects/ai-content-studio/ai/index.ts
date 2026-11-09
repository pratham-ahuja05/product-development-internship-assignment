import { mockProvider } from './mockProvider'
import { createN8nProvider } from './n8nProvider'
import type { CarouselAIProvider } from './types'

const n8nUrl = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined

/** Active provider: the mock engine unless an n8n webhook is configured. */
export const aiProvider: CarouselAIProvider = n8nUrl ? createN8nProvider(n8nUrl) : mockProvider

export type { CarouselAIProvider }
