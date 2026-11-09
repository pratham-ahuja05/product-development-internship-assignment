/**
 * Real export (not mocked): DOM → PNG via html-to-image, PNGs → multi-page PDF via jsPDF.
 */
import { toJpeg, toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'carousel'

async function render(node: HTMLElement, w: number, h: number, as: 'png' | 'jpeg') {
  await document.fonts.ready
  const opts = { width: w, height: h, pixelRatio: 1, cacheBust: true }
  try {
    return as === 'png' ? await toPng(node, opts) : await toJpeg(node, { ...opts, quality: 0.95 })
  } catch {
    // If web-font embedding fails (e.g. offline), fall back to system fonts rather than failing the export.
    return as === 'png' ? toPng(node, { ...opts, skipFonts: true }) : toJpeg(node, { ...opts, quality: 0.95, skipFonts: true })
  }
}

function download(href: string, filename: string) {
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export async function exportSlidePNG(node: HTMLElement, w: number, h: number, title: string, index: number) {
  download(await render(node, w, h, 'png'), `${slug(title)}-slide-${String(index + 1).padStart(2, '0')}.png`)
}

export async function exportAllPNG(nodes: HTMLElement[], w: number, h: number, title: string, onProgress?: (i: number) => void) {
  for (let i = 0; i < nodes.length; i++) {
    onProgress?.(i)
    await exportSlidePNG(nodes[i], w, h, title, i)
    await new Promise((r) => setTimeout(r, 250)) // let the browser process each download
  }
}

export async function exportPDF(nodes: HTMLElement[], w: number, h: number, title: string, onProgress?: (i: number) => void) {
  const pdf = new jsPDF({ orientation: w > h ? 'landscape' : 'portrait', unit: 'px', format: [w, h], hotfixes: ['px_scaling'], compress: true })
  for (let i = 0; i < nodes.length; i++) {
    onProgress?.(i)
    const img = await render(nodes[i], w, h, 'jpeg')
    if (i > 0) pdf.addPage([w, h], w > h ? 'landscape' : 'portrait')
    pdf.addImage(img, 'JPEG', 0, 0, w, h)
  }
  pdf.setProperties({ title })
  pdf.save(`${slug(title)}.pdf`)
}
