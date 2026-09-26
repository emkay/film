import { expect } from '@open-wc/testing'

// Every palette, in light and dark, must meet WCAG AA for the colour pairs the
// components actually draw text and focus rings with. The browser resolves the
// tokens (light-dark(), color-mix(), oklch) and a canvas turns each into the
// exact sRGB pixel, so the ratios are what a user sees.

const PALETTES = ['paper', 'classic', 'kodachrome', 'polaroid', 'ektachrome', 'velvia'] as const
const SCHEMES = ['light', 'dark'] as const

/** [foreground token, background token, minimum ratio, what uses it] */
export const PAIRS: Array<[string, string, number, string]> = [
  ['text', 'surface', 4.5, 'body text'],
  ['text', 'background', 4.5, 'body text on the page'],
  ['text-muted', 'surface', 4.5, 'hints, placeholders, step labels'],
  ['text-muted', 'background', 4.5, 'muted text on the page'],
  ['link', 'surface', 4.5, 'links'],
  ['link', 'background', 4.5, 'links on the page'],
  ['primary-text', 'primary', 4.5, 'primary buttons'],
  ['primary-text', 'primary-hover', 4.5, 'primary buttons, hovered or focused'],
  ['primary-text', 'primary-active', 4.5, 'primary buttons, pressed'],
  ['inverted-text', 'inverted-surface', 4.5, 'neutral buttons, badges, tooltips'],
  ['text', 'info', 4.5, 'info alerts, toasts, badges'],
  ['text', 'success', 4.5, 'success alerts, toasts, badges'],
  ['text', 'warning', 4.5, 'warning alerts, toasts, badges'],
  ['text', 'danger', 4.5, 'danger alerts, toasts, badges'],
  ['control-border', 'surface', 3, 'outlines of inputs, selects, checkboxes, switches'],
  ['control-border', 'background', 3, 'control outlines on the page'],
  ['focus', 'surface', 3, 'focus rings'],
  ['focus', 'background', 3, 'focus rings on the page']
]

async function loadCss (): Promise<void> {
  await Promise.all(['/css/base.css', '/css/themes/default/index.css'].map((href) => {
    if (document.querySelector(`link[href="${href}"]`)) return undefined
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href })
    document.head.append(link)
    return new Promise((resolve) => { link.onload = resolve })
  }))
}

const probe = document.createElement('span')
const canvas = Object.assign(document.createElement('canvas'), { width: 1, height: 1 })
const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D

function rgb (token: string): [number, number, number] {
  // A detached element has no computed colour, so every token would read alike.
  if (!probe.isConnected) document.body.append(probe)
  // An undefined token makes the probe inherit its parent's colour and read as
  // some other colour entirely — so a missing token must fail, not pass.
  if (!getComputedStyle(document.documentElement).getPropertyValue(`--film-color-${token}`).trim()) {
    throw new Error(`--film-color-${token} is not defined`)
  }
  probe.style.color = `var(--film-color-${token})`
  const resolved = getComputedStyle(probe).color
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = '#fff' // tokens are opaque; white shows up if one isn't
  ctx.fillRect(0, 0, 1, 1)
  ctx.fillStyle = resolved
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r, g, b]
}

function luminance ([r, g, b]: [number, number, number]): number {
  const lin = (c: number): number => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function contrast (fg: string, bg: string): number {
  const [a, b] = [luminance(rgb(fg)), luminance(rgb(bg))].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}

describe('palette contrast (WCAG AA)', () => {
  before(loadCss)
  after(() => {
    delete document.documentElement.dataset.filmTheme
    delete document.documentElement.dataset.theme
  })

  for (const palette of PALETTES) {
    for (const scheme of SCHEMES) {
      it(`${palette} / ${scheme}`, () => {
        document.documentElement.dataset.filmTheme = palette
        document.documentElement.dataset.theme = scheme
        const failures = PAIRS
          .map(([fg, bg, min, use]) => ({ fg, bg, min, use, ratio: contrast(fg, bg) }))
          .filter(({ ratio, min }) => ratio < min)
          .map(({ fg, bg, min, use, ratio }) => `${fg} on ${bg}: ${ratio.toFixed(2)} (needs ${min}) — ${use}`)
        expect(failures, failures.join('\n')).to.deep.equal([])
      })
    }
  }
})
