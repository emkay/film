import { fixture, html, expect } from '@open-wc/testing'
import './card.js'
import './avatar.js'
import './code.js'
import './list.js'
import './list-item.js'

describe('film-card', () => {
  it('hides the media and footer regions until they have content', async () => {
    const el = await fixture<HTMLElement>(html`<film-card>Body</film-card>`)
    expect((el.shadowRoot?.querySelector('.media') as HTMLElement).hidden).to.equal(true)
    expect((el.shadowRoot?.querySelector('.footer') as HTMLElement).hidden).to.equal(true)
  })

  it('shows them once slotted', async () => {
    const el = await fixture<HTMLElement & { updateComplete: Promise<boolean> }>(
      html`<film-card><img slot="media" alt="" />Body<button slot="footer">Go</button></film-card>`
    )
    await el.updateComplete
    expect((el.shadowRoot?.querySelector('.media') as HTMLElement).hidden).to.equal(false)
    expect((el.shadowRoot?.querySelector('.footer') as HTMLElement).hidden).to.equal(false)
  })
})

describe('film-avatar', () => {
  it('shows an image named by its label', async () => {
    const el = await fixture<HTMLElement>(html`<film-avatar src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" label="Ada Lovelace"></film-avatar>`)
    expect(el.shadowRoot?.querySelector('img')?.getAttribute('alt')).to.equal('Ada Lovelace')
  })

  it('falls back to initials without an image', async () => {
    const el = await fixture<HTMLElement>(html`<film-avatar label="Ada Lovelace"></film-avatar>`)
    expect(el.shadowRoot?.querySelector('span')?.textContent).to.equal('AL')
  })

  it('names the initials fallback by the full label, as the image is', async () => {
    const el = await fixture<HTMLElement>(html`<film-avatar label="Ada Lovelace"></film-avatar>`)
    const fallback = el.shadowRoot?.querySelector('span') as HTMLElement
    expect(fallback.getAttribute('role')).to.equal('img')
    expect(fallback.getAttribute('aria-label')).to.equal('Ada Lovelace')
  })

  it('hides an unlabelled fallback from assistive tech', async () => {
    const el = await fixture<HTMLElement>(html`<film-avatar></film-avatar>`)
    expect(el.shadowRoot?.querySelector('span')?.getAttribute('aria-hidden')).to.equal('true')
  })

  it('falls back to initials when the image fails to load', async () => {
    const el = await fixture<HTMLElement & { updateComplete: Promise<boolean> }>(html`<film-avatar src="/does-not-exist.png" label="Ada Lovelace"></film-avatar>`)
    const img = el.shadowRoot?.querySelector('img') as HTMLImageElement
    await new Promise((resolve) => img.addEventListener('error', resolve, { once: true }))
    await el.updateComplete
    expect(el.shadowRoot?.querySelector('span')?.textContent).to.equal('AL')
  })
})

describe('film-code', () => {
  it('shows the code with a copy button for it', async () => {
    const el = await fixture<HTMLElement>(html`<film-code code="npm i @mk/film"></film-code>`)
    expect(el.shadowRoot?.querySelector('code')?.textContent).to.equal('npm i @mk/film')
    expect((el.shadowRoot?.querySelector('film-copy-button') as HTMLElement & { value: string }).value).to.equal('npm i @mk/film')
  })
})

describe('film-list', () => {
  it('uses list roles', async () => {
    const el = await fixture<HTMLElement>(html`<film-list><film-list-item>One</film-list-item></film-list>`)
    expect(el.getAttribute('role')).to.equal('list')
    expect(el.querySelector('film-list-item')?.getAttribute('role')).to.equal('listitem')
  })

  it('renders a linked item as a link', async () => {
    const el = await fixture<HTMLElement>(html`<film-list-item href="/a">A</film-list-item>`)
    expect(el.shadowRoot?.querySelector('a')?.getAttribute('href')).to.equal('/a')
    const plain = await fixture<HTMLElement>(html`<film-list-item>B</film-list-item>`)
    expect(plain.shadowRoot?.querySelector('a')).to.equal(null)
  })
})
