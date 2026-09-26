import { fixture, html, expect } from '@open-wc/testing'
import './switcher.js'
import type { Switcher } from './switcher.js'

// Over the limit the host becomes a column.
const stacked = (el: Switcher): boolean => getComputedStyle(el).flexDirection === 'column'

describe('film-switcher', () => {
  it('stacks once there are more children than `limit`', async () => {
    const el = await fixture<Switcher>(html`<film-switcher limit="2"><div>1</div><div>2</div><div>3</div></film-switcher>`)
    expect(stacked(el)).to.equal(true)
  })

  it('stays in a row at or under the limit', async () => {
    const el = await fixture<Switcher>(html`<film-switcher limit="3"><div>1</div><div>2</div><div>3</div></film-switcher>`)
    expect(stacked(el)).to.equal(false)
  })

  it('re-checks when children change', async () => {
    const el = await fixture<Switcher>(html`<film-switcher limit="2"><div>1</div><div>2</div></film-switcher>`)
    el.append(Object.assign(document.createElement('div'), { textContent: '3' }))
    await new Promise((resolve) => setTimeout(resolve))
    expect(stacked(el)).to.equal(true)
  })

  it('keeps the stacked state when the consumer sets its class', async () => {
    // As a React className or a Lit class binding does on every render.
    const el = await fixture<Switcher>(html`<film-switcher limit="2"><div>1</div><div>2</div><div>3</div></film-switcher>`)
    el.className = 'toolbar'
    expect(stacked(el)).to.equal(true)
  })
})
