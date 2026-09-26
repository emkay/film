import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './copy-button.js'
import type { CopyButton } from './copy-button.js'

let written: string[] = []
let fail = false
const original = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(navigator.clipboard), 'writeText')
beforeEach(() => {
  written = []
  fail = false
  Object.defineProperty(navigator.clipboard, 'writeText', {
    configurable: true,
    value: async (text: string) => {
      if (fail) throw new Error('denied')
      written.push(text)
    }
  })
})
afterEach(() => {
  delete (navigator.clipboard as unknown as Record<string, unknown>).writeText
  if (original) Object.defineProperty(Object.getPrototypeOf(navigator.clipboard), 'writeText', original)
})

const button = (el: CopyButton): HTMLButtonElement => el.shadowRoot?.querySelector('button') as HTMLButtonElement

describe('film-copy-button', () => {
  it('copies its value, confirms, and fires film-copy', async () => {
    const el = await fixture<CopyButton>(html`<film-copy-button value="npm i @mk/film"></film-copy-button>`)
    setTimeout(() => button(el).click())
    const event = await oneEvent(el, 'film-copy')
    await el.updateComplete
    expect(written).to.deep.equal(['npm i @mk/film'])
    expect(event.detail.value).to.equal('npm i @mk/film')
    expect(button(el).textContent?.trim()).to.equal('Copied')
  })

  it('fires film-error when the clipboard refuses', async () => {
    fail = true
    const el = await fixture<CopyButton>(html`<film-copy-button value="x"></film-copy-button>`)
    setTimeout(() => button(el).click())
    await oneEvent(el, 'film-error')
    await el.updateComplete
    expect(button(el).textContent?.trim()).to.equal('Copy')
  })

  it('uses custom labels', async () => {
    const el = await fixture<CopyButton>(html`<film-copy-button value="x" label="Copy link" copied-label="Link copied"></film-copy-button>`)
    expect(button(el).textContent?.trim()).to.equal('Copy link')
    setTimeout(() => button(el).click())
    await oneEvent(el, 'film-copy')
    await el.updateComplete
    expect(button(el).textContent?.trim()).to.equal('Link copied')
  })
})
