import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { FolderKanban, LayoutDashboard, LayoutTemplate, Menu, Palette, Plus, Sparkles, Workflow, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { aiProvider } from './ai'
import { StudioProvider, useStudio } from './store'

const NAV = [
  { to: '/studio', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/studio/create', label: 'Create Carousel', icon: Plus },
  { to: '/studio/projects', label: 'My Projects', icon: FolderKanban },
  { to: '/studio/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/studio/brand', label: 'Brand Settings', icon: Palette },
]

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { brand, projects } = useStudio()
  const item = ({ isActive }: { isActive: boolean }) =>
    cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
      isActive ? 'bg-violet-50 text-violet-700' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900')

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/30">
          <Sparkles className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="font-semibold tracking-tight text-zinc-900">Content Studio</p>
          <p className="text-xs text-zinc-500">AI carousel creator</p>
        </div>
      </div>

      <nav aria-label="Studio" className="flex-1 space-y-1 px-3">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} onClick={onNavigate} className={item}>
            <n.icon className="size-[18px]" /> {n.label}
            {n.label === 'My Projects' && <span className="ml-auto rounded-md bg-zinc-100 px-1.5 text-xs text-zinc-500">{projects.length}</span>}
          </NavLink>
        ))}
        <p className="px-3 pb-1 pt-6 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">System</p>
        <NavLink to="/studio/workflow" onClick={onNavigate} className={item}>
          <Workflow className="size-[18px]" /> AI Workflow
        </NavLink>
      </nav>

      <div className="m-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
        <p className="font-semibold">{aiProvider.isMock ? 'Mock AI mode' : 'Live pipeline'}</p>
        <p className="mt-0.5 leading-relaxed text-amber-800/80">{aiProvider.isMock ? 'Generation uses predefined templates. No AI API is called.' : aiProvider.label}</p>
      </div>
      <div className="flex items-center gap-3 border-t border-zinc-200 px-5 py-4">
        <span className="grid size-9 place-items-center rounded-full bg-zinc-900 text-sm font-semibold text-white">{brand.name[0]}</span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-zinc-900">Founder</p>
          <p className="truncate text-xs text-zinc-500">{brand.name}</p>
        </div>
      </div>
    </div>
  )
}

function Shell() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  const isEditor = pathname.startsWith('/studio/editor')

  return (
    <div className="flex min-h-[calc(100vh-40px)] bg-zinc-50 font-sans text-zinc-900">
      <aside className={cn('sticky top-0 hidden h-[calc(100vh-40px)] w-64 shrink-0 border-r border-zinc-200 bg-white', isEditor ? 'xl:block' : 'lg:block')}>
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-zinc-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 animate-fade-up bg-white shadow-2xl">
            <button onClick={() => setOpen(false)} aria-label="Close navigation" className="absolute right-3 top-5 rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100"><X className="size-5" /></button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className={cn('sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur', isEditor ? 'xl:hidden' : 'lg:hidden')}>
          <button onClick={() => setOpen(true)} aria-label="Open navigation" className="rounded-lg p-1.5 hover:bg-zinc-100"><Menu className="size-5" /></button>
          <span className="flex items-center gap-2 font-semibold"><Sparkles className="size-4 text-violet-600" /> Content Studio</span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export function StudioLayout() {
  return (
    <StudioProvider>
      <Shell />
    </StudioProvider>
  )
}
