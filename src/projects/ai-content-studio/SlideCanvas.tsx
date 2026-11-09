import { forwardRef, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import { THEMES } from './themes'
import { ASPECTS, type AspectId, type BrandSettings, type Slide, type ThemeId } from './types'

const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

function fit(len: number, steps: [number, number][], fallback: number) {
  for (const [max, size] of steps) if (len <= max) return size
  return fallback
}

interface SlideCanvasProps {
  slide: Slide
  index: number
  total: number
  themeId: ThemeId
  aspect: AspectId
  brand: BrandSettings
}

/**
 * Renders one slide at its true export size (1080px wide). Everything is inline-styled
 * so html-to-image produces a pixel-exact PNG/PDF of what the user sees.
 */
export const SlideCanvas = forwardRef<HTMLDivElement, SlideCanvasProps>(function SlideCanvas(
  { slide, index, total, themeId, aspect, brand },
  ref,
) {
  const t = THEMES[themeId]
  const { w, h } = ASPECTS[aspect]
  const k = aspect === 'square' ? 0.86 : 1
  const hero = slide.kind !== 'content'
  const bg = hero ? t.coverBg : t.bg
  const fg = hero ? t.coverText : t.text
  const muted = hero ? alpha(t.coverText, 0.72) : t.muted
  const onAccentBg = hero && t.coverBg.toLowerCase() === t.accent.toLowerCase()
  const accent = onAccentBg ? t.coverText : t.accent
  const pad = 88
  const contentIndex = index // cover is 0, so content slides read 01, 02…
  const isBold = t.layout === 'bold'
  const isEditorial = t.layout === 'editorial'
  const isMinimal = t.layout === 'minimal'

  const titleSize =
    (slide.kind === 'cover'
      ? fit(slide.title.length, [[36, 118], [52, 104], [70, 90], [95, 78]], 66)
      : slide.kind === 'cta'
        ? fit(slide.title.length, [[40, 96], [70, 82], [100, 70]], 60)
        : fit(slide.title.length, [[26, 84], [40, 74], [60, 64]], 56)) * k
  const bodySize = fit(slide.body.length, [[120, 40], [200, 36], [260, 33]], 30) * k

  const root: CSSProperties = {
    width: w, height: h, background: bg, color: fg, fontFamily: `'${t.bodyFont}', sans-serif`,
    position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: pad, boxSizing: 'border-box',
  }
  const heading: CSSProperties = {
    fontFamily: `'${t.headingFont}', serif`, fontWeight: t.headingWeight, letterSpacing: isEditorial ? '-0.02em' : '-0.035em',
    lineHeight: 1.04, margin: 0, fontSize: titleSize, textWrap: 'balance' as CSSProperties['textWrap'],
  }

  return (
    <div ref={ref} style={root}>
      {/* ---------- decoration ---------- */}
      {isBold && (
        <>
          <div style={{ position: 'absolute', width: 900, height: 900, right: -380, top: -360, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(hero && onAccentBg ? '#ffffff' : t.accent, hero ? 0.35 : 0.22)}, transparent 65%)` }} />
          <div style={{ position: 'absolute', width: 700, height: 700, left: -320, bottom: -320, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(hero && onAccentBg ? '#000000' : t.accent, 0.14)}, transparent 65%)` }} />
        </>
      )}
      {isEditorial && hero && (
        <>
          <div style={{ position: 'absolute', width: 620, height: 620, right: -200, top: -180, borderRadius: '50%', border: `2px solid ${alpha(t.coverText, 0.14)}` }} />
          <div style={{ position: 'absolute', width: 420, height: 420, right: -100, top: -80, borderRadius: '50%', background: alpha(t.accent, 0.25) }} />
        </>
      )}
      {isMinimal && <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 18, background: t.accent }} />}

      {/* ---------- header ---------- */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 24 * k, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 16, color: accent }}>
          <span style={{ width: 40, height: 4, borderRadius: 4, background: accent }} />
          {slide.eyebrow}
        </span>
        {brand.showNumbers && (
          <span style={{ color: muted, letterSpacing: '0.08em', fontVariantNumeric: 'tabular-nums' }}>
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        )}
      </div>
      {isEditorial && <div style={{ position: 'relative', height: 2, background: alpha(fg, 0.12), marginTop: 36 }} />}

      {/* ---------- body ---------- */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: slide.kind === 'cover' ? 'flex-end' : 'center', paddingTop: 40, paddingBottom: 40 }}>
        {slide.kind === 'content' && (
          <div style={{ marginBottom: 36 * k }}>
            {isBold ? (
              <span style={{ display: 'inline-block', padding: '10px 26px', borderRadius: 999, background: t.accent, color: t.accentText, fontFamily: `'${t.headingFont}'`, fontWeight: 700, fontSize: 34 * k }}>
                {String(contentIndex).padStart(2, '0')}
              </span>
            ) : (
              <span style={{ fontFamily: `'${t.headingFont}', serif`, fontWeight: isMinimal ? 800 : 500, fontSize: (isMinimal ? 120 : 190) * k, lineHeight: 0.9, color: isMinimal ? t.accent : alpha(t.accent, 0.9), letterSpacing: '-0.04em' }}>
                {String(contentIndex).padStart(2, '0')}
              </span>
            )}
          </div>
        )}

        <h2 style={{ ...heading, ...(isMinimal && slide.kind === 'content' ? { borderLeft: `10px solid ${t.accent}`, paddingLeft: 36 } : {}) }}>{slide.title}</h2>

        <p style={{ margin: 0, marginTop: 40 * k, fontSize: bodySize, lineHeight: 1.42, color: muted, maxWidth: slide.kind === 'cover' ? 800 : 880, textWrap: 'pretty' as CSSProperties['textWrap'] }}>
          {slide.body}
        </p>

        {slide.kind === 'content' && slide.example && (
          <div style={{ marginTop: 52 * k, padding: `${34 * k}px ${40 * k}px`, borderRadius: isMinimal ? 12 : 28, background: isBold ? alpha(t.accent, 0.14) : t.surface, borderLeft: isEditorial ? `8px solid ${t.accent}` : undefined, border: isBold ? `2px solid ${alpha(t.accent, 0.35)}` : undefined }}>
            <div style={{ fontSize: 22 * k, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.accent, marginBottom: 12 }}>In practice</div>
            <div style={{ fontSize: 31 * k, lineHeight: 1.38, color: t.text, fontWeight: 500 }}>{slide.example}</div>
          </div>
        )}

        {slide.kind === 'cta' && slide.cta && (
          <div style={{ marginTop: 60 * k }}>
            <span style={{ display: 'inline-block', padding: `${26 * k}px ${44 * k}px`, borderRadius: 999, background: onAccentBg ? t.coverText : t.accent, color: onAccentBg ? t.coverBg : t.accentText, fontSize: 32 * k, fontWeight: 700 }}>
              {slide.cta}
            </span>
          </div>
        )}
      </div>

      {/* ---------- footer ---------- */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 26 * k, color: muted }}>
        {brand.showHandle ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ width: 60, height: 60, borderRadius: '50%', background: onAccentBg ? t.coverText : t.accent, color: onAccentBg ? t.coverBg : t.accentText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 26 }}>
              {(brand.name || 'B').trim()[0]?.toUpperCase()}
            </span>
            <span>
              <span style={{ display: 'block', color: fg, fontWeight: 700, fontSize: 26 * k }}>{brand.name}</span>
              <span style={{ display: 'block', fontSize: 22 * k }}>{brand.handle}</span>
            </span>
          </span>
        ) : <span />}
        {slide.kind === 'cover' ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 14, fontWeight: 700, color: fg }}>
            Swipe <span style={{ fontSize: 40, lineHeight: 1 }}>→</span>
          </span>
        ) : slide.kind === 'content' ? (
          <span style={{ display: 'flex', gap: 10 }}>
            {Array.from({ length: total }, (_, i) => (
              <span key={i} style={{ width: i === index ? 36 : 12, height: 12, borderRadius: 12, background: i === index ? t.accent : alpha(t.text, 0.18) }} />
            ))}
          </span>
        ) : (
          <span style={{ fontWeight: 600 }}>{brand.website}</span>
        )}
      </div>
    </div>
  )
})

/** Scales a full-size slide to fit its container width. */
export function ScaledSlide({ className, ...props }: SlideCanvasProps & { className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const { w, h } = ASPECTS[props.aspect]

  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    setScale(el.clientWidth / w) // measure before first paint, then track resizes
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / w))
    ro.observe(el)
    return () => ro.disconnect()
  }, [w])

  return (
    <div ref={box} className={cn('relative w-full overflow-hidden', className)} style={{ aspectRatio: `${w} / ${h}` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${scale})`, transformOrigin: 'top left', visibility: scale ? 'visible' : 'hidden' }}>
        <SlideCanvas {...props} />
      </div>
    </div>
  )
}
