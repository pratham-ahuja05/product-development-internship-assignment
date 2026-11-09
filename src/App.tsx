import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ProjectBar } from './components/ProjectBar'
import { HubPage } from './pages/HubPage'
import { NotFoundPage } from './pages/NotFoundPage'

// Each experience is its own lazily loaded bundle.
const PractoApp = lazy(() => import('./projects/practo-animals'))
const EducationPage = lazy(() => import('./projects/ai-education/EducationPage').then((m) => ({ default: m.EducationPage })))
const StudioApp = lazy(() => import('./projects/ai-content-studio'))

const TITLES: [string, string][] = [
  ['/practo', 'Practo for Animals · Better Care for Every Paw'],
  ['/education', 'Arcline · Don’t Just Learn AI. Build With It.'],
  ['/studio', 'AI Content Studio'],
]

function useRouteChrome() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    document.title = TITLES.find(([p]) => pathname.startsWith(p))?.[1] ?? 'Pratham · Product Assignment'
  }, [pathname, hash])
}

function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-label="Loading">
      <span className="size-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-800" />
    </div>
  )
}

export function App() {
  useRouteChrome()
  return (
    <>
      <ProjectBar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HubPage />} />
          <Route path="/practo/*" element={<PractoApp />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/studio/*" element={<StudioApp />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}
