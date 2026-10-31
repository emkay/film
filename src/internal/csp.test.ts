import { fixture, html, expect } from '@open-wc/testing'
import '../index.js'

// Film must work under a strict Content-Security-Policy, with no 'unsafe-inline'
// for styles: otherwise every app using it has to weaken its own policy. That
// rules out inline style attributes and <style> elements; styles set through
// the CSSOM (element.style, constructed stylesheets) are unaffected. This file
// installs the policy for its own page only.
const policy = Object.assign(document.createElement('meta'), {
  httpEquiv: 'Content-Security-Policy',
  content: "style-src 'self' http://localhost:*"
})
document.head.prepend(policy)

const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 60))
const width = (el: Element): number => el.getBoundingClientRect().width

describe('strict CSP (style-src without unsafe-inline)', () => {
  it('blocks style attributes set at runtime here, so the test means something', async () => {
    // Set at runtime, as a binding does. (A style attribute written statically
    // in a template survives: cloning copies it without a policy check.)
    const el = await fixture<HTMLElement>(html`<div></div>`)
    el.setAttribute('style', 'inline-size: 37px')
    expect(width(el)).to.not.equal(37)
  })

  it('film-progress-bar fills to its value', async () => {
    const el = await fixture<HTMLElement>(html`<film-progress-bar value="40"></film-progress-bar>`)
    await settle()
    const track = el.shadowRoot?.querySelector('.track') as Element
    const fill = el.shadowRoot?.querySelector('.fill') as Element
    expect(width(fill) / width(track)).to.be.closeTo(0.4, 0.02)
  })

  it('film-slider draws the selected range', async () => {
    const el = await fixture<HTMLElement>(html`<film-slider value-min="20" value-max="60"></film-slider>`)
    await settle()
    const slider = el.shadowRoot?.querySelector('.slider') as Element
    const fill = el.shadowRoot?.querySelector('.fill') as Element
    expect(width(fill) / width(slider)).to.be.closeTo(0.4, 0.02)
  })

  it('film-stack pushes items after split-after to the end', async () => {
    const box = await fixture<HTMLElement>(html`<film-box></film-box>`)
    const stack = document.createElement('film-stack') as HTMLElement & { splitAfter: number, updateComplete: Promise<boolean> }
    stack.splitAfter = 1
    stack.append(document.createElement('p'), document.createElement('p'))
    for (const p of Array.from(stack.children) as HTMLElement[]) { p.textContent = 'x' }
    box.append(stack)
    stack.style.blockSize = '300px' // CSSOM, so the policy allows it
    await stack.updateComplete
    await settle()
    const [first, second] = Array.from(stack.children)
    const gap = second.getBoundingClientRect().top - first.getBoundingClientRect().bottom
    expect(gap, 'the second item sits at the bottom').to.be.greaterThan(150)
  })

  it('film-table keeps its scroll height when virtualised', async () => {
    const rows = Array.from({ length: 500 }, (_, i) => ({ n: i }))
    const el = await fixture<HTMLElement & { updateComplete: Promise<boolean> }>(html`<film-table
      virtualized row-height="30" .columns=${[{ key: 'n', label: 'N' }]} .rows=${rows}></film-table>`)
    el.style.blockSize = '300px'
    el.style.display = 'block'
    await el.updateComplete
    await settle()
    expect(el.scrollHeight, 'all 500 rows are scrollable').to.be.greaterThan(500 * 30 * 0.9)
  })
})
