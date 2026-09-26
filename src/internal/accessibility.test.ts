import { fixture, html, expect } from '@open-wc/testing'
import { a11ySnapshot, findAccessibilityNode } from '@web/test-runner-commands'
import '../index.js'

// Regression tests for the blocking issues from the accessibility audit. Each
// checks what assistive technology gets — Chrome's accessibility tree, or axe —
// rather than which attributes happen to be set.

interface AxNode { role?: string, name?: string, description?: string, disabled?: boolean, value?: number, valuemin?: number, orientation?: string, children?: AxNode[] }

// The whole page: with a `selector`, a11ySnapshot returns only the first
// interesting node beneath it and drops the rest. Each test's fixture is the
// only content on the page, so the whole tree is that fixture's tree.
async function axTree (_el: Element): Promise<AxNode> {
  return await a11ySnapshot({}) as unknown as AxNode
}
const find = (tree: AxNode, test: (n: AxNode) => boolean): AxNode | null =>
  findAccessibilityNode(tree as never, test as never) as AxNode | null
const all = (tree: AxNode, test: (n: AxNode) => boolean, acc: AxNode[] = []): AxNode[] => {
  if (test(tree)) acc.push(tree)
  for (const child of tree.children ?? []) all(child, test, acc)
  return acc
}
const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 50))

describe('accessibility: blocking issues', () => {
  describe('film-field names its control', () => {
    for (const [tag, role] of [['film-input', 'textbox'], ['film-textarea', 'textbox'], ['film-number-input', 'spinbutton'], ['film-search', 'searchbox']] as const) {
      it(`${tag} is announced by the field's label`, async () => {
        const el = await fixture(html`<div><film-field label="Quantity">${
          tag === 'film-input' ? html`<film-input></film-input>`
            : tag === 'film-textarea' ? html`<film-textarea></film-textarea>`
              : tag === 'film-number-input' ? html`<film-number-input></film-number-input>`
                : html`<film-search></film-search>`
        }</film-field></div>`)
        await settle()
        await expect(el).to.be.accessible({ ignoredRules: ['color-contrast'] })
        const node = find(await axTree(el), (n) => n.role === role)
        expect(node?.name).to.equal('Quantity')
      })
    }

    it('also takes aria-label set directly on the control', async () => {
      const el = await fixture(html`<div><film-input aria-label="Search the docs"></film-input></div>`)
      await settle()
      expect(find(await axTree(el), (n) => n.role === 'textbox')?.name).to.equal('Search the docs')
    })

    it('prefers the control\'s own visible label', async () => {
      const el = await fixture(html`<div><film-input label="Email" aria-label="ignored"></film-input></div>`)
      await settle()
      expect(find(await axTree(el), (n) => n.role === 'textbox')?.name).to.equal('Email')
    })
  })

  describe('film-menu-bar', () => {
    it('exposes its items as menu items, not buttons', async () => {
      const el = await fixture(html`<film-menu-bar>
        <film-menu-bar-item label="File"><film-menu><film-menu-item>New</film-menu-item></film-menu></film-menu-bar-item>
        <film-menu-bar-item label="Edit"><film-menu><film-menu-item>Undo</film-menu-item></film-menu></film-menu-bar-item>
      </film-menu-bar>`)
      await settle()
      const tree = await axTree(el)
      const bar = find(tree, (n) => n.role === 'menubar') as AxNode
      expect(all(bar, (n) => n.role === 'menuitem').map((n) => n.name)).to.deep.equal(['File', 'Edit'])
      expect(all(bar, (n) => n.role === 'button')).to.have.length(0)
      await expect(el).to.be.accessible({ ignoredRules: ['color-contrast'] })
    })
  })

  describe('film-tooltip', () => {
    it('describes its trigger', async () => {
      const el = await fixture(html`<div><film-tooltip content="Saves your work"><button>Save</button></film-tooltip></div>`)
      await settle()
      expect(find(await axTree(el), (n) => n.role === 'button')?.description).to.equal('Saves your work')
    })

    it('describes it before it opens, so the focus announcement includes it', async () => {
      const el = await fixture(html`<div><film-tooltip content="Deletes permanently"><button>Delete</button></film-tooltip></div>`)
      await settle()
      const tooltip = el.querySelector('film-tooltip') as HTMLElement & { open: boolean }
      expect(tooltip.open).to.equal(false)
      expect(find(await axTree(el), (n) => n.role === 'button')?.description).to.equal('Deletes permanently')
    })

    it('uses rich slotted content as the description', async () => {
      const el = await fixture(html`<div><film-tooltip><button>Info</button><span slot="content">Rich <b>hint</b></span></film-tooltip></div>`)
      await settle()
      expect(find(await axTree(el), (n) => n.role === 'button')?.description).to.equal('Rich hint')
    })

    it('follows a changed content', async () => {
      const el = await fixture(html`<div><film-tooltip content="Old"><button>Go</button></film-tooltip></div>`)
      const tooltip = el.querySelector('film-tooltip') as HTMLElement & { content: string, updateComplete: Promise<boolean> }
      tooltip.content = 'New'
      await tooltip.updateComplete
      await settle()
      expect(find(await axTree(el), (n) => n.role === 'button')?.description).to.equal('New')
    })

    it('does not render its hidden description', async () => {
      const el = await fixture(html`<div><film-tooltip content="Saves your work"><button>Save</button></film-tooltip></div>`)
      await settle()
      expect((el as HTMLElement).innerText.trim()).to.equal('Save')
    })
  })

  describe('film-menu-item', () => {
    it('announces a disabled item as disabled', async () => {
      const el = await fixture(html`<film-menu><film-menu-item>Open</film-menu-item><film-menu-item disabled>Export</film-menu-item></film-menu>`)
      await settle()
      const items = all(await axTree(el), (n) => n.role === 'menuitem')
      expect(items.map((n) => [n.name, Boolean(n.disabled)])).to.deep.equal([['Open', false], ['Export', true]])
    })

    it('updates when disabled changes', async () => {
      const el = await fixture(html`<film-menu><film-menu-item disabled>Export</film-menu-item></film-menu>`)
      const item = el.querySelector('film-menu-item') as HTMLElement & { disabled: boolean, updateComplete: Promise<boolean> }
      item.disabled = false
      await item.updateComplete
      await settle()
      expect(find(await axTree(el), (n) => n.role === 'menuitem')?.disabled ?? false).to.equal(false)
    })
  })

  describe('film-calendar', () => {
    it('is a well-formed, named grid', async () => {
      const el = await fixture(html`<div><film-calendar value="2026-08-21"></film-calendar></div>`)
      await settle()
      await expect(el).to.be.accessible({ ignoredRules: ['color-contrast'] })
      // The snapshot prunes grid/row containers as uninteresting, so check the
      // name's source directly: aria-labelledby must resolve within the same
      // shadow root, to the month heading.
      const root = el.querySelector('film-calendar')?.shadowRoot as ShadowRoot
      const grid = root.querySelector('[role="grid"]') as HTMLElement
      const label = root.getElementById(grid.getAttribute('aria-labelledby') ?? '')
      expect(label?.textContent?.trim()).to.equal('August 2026')
      expect(root.querySelectorAll('[role="row"]')).to.have.length(7)
    })

    it('names each day as a date a person would say', async () => {
      const el = await fixture(html`<div><film-calendar value="2026-08-21"></film-calendar></div>`)
      await settle()
      const expected = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(new Date(2026, 7, 21))
      const names = all(await axTree(el), (n) => n.role === 'gridcell').map((n) => n.name)
      expect(names).to.include(expected)
      expect(names.some((name) => /^\d{4}-\d{2}-\d{2}$/.test(name ?? ''))).to.equal(false)
    })
  })

  describe('film-window resize handles', () => {
    it('are valid, and only width and height take keyboard focus', async () => {
      const el = await fixture(html`<film-window title="Notes">x</film-window>`)
      await settle()
      await expect(el).to.be.accessible({ ignoredRules: ['color-contrast'] })
      const focusable = Array.from(el.shadowRoot?.querySelectorAll('.handle[tabindex="0"]') ?? [])
      expect(focusable.map((h) => h.getAttribute('aria-label'))).to.deep.equal(['Resize width', 'Resize height'])
    })

    it('report the current size', async () => {
      const el = await fixture(html`<film-window title="Notes" width="320" height="240">x</film-window>`)
      await settle()
      const separators = all(await axTree(el), (n) => n.role === 'separator')
      expect(separators.map((n) => [n.name, n.value, n.valuemin, n.orientation])).to.deep.equal([
        ['Resize width', 320, 160, 'vertical'],
        ['Resize height', 240, 100, 'horizontal']
      ])
    })
  })

  describe('film-reel', () => {
    it('can be scrolled from the keyboard when it overflows', async () => {
      const el = await fixture(html`<film-reel item-width="200px" label="Photos" style="inline-size: 300px">
        <div>1</div><div>2</div><div>3</div><div>4</div>
      </film-reel>`)
      await settle()
      await expect(el).to.be.accessible({ ignoredRules: ['color-contrast'] })
      expect((el as HTMLElement).tabIndex).to.equal(0)
      expect(find(await axTree(el), (n) => n.role === 'region')?.name).to.equal('Photos')
    })

    it('stays out of the tab order when it fits', async () => {
      const el = await fixture(html`<film-reel item-width="50px" style="inline-size: 600px"><div>1</div></film-reel>`)
      await settle()
      expect((el as HTMLElement).hasAttribute('tabindex')).to.equal(false)
    })
  })
})
