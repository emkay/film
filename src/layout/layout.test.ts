import { fixture, html, expect } from '@open-wc/testing'
import './box.js'
import './center.js'
import './cover.js'
import './frame.js'
import './grid.js'
import './icon.js'
import './imposter.js'
import './reel.js'

// These check real styling, so load Film's stylesheets as an app would: the
// modular scale lives in css/base.css and the colour tokens in the theme.
async function loadFilmCss (): Promise<void> {
  const sheets = ['/css/base.css', '/css/themes/default/index.css']
  await Promise.all(sheets.map((href) => {
    if (document.querySelector(`link[href="${href}"]`)) return undefined
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href })
    document.head.append(link)
    return new Promise((resolve, reject) => {
      link.onload = resolve
      link.onerror = () => reject(new Error(`could not load ${href}`))
    })
  }))
}
before(loadFilmCss)

// Every size is a step on the modular scale: 1rem × 1.5^n. Read the root size
// once the stylesheet has set it (it's fluid, so it isn't a fixed 16px).
const step = (n: number): number => {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
  return rem * 1.5 ** n
}
const px = (value: string): number => parseFloat(value)

describe('layout primitives', () => {
  it('film-grid lays out a responsive grid with a scale-step gap', async () => {
    const el = await fixture<HTMLElement>(html`<film-grid space="s0" min="10rem"><div></div><div></div></film-grid>`)
    const style = getComputedStyle(el)
    expect(style.display).to.equal('grid')
    expect(px(style.columnGap)).to.be.closeTo(step(0), 0.01)
  })

  it('film-cover fills a minimum height and pads by `space`', async () => {
    const el = await fixture<HTMLElement>(html`<film-cover min-height="200px" space="s-1"><p>x</p></film-cover>`)
    const style = getComputedStyle(el)
    expect(style.minHeight).to.equal('200px')
    expect(px(style.paddingTop)).to.be.closeTo(step(-1), 0.01)
  })

  it('film-frame takes a W:H ratio', async () => {
    const el = await fixture<HTMLElement>(html`<film-frame ratio="4:3" style="inline-size: 400px"></film-frame>`)
    expect(el.getBoundingClientRect().height).to.be.closeTo(300, 1)
  })

  it('film-frame also takes a CSS ratio', async () => {
    const el = await fixture<HTMLElement>(html`<film-frame ratio="1 / 2" style="inline-size: 100px"></film-frame>`)
    expect(el.getBoundingClientRect().height).to.be.closeTo(200, 1)
  })

  it('film-reel scrolls horizontally with fixed-width items', async () => {
    const el = await fixture<HTMLElement>(html`<film-reel item-width="150px"><div></div><div></div></film-reel>`)
    expect(getComputedStyle(el).overflowX).to.equal('auto')
    expect((el.querySelector('div') as HTMLElement).getBoundingClientRect().width).to.be.closeTo(150, 1)
  })

  it('film-center caps its width at the measure and centres', async () => {
    const el = await fixture<HTMLElement>(html`<film-center></film-center>`)
    const style = getComputedStyle(el)
    expect(style.marginLeft).to.equal(style.marginRight)
    expect(style.boxSizing).to.equal('content-box')
  })

  it('film-imposter centres over its container and can be contained', async () => {
    const el = await fixture<HTMLElement>(html`<film-imposter contain margin="10px"></film-imposter>`)
    const style = getComputedStyle(el)
    expect(style.position).to.equal('absolute')
    expect(el.style.getPropertyValue('--imposter-margin')).to.equal('10px')
    expect(style.overflow).to.equal('auto')
  })

  it('film-icon shows an optional label beside the icon', async () => {
    const el = await fixture<HTMLElement>(html`<film-icon label="Close" space="s-2"><svg></svg></film-icon>`)
    expect(el.shadowRoot?.querySelector('span')?.textContent).to.equal('Close')
    expect(px(getComputedStyle(el).columnGap)).to.be.closeTo(step(-2), 0.01)
  })

  it('film-box inverts its colours', async () => {
    const plain = await fixture<HTMLElement>(html`<film-box>x</film-box>`)
    const inverted = await fixture<HTMLElement>(html`<film-box invert>x</film-box>`)
    const surface = (el: HTMLElement): string => getComputedStyle(el.shadowRoot?.querySelector('div') as HTMLElement).backgroundColor
    expect(surface(inverted)).to.not.equal(surface(plain))
  })
})
