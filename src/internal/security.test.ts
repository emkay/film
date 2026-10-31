import { fixture, html, expect } from '@open-wc/testing'
import '../index.js'
import { safeHref } from './url.js'

// Security regression tests from the audit.

// #1: Film's link components must not render script URLs. Lit doesn't sanitise
// URLs, and @lit/react sets `href` as a property, so React 19's own block on
// javascript: URLs never sees it — Film is the last place to stop them.
const DANGEROUS = [
  'javascript:alert(1)',
  ' JaVaScRiPt:alert(1)',
  'java\tscript:alert(1)',
  'java\nscript:alert(1)',
  '\x01javascript:alert(1)',
  'vbscript:msgbox(1)',
  'data:text/html,<script>alert(1)</script>'
]
const SAFE = ['/docs', 'docs/intro', '#section', '?q=1', 'https://example.com/a', 'http://example.com', 'mailto:a@b.c', 'tel:+1555', '//cdn.example.com/x']
const LINK_TAGS = ['film-link', 'film-nav-item', 'film-breadcrumb-item', 'film-list-item']

describe('security: link URLs', () => {
  for (const tag of LINK_TAGS) {
    describe(tag, () => {
      for (const url of DANGEROUS) {
        it(`renders no link for ${JSON.stringify(url)}`, async () => {
          const box = await fixture<HTMLElement>(html`<film-box></film-box>`)
          const el = document.createElement(tag) as HTMLElement & { href: string, updateComplete: Promise<boolean> }
          el.href = url
          el.textContent = 'x'
          box.append(el)
          await el.updateComplete
          const link = el.shadowRoot?.querySelector('a[href]') as HTMLAnchorElement | null
          const protocol = link ? new URL(link.href, location.href).protocol : '(no link)'
          expect(protocol).to.equal('(no link)')
        })
      }

      it('still renders ordinary links', async () => {
        for (const url of SAFE) {
          const box = await fixture<HTMLElement>(html`<film-box></film-box>`)
          const el = document.createElement(tag) as HTMLElement & { href: string, updateComplete: Promise<boolean> }
          el.href = url
          el.textContent = 'x'
          box.append(el)
          await el.updateComplete
          expect(el.shadowRoot?.querySelector('a')?.getAttribute('href'), url).to.equal(url)
        }
      })
    })
  }

  it('safeHref parses the way the browser does', () => {
    for (const url of DANGEROUS) expect(safeHref(url), JSON.stringify(url)).to.equal(null)
    for (const url of SAFE) expect(safeHref(url), url).to.equal(url)
    expect(safeHref('')).to.equal(null)
  })
})

// #4: film-stack used to write split-after into a <style> element as text, so a
// string from JavaScript or React could add rules of its own.
describe('security: film-stack split-after', () => {
  it('cannot be used to inject CSS', async () => {
    const el = await fixture<HTMLElement & { splitAfter: unknown, updateComplete: Promise<boolean> }>(
      html`<film-stack><p>a</p><p>b</p></film-stack>`
    )
    el.splitAfter = '1)) {} :host { outline: 9px solid red } ::slotted(:nth-child(1'
    await el.updateComplete
    expect(getComputedStyle(el).outlineWidth).to.not.equal('9px')
  })
})

// #7: film-form built its values on a plain object, so a control named
// __proto__ hit the prototype setter and its value silently vanished.
describe('security: film-form values', () => {
  it('keeps a control named __proto__ as an ordinary key', async () => {
    const el = await fixture<HTMLElement & { getValues: () => Record<string, unknown> }>(html`<film-form>
      <film-input name="__proto__" value="kept"></film-input>
      <film-input name="constructor" value="also kept"></film-input>
    </film-form>`)
    await new Promise((resolve) => setTimeout(resolve, 30))
    const values = el.getValues()
    expect(Object.getOwnPropertyDescriptor(values, '__proto__')?.value).to.equal('kept')
    expect(values.constructor).to.equal('also kept')
    expect(({} as Record<string, unknown>).kept, 'Object.prototype untouched').to.equal(undefined)
  })
})

