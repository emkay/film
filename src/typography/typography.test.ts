import { fixture, html, expect } from '@open-wc/testing'
import './divider.js'
import './kbd.js'
import './visually-hidden.js'
import './text.js'
import '../actions/link.js'
import '../feedback/skeleton.js'
import '../feedback/spinner.js'
import '../feedback/badge.js'

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

describe('film-divider', () => {
  it('is a separator with an orientation', async () => {
    const el = await fixture<HTMLElement>(html`<film-divider vertical></film-divider>`)
    const hr = el.shadowRoot?.querySelector('hr') as HTMLElement
    expect(hr.getAttribute('role')).to.equal('separator')
    expect(hr.getAttribute('aria-orientation')).to.equal('vertical')
  })
})

describe('film-kbd', () => {
  it('wraps its content in <kbd>', async () => {
    const el = await fixture<HTMLElement>(html`<film-kbd>⌘K</film-kbd>`)
    expect(el.shadowRoot?.querySelector('kbd')).to.exist
  })
})

describe('film-visually-hidden', () => {
  it('is hidden visually but not from assistive tech', async () => {
    const el = await fixture<HTMLElement>(html`<film-visually-hidden>Close</film-visually-hidden>`)
    const style = getComputedStyle(el)
    expect(el.getBoundingClientRect().width).to.be.at.most(1)
    expect(style.display).to.not.equal('none')
    expect(style.visibility).to.not.equal('hidden')
    expect(el.getAttribute('aria-hidden')).to.equal(null)
  })
})

describe('film-text', () => {
  it('sizes itself from a scale step and mutes its tone', async () => {
    const el = await fixture<HTMLElement>(html`<film-text size="s1" tone="muted">x</film-text>`)
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    expect(parseFloat(getComputedStyle(el).fontSize)).to.be.closeTo(rem * 1.5, 0.01)
  })
})

describe('film-link', () => {
  it('links to its href', async () => {
    const el = await fixture<HTMLElement>(html`<film-link href="/docs">Docs</film-link>`)
    expect(el.shadowRoot?.querySelector('a')?.getAttribute('href')).to.equal('/docs')
  })

  it('does not link to the current page when it has no href', async () => {
    const el = await fixture<HTMLElement>(html`<film-link>Docs</film-link>`)
    expect(el.shadowRoot?.querySelector('a')?.hasAttribute('href')).to.equal(false)
  })
})

describe('film-skeleton', () => {
  it('is hidden from assistive tech and takes its dimensions', async () => {
    const el = await fixture<HTMLElement>(html`<film-skeleton width="120px" height="12px"></film-skeleton>`)
    expect(el.getAttribute('aria-hidden')).to.equal('true')
    const bar = el.shadowRoot?.querySelector('.bar') as HTMLElement
    expect(bar.getBoundingClientRect().width).to.be.closeTo(120, 1)
  })
})

describe('film-spinner', () => {
  it('is a labelled status', async () => {
    const el = await fixture<HTMLElement>(html`<film-spinner label="Saving"></film-spinner>`)
    expect(el.getAttribute('role')).to.equal('status')
    expect(el.getAttribute('aria-label')).to.equal('Saving')
  })
})

describe('film-badge', () => {
  it('takes a status colour for non-neutral variants', async () => {
    const neutral = await fixture<HTMLElement>(html`<film-badge>1</film-badge>`)
    const danger = await fixture<HTMLElement>(html`<film-badge variant="danger">1</film-badge>`)
    expect(getComputedStyle(danger).backgroundColor).to.not.equal(getComputedStyle(neutral).backgroundColor)
  })
})
