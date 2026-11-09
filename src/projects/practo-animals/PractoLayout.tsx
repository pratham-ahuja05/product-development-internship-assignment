import { createContext, useContext, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useSearchParams } from 'react-router-dom'
import { Menu, PawPrint, X, UserRound } from 'lucide-react'
import { cn } from '@/lib/cn'
import { CATEGORIES, providerById, type CategoryId } from './data'
import { ProviderModal } from './ProviderModal'
import { BusinessForm, CorrectionForm, InfoDialog, SignInForm, type InfoTopic } from './forms'
import { Modal } from '@/components/Modal'

interface PractoUI {
  openProvider: (id: string) => void
  openBusiness: () => void
  openCorrection: (providerId?: string) => void
  openSignIn: () => void
  openInfo: (topic: InfoTopic) => void
  user: string | null
}

const Ctx = createContext<PractoUI>(null!)
export const usePracto = () => useContext(Ctx)

type Dialog =
  | { kind: 'provider'; id: string }
  | { kind: 'business' }
  | { kind: 'correction'; providerId?: string }
  | { kind: 'signin' }
  | { kind: 'info'; topic: InfoTopic }
  | null

const NAV: { label: string; category: CategoryId }[] = [
  { label: 'Find a Vet', category: 'clinic' },
  { label: 'Hospitals', category: 'hospital' },
  { label: 'Diagnostics', category: 'diagnostics' },
  { label: 'Boarding', category: 'boarding' },
  { label: 'NGOs', category: 'ngo' },
]

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className={cn('grid size-9 place-items-center rounded-xl', light ? 'bg-mint-300 text-forest-950' : 'bg-forest-800 text-mint-300')}>
        <PawPrint className="size-5" strokeWidth={2.2} />
      </span>
      <span className="leading-none">
        <span className={cn('block font-jakarta text-[17px] font-extrabold tracking-tight', light ? 'text-white' : 'text-forest-950')}>Practo</span>
        <span className={cn('block text-[11px] font-semibold tracking-wide', light ? 'text-mint-300' : 'text-forest-600')}>for Animals</span>
      </span>
    </span>
  )
}

function Header({ ui }: { ui: PractoUI }) {
  const [open, setOpen] = useState(false)
  const [params] = useSearchParams()
  const activeCat = params.get('category')

  const link = (c: (typeof NAV)[number], mobile = false) => (
    <NavLink
      key={c.category}
      to={`/practo/search?category=${c.category}`}
      onClick={() => setOpen(false)}
      className={() =>
        cn(
          'rounded-lg font-medium transition',
          mobile ? 'block px-3 py-3 text-base' : 'px-3 py-2 text-sm',
          activeCat === c.category ? 'bg-mint-100 text-forest-800' : 'text-forest-950/70 hover:bg-mint-50 hover:text-forest-900',
        )
      }
    >
      {c.label}
    </NavLink>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-forest-900/5 bg-cream/85 backdrop-blur-lg">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/practo" aria-label="Practo for Animals home">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="ml-6 hidden items-center gap-0.5 lg:flex">
          {NAV.map((c) => link(c))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <button onClick={ui.openBusiness} className="rounded-lg px-3 py-2 text-sm font-semibold text-forest-800 transition hover:bg-mint-100">
            List Your Business
          </button>
          {ui.user ? (
            <span className="flex items-center gap-2 rounded-full bg-mint-100 py-1.5 pl-1.5 pr-3.5 text-sm font-semibold text-forest-900">
              <span className="grid size-7 place-items-center rounded-full bg-forest-800 text-xs text-white">{ui.user[0]}</span>
              {ui.user}
            </span>
          ) : (
            <button onClick={ui.openSignIn} className="rounded-full bg-forest-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-forest-900/20 transition hover:bg-forest-900">
              Sign In
            </button>
          )}
        </div>
        <button
          className="ml-auto rounded-lg p-2 text-forest-950 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="practo-mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <div id="practo-mobile-nav" className="animate-fade-up border-t border-forest-900/5 bg-cream px-4 pb-5 pt-2 lg:hidden">
          <nav aria-label="Mobile">{NAV.map((c) => link(c, true))}</nav>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={() => { setOpen(false); ui.openBusiness() }} className="rounded-xl border border-forest-800/20 py-3 text-sm font-semibold text-forest-800">
              List Your Business
            </button>
            <button
              onClick={() => { setOpen(false); if (!ui.user) ui.openSignIn() }}
              className="flex items-center justify-center gap-2 rounded-xl bg-forest-800 py-3 text-sm font-semibold text-white"
            >
              <UserRound className="size-4" /> {ui.user ?? 'Sign In'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

function Footer({ ui }: { ui: PractoUI }) {
  const linkCls = 'text-left text-sm text-white/65 transition hover:text-white'
  return (
    <footer className="bg-forest-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Helping pet owners and animal rescuers find trusted care: clinics, hospitals, diagnostics, boarding and shelters.
          </p>
          <p className="mt-6 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
            Prototype · All providers are sample data
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-mint-300">Company</h3>
          <ul className="mt-4 space-y-2.5">
            <li><button className={linkCls} onClick={() => ui.openInfo('about')}>About</button></li>
            <li><button className={linkCls} onClick={() => ui.openInfo('contact')}>Contact</button></li>
            <li><button className={linkCls} onClick={() => ui.openInfo('privacy')}>Privacy policy</button></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-mint-300">For providers</h3>
          <ul className="mt-4 space-y-2.5">
            <li><button className={linkCls} onClick={ui.openBusiness}>List Your Business</button></li>
            <li><button className={linkCls} onClick={() => ui.openCorrection()}>Submit a Correction</button></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-mint-300">Discover</h3>
          <ul className="mt-4 space-y-2.5">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.id}><Link className={linkCls} to={`/practo/search?category=${c.id}`}>{c.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/40 sm:flex-row sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} Practo for Animals · Assignment prototype</span>
          <span>In an emergency, call your nearest 24×7 animal hospital first.</span>
        </div>
      </div>
    </footer>
  )
}

export function PractoLayout() {
  const [dialog, setDialog] = useState<Dialog>(null)
  const [user, setUser] = useState<string | null>(null)
  const close = () => setDialog(null)

  const ui: PractoUI = {
    openProvider: (id) => setDialog({ kind: 'provider', id }),
    openBusiness: () => setDialog({ kind: 'business' }),
    openCorrection: (providerId) => setDialog({ kind: 'correction', providerId }),
    openSignIn: () => setDialog({ kind: 'signin' }),
    openInfo: (topic) => setDialog({ kind: 'info', topic }),
    user,
  }

  const provider = dialog?.kind === 'provider' ? providerById(dialog.id) : undefined

  return (
    <Ctx.Provider value={ui}>
      <div className="min-h-screen bg-cream font-jakarta text-forest-950">
        <Header ui={ui} />
        <Outlet />
        <Footer ui={ui} />
      </div>

      {provider && <ProviderModal key={provider.id} provider={provider} onClose={close} />}
      <FormModal open={dialog?.kind === 'business'} onClose={close} title="List your business" description="Get discovered by pet owners and rescuers near you. Listing is free.">
        <BusinessForm onDone={close} />
      </FormModal>
      <FormModal open={dialog?.kind === 'correction'} onClose={close} title="Submit a correction" description="Help keep listings accurate. Our team reviews every suggestion.">
        <CorrectionForm onDone={close} providerId={dialog?.kind === 'correction' ? dialog.providerId : undefined} />
      </FormModal>
      <FormModal open={dialog?.kind === 'signin'} onClose={close} title="Sign in" description="Save providers and track your bookings." size="sm">
        <SignInForm onDone={(name) => { setUser(name); close() }} />
      </FormModal>
      {dialog?.kind === 'info' && <InfoDialog topic={dialog.topic} onClose={close} />}
    </Ctx.Provider>
  )
}

function FormModal(props: { open: boolean; onClose: () => void; title: string; description: string; size?: 'sm' | 'md'; children: ReactNode }) {
  return (
    <Modal open={props.open} onClose={props.onClose} title={props.title} description={props.description} size={props.size ?? 'md'} className="font-jakarta">
      {props.children}
    </Modal>
  )
}
