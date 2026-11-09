import { NavLink, Link } from 'react-router-dom'
import { GraduationCap, LayoutGrid, PawPrint, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'

export const PROJECTS = [
  { to: '/practo', label: 'Practo for Animals', short: 'Practo', icon: PawPrint, dot: 'bg-mint-400' },
  { to: '/education', label: 'AI Education', short: 'Education', icon: GraduationCap, dot: 'bg-electric' },
  { to: '/studio', label: 'AI Content Studio', short: 'Studio', icon: Sparkles, dot: 'bg-violet-400' },
] as const

/** Thin global switcher shared by all three experiences. */
export function ProjectBar() {
  return (
    <div className="relative z-50 border-b border-white/5 bg-[#0b0d12] text-white">
      <div className="mx-auto flex h-10 max-w-[1440px] items-center gap-3 px-3 sm:px-5">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 rounded-md px-1.5 py-1 text-xs font-semibold text-white/80 transition hover:text-white"
          aria-label="Assignment overview"
        >
          <LayoutGrid className="size-3.5" />
          <span className="hidden sm:inline">Pratham · Assignment</span>
        </Link>
        <span className="h-4 w-px bg-white/10" aria-hidden />
        <nav aria-label="Projects" className="no-scrollbar -mx-1 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1">
          {PROJECTS.map((p) => (
            <NavLink
              key={p.to}
              to={p.to}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition',
                  isActive ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white',
                )
              }
            >
              <span className={cn('size-1.5 rounded-full', p.dot)} aria-hidden />
              <span className="sm:hidden">{p.short}</span>
              <span className="hidden sm:inline">{p.label}</span>
            </NavLink>
          ))}
        </nav>
        <span className="hidden shrink-0 text-[11px] text-white/35 md:inline">Prototype · sample data</span>
      </div>
    </div>
  )
}
