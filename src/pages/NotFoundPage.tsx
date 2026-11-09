import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="grid min-h-[80vh] place-items-center bg-zinc-50 px-6 text-center">
      <div>
        <p className="text-sm font-semibold text-zinc-400">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page doesn’t exist</h1>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white">
          Back to overview
        </Link>
      </div>
    </main>
  )
}
