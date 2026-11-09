import { useEffect, useState } from 'react'
import { Bot, Check, FileJson, Sparkles, Workflow } from 'lucide-react'
import { cn } from '@/lib/cn'

const STEPS = [
  { icon: Sparkles, label: 'Prompt designed', detail: 'Classify ticket urgency → JSON' },
  { icon: Workflow, label: 'n8n workflow wired', detail: 'Gmail → Claude → Sheets' },
  { icon: FileJson, label: 'Output validated', detail: '{ urgency: "high", reply: … }' },
  { icon: Bot, label: 'Agent deployed', detail: 'Human approval on high urgency' },
]

/** Abstract "learning by building" console: a learner project progressing step by step. */
export function HeroVisual() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % (STEPS.length + 1)), 1600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px]" aria-hidden>
      {/* orbit rings */}
      <div className="absolute inset-[6%] rounded-full border border-white/[0.07]" />
      <div className="absolute inset-[18%] animate-spin-slow rounded-full border border-dashed border-electric/25" />
      <div className="absolute inset-[30%] rounded-full border border-white/[0.05]" />
      <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle,rgba(79,124,255,0.35),transparent_65%)] blur-2xl" />

      {/* orbiting nodes */}
      <div className="absolute inset-[6%] animate-spin-slow" style={{ animationDuration: '40s' }}>
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <span key={deg} className="absolute left-1/2 top-1/2 size-2.5 rounded-full shadow-[0_0_14px_currentColor]"
            style={{ transform: `rotate(${deg}deg) translate(min(43vw, 228px)) rotate(-${deg}deg)`, color: i % 2 ? '#8b5cf6' : '#22d3ee', background: 'currentColor' }} />
        ))}
      </div>

      {/* console card */}
      <div className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-night-900/80 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/15" /><span className="size-2.5 rounded-full bg-white/15" /><span className="size-2.5 rounded-full bg-white/15" />
          </div>
          <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] text-white/50">week-6 / capstone</span>
        </div>
        <p className="mt-4 font-grotesk text-sm font-medium text-white/50">Project</p>
        <p className="font-grotesk text-lg font-semibold text-white">Customer-support triage agent</p>
        <ul className="mt-4 space-y-2">
          {STEPS.map((s, i) => {
            const done = i < active
            const now = i === active
            return (
              <li key={s.label} className={cn('flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-500',
                done ? 'border-white/10 bg-white/[0.04]' : now ? 'border-electric/50 bg-electric/10' : 'border-white/5 opacity-50')}>
                <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg transition',
                  done ? 'bg-gradient-to-br from-electric to-plasma text-white' : now ? 'bg-electric/20 text-electric' : 'bg-white/5 text-white/40')}>
                  {done ? <Check className="size-4" /> : <s.icon className="size-4" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-white">{s.label}</span>
                  <span className="block truncate font-mono text-[11px] text-white/45">{s.detail}</span>
                </span>
              </li>
            )
          })}
        </ul>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-full bg-gradient-to-r from-electric via-plasma to-ion transition-all duration-700" style={{ width: `${(active / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {/* floating chips */}
      <div className="absolute left-0 top-[12%] animate-float rounded-xl border border-white/10 bg-night-800/90 px-3 py-2 font-mono text-[11px] text-ion backdrop-blur sm:left-[2%]">
        prompt.v3 ✓
      </div>
      <div className="absolute bottom-[10%] right-0 rounded-xl border border-white/10 bg-night-800/90 px-3 py-2 text-[11px] text-white/80 backdrop-blur" style={{ animation: 'float 8s ease-in-out infinite 1.2s' }}>
        <span className="text-plasma">●</span> Portfolio case study published
      </div>
    </div>
  )
}
