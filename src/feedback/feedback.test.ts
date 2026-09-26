import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './alert.js'
import './tag.js'
import './progress-bar.js'
import type { Alert } from './alert.js'
import type { Tag } from './tag.js'
import type { ProgressBar } from './progress-bar.js'

describe('film-alert', () => {
  it('derives its role from the variant', async () => {
    const info = await fixture<Alert>(html`<film-alert>i</film-alert>`)
    const warning = await fixture<Alert>(html`<film-alert variant="warning">w</film-alert>`)
    expect(info.getAttribute('role')).to.equal('status')
    expect(warning.getAttribute('role')).to.equal('alert')
    warning.variant = 'success'
    await warning.updateComplete
    expect(warning.getAttribute('role')).to.equal('status')
  })

  it('keeps a role the consumer set', async () => {
    const el = await fixture<Alert>(html`<film-alert role="note" variant="danger">n</film-alert>`)
    expect(el.getAttribute('role')).to.equal('note')
  })
})

describe('film-tag', () => {
  it('has no remove button unless removable', async () => {
    const el = await fixture<Tag>(html`<film-tag>css</film-tag>`)
    expect(el.shadowRoot?.querySelector('.remove')).to.equal(null)
  })

  it('fires film-remove from its remove button', async () => {
    const el = await fixture<Tag>(html`<film-tag removable>css</film-tag>`)
    const remove = el.shadowRoot?.querySelector('.remove') as HTMLButtonElement
    expect(remove.getAttribute('aria-label')).to.equal('Remove')
    setTimeout(() => remove.click())
    await oneEvent(el, 'film-remove')
  })
})

describe('film-progress-bar', () => {
  const fill = (el: ProgressBar): HTMLElement => el.shadowRoot?.querySelector('.fill') as HTMLElement

  it('exposes its value to assistive tech', async () => {
    const el = await fixture<ProgressBar>(html`<film-progress-bar value="30" max="60" label="Upload"></film-progress-bar>`)
    expect(el.getAttribute('role')).to.equal('progressbar')
    expect(el.getAttribute('aria-valuenow')).to.equal('30')
    expect(el.getAttribute('aria-valuemax')).to.equal('60')
    expect(el.getAttribute('aria-label')).to.equal('Upload')
    expect(fill(el).style.inlineSize).to.equal('50%')
  })

  it('clamps the value to the range', async () => {
    const el = await fixture<ProgressBar>(html`<film-progress-bar value="150"></film-progress-bar>`)
    expect(el.getAttribute('aria-valuenow')).to.equal('100')
    expect(fill(el).style.inlineSize).to.equal('100%')
  })

  it('drops aria-valuenow when indeterminate', async () => {
    const el = await fixture<ProgressBar>(html`<film-progress-bar value="30" indeterminate></film-progress-bar>`)
    expect(el.hasAttribute('aria-valuenow')).to.equal(false)
  })

  it('removes its accessible name when the label is cleared', async () => {
    const el = await fixture<ProgressBar>(html`<film-progress-bar label="Upload"></film-progress-bar>`)
    el.label = ''
    await el.updateComplete
    expect(el.hasAttribute('aria-label')).to.equal(false)
  })

  it('renders a zero max as empty rather than NaN', async () => {
    const el = await fixture<ProgressBar>(html`<film-progress-bar value="0" max="0"></film-progress-bar>`)
    expect(fill(el).style.inlineSize).to.equal('0%')
  })
})
