import type { ThemeId } from './types'

export type LayoutStyle = 'editorial' | 'bold' | 'minimal'

export interface CarouselTheme {
  id: ThemeId
  name: string
  description: string
  layout: LayoutStyle
  bg: string
  /** Alternate background for cover and CTA slides. */
  coverBg: string
  coverText: string
  surface: string
  text: string
  muted: string
  accent: string
  accentText: string
  headingFont: string
  bodyFont: string
  headingWeight: number
}

export const THEMES: Record<ThemeId, CarouselTheme> = {
  forest: {
    id: 'forest', name: 'Forest Clinic', description: 'Editorial serif, deep green and warm paper. Calm and credible.', layout: 'editorial',
    bg: '#f6f1e7', coverBg: '#0b3a28', coverText: '#f6f1e7', surface: '#ebe3d3', text: '#0b2a1d', muted: '#4c5f55',
    accent: '#2f9e6e', accentText: '#ffffff', headingFont: 'Fraunces', bodyFont: 'DM Sans', headingWeight: 600,
  },
  midnight: {
    id: 'midnight', name: 'Midnight Signal', description: 'Dark, techy and high-contrast with violet glow. Built for tech topics.', layout: 'bold',
    bg: '#0b0d1a', coverBg: '#0b0d1a', coverText: '#ffffff', surface: '#171a2e', text: '#ffffff', muted: '#a3a8c9',
    accent: '#8b7bff', accentText: '#0b0d1a', headingFont: 'Space Grotesk', bodyFont: 'Inter', headingWeight: 600,
  },
  paper: {
    id: 'paper', name: 'Paper & Ink', description: 'Minimal white, strong black type and one accent. Very LinkedIn.', layout: 'minimal',
    bg: '#ffffff', coverBg: '#ffffff', coverText: '#0e1117', surface: '#f3f4f6', text: '#0e1117', muted: '#5b616e',
    accent: '#4f46e5', accentText: '#ffffff', headingFont: 'Plus Jakarta Sans', bodyFont: 'Inter', headingWeight: 800,
  },
  sunrise: {
    id: 'sunrise', name: 'Sunrise', description: 'Warm coral and cream. Friendly and energetic for Instagram.', layout: 'bold',
    bg: '#fff4ec', coverBg: '#ff6b4a', coverText: '#fff8f3', surface: '#ffe3d3', text: '#2b1610', muted: '#7a4a3c',
    accent: '#ff6b4a', accentText: '#ffffff', headingFont: 'Plus Jakarta Sans', bodyFont: 'DM Sans', headingWeight: 800,
  },
  ocean: {
    id: 'ocean', name: 'Deep Ocean', description: 'Navy and aqua with serif headlines. Thoughtful and premium.', layout: 'editorial',
    bg: '#eef5f8', coverBg: '#0c2340', coverText: '#eef5f8', surface: '#dbe9f0', text: '#0c2340', muted: '#4a6178',
    accent: '#1fb5c9', accentText: '#0c2340', headingFont: 'Fraunces', bodyFont: 'Inter', headingWeight: 600,
  },
}

export const THEME_LIST = Object.values(THEMES)
