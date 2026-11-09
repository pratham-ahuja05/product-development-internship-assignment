import type { SVGProps } from 'react'

/** Minimal platform glyphs (lucide no longer ships brand logos). */
export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" />
      <path d="M7.5 10.5v6M7.5 7.5v.01M11.5 16.5v-6M11.5 13.2c0-1.6 1-2.7 2.5-2.7s2.5 1 2.5 2.7v3.3" />
    </svg>
  )
}
