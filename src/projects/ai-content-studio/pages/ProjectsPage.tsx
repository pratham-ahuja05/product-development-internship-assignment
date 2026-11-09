import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Copy, FolderOpen, Plus, RotateCcw, Search, Trash2 } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { cn } from '@/lib/cn'
import { useStudio } from '../store'
import { btn, PageHeader, ProjectCard } from '../ui'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Drafts' },
  { id: 'exported', label: 'Exported' },
] as const

export function ProjectsPage() {
  const { projects, deleteProject, duplicateProject, resetDemo } = useStudio()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all')
  const [platform, setPlatform] = useState<'all' | 'instagram' | 'linkedin'>('all')
  const toast = useToast()
  const navigate = useNavigate()

  const shown = projects.filter(
    (p) =>
      (filter === 'all' || p.status === filter) &&
      (platform === 'all' || p.brief.platform === platform) &&
      p.title.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
      <PageHeader
        title="My Projects"
        subtitle={`${projects.length} carousels · saved in this browser`}
        actions={
          <>
            <button className={btn.ghost} onClick={() => { if (confirm('Reset the studio to its demo data? Your changes will be lost.')) { resetDemo(); toast('Demo data restored') } }}>
              <RotateCcw className="size-4" /> Reset demo
            </button>
            <Link to="/studio/create" className={btn.primary}><Plus className="size-4" /> New carousel</Link>
          </>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex min-w-60 flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
          <Search className="size-4 text-zinc-400" />
          <label htmlFor="proj-q" className="sr-only">Search projects</label>
          <input id="proj-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects" className="w-full bg-transparent py-2.5 text-sm outline-none" />
        </div>
        <div className="flex rounded-xl border border-zinc-200 bg-white p-1" role="group" aria-label="Status">
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}
              className={cn('rounded-lg px-3 py-1.5 text-sm font-medium', filter === f.id ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100')}>{f.label}</button>
          ))}
        </div>
        <select value={platform} onChange={(e) => setPlatform(e.target.value as typeof platform)} aria-label="Platform" className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium outline-none">
          <option value="all">All platforms</option>
          <option value="linkedin">LinkedIn</option>
          <option value="instagram">Instagram</option>
        </select>
      </div>

      {shown.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              actions={
                <>
                  <button onClick={() => navigate(`/studio/editor/${p.id}`)} className={cn(btn.ghost, 'px-2 py-1.5 text-xs')}><FolderOpen className="size-3.5" /> Open</button>
                  <button onClick={() => { duplicateProject(p.id); toast('Project duplicated') }} className={cn(btn.ghost, 'px-2 py-1.5 text-xs')}><Copy className="size-3.5" /> Duplicate</button>
                  <button onClick={() => { if (confirm(`Delete “${p.title}”?`)) { deleteProject(p.id); toast('Project deleted') } }} className={cn(btn.ghost, 'ml-auto px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700')} aria-label={`Delete ${p.title}`}><Trash2 className="size-3.5" /></button>
                </>
              }
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center">
          <p className="font-medium">No projects match.</p>
          <p className="mt-1 text-sm text-zinc-500">Try another filter or create a new carousel.</p>
        </div>
      )}
    </main>
  )
}
