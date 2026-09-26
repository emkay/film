import { fixture, html, expect } from '@open-wc/testing'
import './nav.js'
import './nav-item.js'
import './breadcrumb.js'
import './breadcrumb-item.js'
import type { NavItem } from './nav-item.js'
import type { BreadcrumbItem } from './breadcrumb-item.js'

describe('film-nav', () => {
  it('is a labelled navigation landmark', async () => {
    const el = await fixture<HTMLElement>(html`<film-nav label="Settings"></film-nav>`)
    expect(el.shadowRoot?.querySelector('nav')?.getAttribute('aria-label')).to.equal('Settings')
  })

  it('marks the active item as the current page', async () => {
    const el = await fixture<NavItem>(html`<film-nav-item href="/a" active>A</film-nav-item>`)
    const link = el.shadowRoot?.querySelector('a') as HTMLAnchorElement
    expect(link.getAttribute('href')).to.equal('/a')
    expect(link.getAttribute('aria-current')).to.equal('page')
    el.active = false
    await el.updateComplete
    expect(link.hasAttribute('aria-current')).to.equal(false)
  })
})

describe('film-breadcrumb', () => {
  it('is a labelled navigation landmark', async () => {
    const el = await fixture<HTMLElement>(html`<film-breadcrumb></film-breadcrumb>`)
    expect(el.shadowRoot?.querySelector('nav')?.getAttribute('aria-label')).to.equal('Breadcrumb')
  })

  it('links ancestors and marks the current page without a link', async () => {
    const parent = await fixture<BreadcrumbItem>(html`<film-breadcrumb-item href="/docs">Docs</film-breadcrumb-item>`)
    const current = await fixture<BreadcrumbItem>(html`<film-breadcrumb-item href="/docs/x" current>X</film-breadcrumb-item>`)
    expect(parent.shadowRoot?.querySelector('a')?.getAttribute('href')).to.equal('/docs')
    expect(current.shadowRoot?.querySelector('a')).to.equal(null)
    expect(current.shadowRoot?.querySelector('[aria-current="page"]')).to.exist
  })
})
