import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './tree-item.js'
import type { TreeItem } from './tree-item.js'

describe('film-tree-item (lazy)', () => {
  it('shows a disclosure arrow when has-children is set without children', async () => {
    const el = await fixture<TreeItem>(html`<film-tree-item has-children><span slot="label">x</span></film-tree-item>`)
    const twist = el.shadowRoot?.querySelector('.twist')
    expect(twist?.hasAttribute('hidden')).to.equal(false)
  })

  it('fires film-tree-expand when an unloaded node expands', async () => {
    const el = await fixture<TreeItem>(html`<film-tree-item has-children><span slot="label">x</span></film-tree-item>`)
    setTimeout(() => {
      el.expanded = true
    })
    const event = await oneEvent(el, 'film-tree-expand')
    expect(event.detail.item).to.equal(el)
  })

  it('shows an error message when set', async () => {
    const el = await fixture<TreeItem>(
      html`<film-tree-item has-children expanded error-message="Cannot read"><span slot="label">x</span></film-tree-item>`
    )
    await el.updateComplete
    expect(el.shadowRoot?.querySelector('.error')?.textContent).to.contain('Cannot read')
  })

  it('clears hasChildren when a non-lazy node loses its children', async () => {
    const el = await fixture<TreeItem>(html`
      <film-tree-item>
        <span slot="label">parent</span>
        <film-tree-item><span slot="label">child</span></film-tree-item>
      </film-tree-item>
    `)
    await el.updateComplete
    expect(el.hasChildren).to.equal(true)

    el.querySelector('film-tree-item')!.remove()
    await el.updateComplete
    expect(el.hasChildren).to.equal(false)
  })
})
