import { fixture, html, expect } from '@open-wc/testing'
import './cluster.js'
import type { Cluster } from './cluster.js'

describe('film-cluster', () => {
  it('defaults to start / center alignment', async () => {
    const el = await fixture<Cluster>(html`<film-cluster><span>a</span></film-cluster>`)
    expect(el.justify).to.equal('start')
    expect(el.align).to.equal('center')
    expect(getComputedStyle(el).justifyContent).to.equal('start')
  })

  it('applies justify and align to the host', async () => {
    const el = await fixture<Cluster>(
      html`<film-cluster justify="space-between" align="baseline"><span>a</span></film-cluster>`
    )
    const styles = getComputedStyle(el)
    expect(styles.justifyContent).to.equal('space-between')
    expect(styles.alignItems).to.equal('baseline')
  })

  it('resolves a bare scale step for space', async () => {
    const el = await fixture<Cluster>(html`<film-cluster space="s2"><span>a</span></film-cluster>`)
    expect(el.style.getPropertyValue('--cluster-space')).to.equal('var(--s2)')
  })

  it('passes a plain length through untouched', async () => {
    const el = await fixture<Cluster>(html`<film-cluster space="3px"><span>a</span></film-cluster>`)
    expect(el.style.getPropertyValue('--cluster-space')).to.equal('3px')
    expect(getComputedStyle(el).columnGap).to.equal('3px')
  })
})
