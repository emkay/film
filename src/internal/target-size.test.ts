import { expect } from '@open-wc/testing'
import { html, render, type TemplateResult } from 'lit'
import '../index.js'
import * as examples from '../../demo/examples/index.js'

// WCAG 2.2 SC 2.5.8 Target Size (Minimum), checked over every demo example and
// the states the demo doesn't show. A pointer target must be at least 24×24
// CSS px, unless a 24px circle centred on it overlaps no other target and no
// other undersized target's circle (the spacing exception). axe's own
// target-size rule is off by default and misses nested targets, so this
// measures directly.

const MIN = 24

const TARGET = [
  'button', 'a[href]', 'input:not([type="hidden"])', 'select', 'textarea',
  '[role="button"]', '[role="menuitem"]', '[role="tab"]', '[role="option"]',
  '[role="checkbox"]', '[role="switch"]', '[role="radio"]', '[role="gridcell"]',
  // Clickable whatever the roving tabindex says.
  '[role="treeitem"]', 'tr[tabindex]', '[role="separator"][tabindex]', '[tabindex="0"]'
].join(', ')

/**
 * Known exceptions, each with its reason. Window resize edges are drag
 * handles; making them WCAG-compliant (2.5.7 needs a non-drag way to resize
 * too) is a design decision still open, so they're listed rather than hidden.
 */
const KNOWN: Array<[RegExp, string]> = [
  [/^film-window › span\.handle/, 'window resize edges — pending a non-drag resize design (2.5.7)']
]

// States the demo never renders, and layouts that stress spacing.
const extras: Record<string, () => TemplateResult> = {
  searchWithQuery: () => html`<film-search value="lit"></film-search>`,
  removableTags: () => html`<film-cluster space="s-2"><film-tag removable>css</film-tag><film-tag removable>html</film-tag></film-cluster>`,
  toastShown: () => html`<film-toast duration="0" open>Saved</film-toast>`,
  openDialog: () => html`<film-dialog label="Settings" open>Body</film-dialog>`,
  openDrawer: () => html`<film-drawer label="Filters" open>Body</film-drawer>`,
  openSelect: () => html`<film-select open><film-select-option value="a">A</film-select-option><film-select-option value="b">B</film-select-option></film-select>`,
  treeWithChildren: () => html`<film-tree><film-tree-item expanded>Root<film-tree-item slot="children">Child</film-tree-item></film-tree-item></film-tree>`,
  narrowNumberInput: () => html`<film-cluster><film-field label="Qty"><film-number-input value="10"></film-number-input></film-field></film-cluster>`,
  selectableActivatableTable: () => html`<film-table selectable activatable
    .columns=${[{ key: 'name', label: 'Name' }]} .rows=${[{ name: 'a' }, { name: 'b' }]}></film-table>`
}

function collectTargets (root: ParentNode, out: Element[] = []): Element[] {
  for (const el of Array.from(root.querySelectorAll('*'))) {
    if (el.matches(TARGET) && !(el as HTMLButtonElement).disabled) {
      const r = el.getBoundingClientRect()
      const style = getComputedStyle(el)
      if (r.width > 0 && r.height > 0 && style.visibility !== 'hidden' && style.pointerEvents !== 'none') out.push(el)
    }
    if (el.shadowRoot) collectTargets(el.shadowRoot, out)
  }
  return out
}

/** Does `inner` sit inside `outer`, across shadow boundaries? */
function within (inner: Element, outer: Element): boolean {
  for (let node: Node | null = inner; node; node = node.parentNode ?? (node as ShadowRoot).host ?? null) {
    if (node === outer) return true
  }
  return false
}

function circleHitsRect (cx: number, cy: number, r: number, rect: DOMRect): boolean {
  const nx = Math.max(rect.left, Math.min(cx, rect.right))
  const ny = Math.max(rect.top, Math.min(cy, rect.bottom))
  return (cx - nx) ** 2 + (cy - ny) ** 2 < r * r
}

export function describeTarget (el: Element): string {
  const host = ((el.getRootNode() as ShadowRoot).host as Element | undefined)?.localName
  const cls = typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : ''
  const name = el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 16) ?? ''
  return `${host ? `${host} › ` : ''}${el.localName}${cls} "${name}"`
}

/** The area a pointer can activate: a control wrapped in a label includes it. */
function hitRect (el: Element): DOMRect {
  const label = el.localName === 'input' ? el.closest('label') : null
  return (label ?? el).getBoundingClientRect()
}

/** Undersized targets that the spacing exception doesn't save. */
export function targetSizeFailures (container: Element): string[] {
  const targets = collectTargets(container)
  const small = targets.filter((t) => {
    const r = hitRect(t)
    return r.width < MIN - 0.5 || r.height < MIN - 0.5
  })
  const failures: string[] = []
  for (const t of small) {
    const r = hitRect(t)
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    // A target nested inside another (an expand arrow inside a clickable row)
    // still counts: a near-miss activates the other target.
    const overlaps = targets.filter((o) => o !== t && !within(o, t) && circleHitsRect(cx, cy, MIN / 2, hitRect(o)))
    const crowds = small.filter((o) => {
      if (o === t) return false
      const q = hitRect(o)
      return Math.hypot(cx - (q.left + q.width / 2), cy - (q.top + q.height / 2)) < MIN
    })
    if (overlaps.length || crowds.length) {
      failures.push(`${describeTarget(t)} is ${Math.round(r.width)}×${Math.round(r.height)}, too close to ${[...overlaps, ...crowds].map(describeTarget).join(', ')}`)
    }
  }
  return failures
}

describe('target size (WCAG 2.5.8)', function () {
  this.timeout(120000)
  const container = document.createElement('main')

  before(async () => {
    await Promise.all(['/css/base.css', '/css/themes/default/index.css'].map((href) => {
      if (document.querySelector(`link[href="${href}"]`)) return undefined
      const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href })
      document.head.append(link)
      return new Promise((resolve) => { link.onload = resolve })
    }))
    document.body.append(container)
  })
  after(() => container.remove())

  const sources = {
    ...Object.fromEntries(Object.entries(examples).filter(([, v]) => typeof v === 'function')),
    ...extras
  } as Record<string, () => TemplateResult>

  for (const [name, example] of Object.entries(sources)) {
    it(name, async () => {
      render(example(), container)
      await new Promise((resolve) => setTimeout(resolve, 60))
      const failures = targetSizeFailures(container)
        .filter((f) => !KNOWN.some(([pattern]) => pattern.test(f)))
      render(null, container)
      expect(failures, failures.join('\n')).to.deep.equal([])
    })
  }
})
