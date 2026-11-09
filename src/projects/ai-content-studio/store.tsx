import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { uid } from '@/lib/cn'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { buildResearch, buildSlides, buildVisual } from './ai/mockProvider'
import { SAMPLE_BRIEF, SAMPLE_RESEARCH, SAMPLE_SLIDES, SAMPLE_VISUAL } from './sampleCarousel'
import type { BrandSettings, Brief, CarouselProject, ThemeId } from './types'

export const SAMPLE_PROJECT_ID = 'sample-ai-animal-healthcare'

const daysAgo = (d: number) => new Date(Date.now() - d * 864e5).toISOString()

function seedProject(id: string, brief: Brief, themeId: ThemeId, status: CarouselProject['status'], ageDays: number): CarouselProject {
  const research = buildResearch(brief)
  return {
    id, title: research.headline, brief, research, visual: buildVisual(brief), slides: buildSlides(brief, research),
    themeId, aspect: 'portrait', status, createdAt: daysAgo(ageDays + 1), updatedAt: daysAgo(ageDays),
    exportedAt: status === 'exported' ? daysAgo(ageDays) : undefined,
  }
}

function seed(): CarouselProject[] {
  return [
    {
      id: SAMPLE_PROJECT_ID,
      title: SAMPLE_BRIEF.topic,
      brief: SAMPLE_BRIEF,
      research: SAMPLE_RESEARCH,
      visual: SAMPLE_VISUAL,
      slides: SAMPLE_SLIDES.map((s, i) => ({ ...s, id: `sample-${i + 1}` })),
      themeId: 'forest',
      aspect: 'portrait',
      status: 'exported',
      createdAt: daysAgo(1),
      updatedAt: daysAgo(0.02),
      exportedAt: daysAgo(0.02),
    },
    seedProject('seed-vet-clinic', { topic: 'Why every vet clinic needs a digital front door', audience: 'Veterinary clinic owners', platform: 'linkedin', tone: 'Professional', slideCount: 6 }, 'paper', 'draft', 2),
    seedProject('seed-prompting', { topic: 'Prompt engineering basics', audience: 'College students', platform: 'instagram', tone: 'Conversational', slideCount: 6 }, 'sunrise', 'draft', 4),
    seedProject('seed-automation', { topic: 'Automating content operations with AI', audience: 'Early-stage founders', platform: 'linkedin', tone: 'Educational', slideCount: 7 }, 'midnight', 'exported', 8),
  ]
}

export const DEFAULT_BRAND: BrandSettings = {
  name: 'Practo for Animals',
  handle: '@practoforanimals',
  website: 'practoforanimals.example',
  defaultTheme: 'forest',
  showNumbers: true,
  showHandle: true,
}

interface StudioStore {
  projects: CarouselProject[]
  brand: BrandSettings
  setBrand: (b: BrandSettings) => void
  getProject: (id: string) => CarouselProject | undefined
  createProject: (p: Omit<CarouselProject, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => CarouselProject
  updateProject: (id: string, patch: Partial<CarouselProject>) => void
  deleteProject: (id: string) => void
  duplicateProject: (id: string) => CarouselProject | undefined
  resetDemo: () => void
}

const Ctx = createContext<StudioStore>(null!)
export const useStudio = () => useContext(Ctx)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useLocalStorage<CarouselProject[]>('studio.projects.v1', seed)
  const [brand, setBrand] = useLocalStorage<BrandSettings>('studio.brand.v1', DEFAULT_BRAND)

  const getProject = useCallback((id: string) => projects.find((p) => p.id === id), [projects])

  const createProject: StudioStore['createProject'] = useCallback((p) => {
    const now = new Date().toISOString()
    const project: CarouselProject = { ...p, id: uid('c'), status: 'draft', createdAt: now, updatedAt: now }
    setProjects((s) => [project, ...s])
    return project
  }, [setProjects])

  const updateProject = useCallback((id: string, patch: Partial<CarouselProject>) => {
    setProjects((s) => s.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)))
  }, [setProjects])

  const deleteProject = useCallback((id: string) => setProjects((s) => s.filter((p) => p.id !== id)), [setProjects])

  const duplicateProject = useCallback((id: string) => {
    const src = projects.find((p) => p.id === id)
    if (!src) return
    const now = new Date().toISOString()
    const copy: CarouselProject = {
      ...structuredClone(src), id: uid('c'), title: `${src.title} (copy)`, status: 'draft', createdAt: now, updatedAt: now, exportedAt: undefined,
      slides: src.slides.map((s) => ({ ...s, id: uid('s') })),
    }
    setProjects((s) => [copy, ...s])
    return copy
  }, [projects, setProjects])

  const value = useMemo<StudioStore>(() => ({
    projects: [...projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    brand, setBrand, getProject, createProject, updateProject, deleteProject, duplicateProject,
    resetDemo: () => { setProjects(seed()); setBrand(DEFAULT_BRAND) },
  }), [projects, brand, setBrand, getProject, createProject, updateProject, deleteProject, duplicateProject, setProjects])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
