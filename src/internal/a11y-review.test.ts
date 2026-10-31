import { fixture, html, expect } from '@open-wc/testing'
import { a11ySnapshot, executeServerCommand, sendKeys, sendMouse, resetMouse, setViewport } from '@web/test-runner-commands'
import '../index.js'

// Regression tests for the WCAG 2.2 AA code review. Each failed before its fix.

type AxNode = Record<string, unknown> & { role?: string, name?: string, children?: AxNode[] }
const settle = (ms = 60): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))
const axTree = async (): Promise<AxNode> => await a11ySnapshot({}) as unknown as AxNode
// Unpruned, so container roles such as dialog appear (see web-test-runner.config.js).
const fullAxTree = async (): Promise<AxNode> => await executeServerCommand('a11y-snapshot-full') as AxNode
const all = (n: AxNode, test: (x: AxNode) => boolean, acc: AxNode[] = []): AxNode[] => {
  if (test(n)) acc.push(n)
  for (const c of n.children ?? []) all(c, test, acc)
  return acc
}
const THEMES = ['paper', 'classic', 'kodachrome', 'polaroid', 'ektachrome', 'velvia'].flatMap((p) => ['light', 'dark'].map((s) => [p, s]))
function setTheme (palette?: string, scheme?: string): void {
  if (palette) { document.documentElement.dataset.filmTheme = palette; document.documentElement.dataset.theme = scheme } else {
    delete document.documentElement.dataset.filmTheme
    delete document.documentElement.dataset.theme
  }
}

const canvas = Object.assign(document.createElement('canvas'), { width: 1, height: 1 })
const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
function rgb (color: string): number[] {
  ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1)
  return Array.from(ctx.getImageData(0, 0, 1, 1).data)
}
function contrast (a: string, b: string): number {
  const lum = (c: number[]): number => {
    const f = (v: number): number => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
  }
  const [x, y] = [lum(rgb(a)), lum(rgb(b))].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
const pageBackground = (): string => {
  const probe = document.createElement('div')
  probe.style.background = 'var(--film-color-background)'
  document.body.append(probe)
  const colour = getComputedStyle(probe).backgroundColor
  probe.remove()
  return colour
}

before(async () => {
  await Promise.all(['/css/base.css', '/css/themes/default/index.css'].map((href) => {
    if (document.querySelector(`link[href="${href}"]`)) return undefined
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href })
    document.head.append(link)
    return new Promise((resolve) => { link.onload = resolve })
  }))
})
afterEach(() => setTheme())

describe('#1 film-button focus ring (2.4.7, 1.4.11)', () => {
  it('is visible against the page in every theme', async () => {
    const el = await fixture<HTMLElement>(html`<div><button id="before">before</button><film-button>Save</film-button></div>`)
    ;(el.querySelector('#before') as HTMLElement).focus()
    await sendKeys({ press: 'Tab' }) // keyboard focus onto the film-button
    const inner = el.querySelector('film-button')?.shadowRoot?.querySelector('button') as HTMLElement
    expect(inner.matches(':focus-visible'), 'has keyboard focus').to.equal(true)
    const weak: string[] = []
    for (const [p, s] of THEMES) {
      setTheme(p, s); await settle(10)
      const style = getComputedStyle(inner)
      const ratio = style.outlineStyle === 'none' ? 0 : contrast(style.outlineColor, pageBackground())
      if (ratio < 3) weak.push(`${p}/${s} ${ratio.toFixed(2)}`)
    }
    expect(weak, weak.join(', ')).to.deep.equal([])
  })

  it('does not draw the ring on mouse hover', async () => {
    const el = await fixture<HTMLElement>(html`<film-button>Save</film-button>`)
    const inner = el.shadowRoot?.querySelector('button') as HTMLElement
    const r = inner.getBoundingClientRect()
    await sendMouse({ type: 'move', position: [Math.round(r.x + 5), Math.round(r.y + 5)] })
    await settle()
    expect(getComputedStyle(inner).outlineStyle).to.equal('none')
    await resetMouse()
  })
})

describe('#2 placeholder contrast (1.4.3)', () => {
  const cases: Array<[string, () => ReturnType<typeof html>, string]> = [
    ['film-input', () => html`<film-input placeholder="Search"></film-input>`, 'input'],
    ['film-textarea', () => html`<film-textarea placeholder="Notes"></film-textarea>`, 'textarea'],
    ['film-number-input', () => html`<film-number-input placeholder="0"></film-number-input>`, 'input'],
    ['film-search', () => html`<film-search></film-search>`, 'input'],
    ['film-combobox', () => html`<film-combobox></film-combobox>`, 'input']
  ]
  for (const [tag, tpl, sel] of cases) {
    it(`${tag} placeholder meets 4.5:1 in every theme`, async () => {
      const el = await fixture<HTMLElement>(tpl())
      const field = el.shadowRoot?.querySelector(sel) as HTMLElement
      const weak: string[] = []
      for (const [p, s] of THEMES) {
        setTheme(p, s); await settle(10)
        let bg = getComputedStyle(field).backgroundColor
        for (let n: Element | null = field; bg === 'rgba(0, 0, 0, 0)' && n; n = n.parentElement ?? ((n.getRootNode() as ShadowRoot).host as Element | null)) bg = getComputedStyle(n).backgroundColor
        const ph = getComputedStyle(field, '::placeholder')
        const ratio = contrast(ph.color, bg) * (Number(ph.opacity) < 1 ? 0 : 1)
        if (ratio < 4.5) weak.push(`${p}/${s} ${ratio.toFixed(2)}`)
      }
      expect(weak, weak.join(', ')).to.deep.equal([])
    })
  }
})

describe('#3 content on hover is hoverable and dismissible (1.4.13)', () => {
  it('a hover popover stays open while the pointer is over it', async () => {
    const wrap = await fixture<HTMLElement>(html`<div style="padding: 80px"><film-popover trigger="hover"><button slot="trigger">Info</button><p>Body with a <a href="#x">link</a></p></film-popover></div>`)
    const popover = wrap.querySelector('film-popover') as HTMLElement
    const t = (popover.querySelector('button') as HTMLElement).getBoundingClientRect()
    await sendMouse({ type: 'move', position: [Math.round(t.x + 5), Math.round(t.y + 5)] }); await settle(120)
    const panel = popover.shadowRoot?.querySelector('.panel') as HTMLElement
    const r = panel.getBoundingClientRect()
    await sendMouse({ type: 'move', position: [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)] }); await settle(250)
    expect(panel.matches(':popover-open'), 'stays open over the panel').to.equal(true)
    await sendMouse({ type: 'move', position: [2, 2] }); await settle(250)
    expect(panel.matches(':popover-open'), 'closes once the pointer leaves both').to.equal(false)
    await resetMouse()
  })

  for (const [name, tpl, sel] of [
    ['tooltip', html`<div style="padding: 80px"><film-tooltip content="Hint"><button>Target</button></film-tooltip><button id="elsewhere">Elsewhere</button></div>`, 'film-tooltip'],
    ['hover popover', html`<div style="padding: 80px"><film-popover trigger="hover"><button slot="trigger">Info</button><p>Body</p></film-popover><button id="elsewhere">Elsewhere</button></div>`, 'film-popover']
  ] as const) {
    it(`a ${name} opened by hover closes on Escape, wherever focus is`, async () => {
      const wrap = await fixture<HTMLElement>(tpl)
      ;(wrap.querySelector('#elsewhere') as HTMLElement).focus()
      const host = wrap.querySelector(sel) as HTMLElement & { open: boolean, updateComplete: Promise<boolean> }
      const t = (host.querySelector('button') as HTMLElement).getBoundingClientRect()
      await sendMouse({ type: 'move', position: [Math.round(t.x + 5), Math.round(t.y + 5)] }); await settle(120)
      expect(host.open, 'opened by hover').to.equal(true)
      await sendKeys({ press: 'Escape' }); await settle()
      expect(host.open).to.equal(false)
      await resetMouse()
    })
  }
})

describe('#4 toast timing (2.2.1)', () => {
  it('pauses while it has keyboard focus, and resumes after', async () => {
    const el = await fixture<HTMLElement & { show: () => void, open: boolean }>(html`<div><film-toast duration="200">Saved</film-toast><button id="away">Away</button></div>`)
    const toast = el.querySelector('film-toast') as HTMLElement & { show: () => void, open: boolean }
    toast.show(); await settle(20)
    ;(toast.shadowRoot?.querySelector('.close') as HTMLElement).focus()
    await settle(450)
    expect(toast.open, 'still open while focused').to.equal(true)
    ;(el.querySelector('#away') as HTMLElement).focus()
    await settle(450)
    expect(toast.open, 'closes after focus leaves').to.equal(false)
  })
})

describe('#5 film-window is a named dialog (1.3.1, 4.1.2)', () => {
  it('is a non-modal dialog named by its label, its buttons inside it', async () => {
    await fixture(html`<div style="position: relative; block-size: 400px"><film-window label="Notes">x</film-window></div>`)
    await settle()
    const dialogs = all(await fullAxTree(), (n) => n.role === 'dialog')
    expect(dialogs.map((d) => d.name)).to.deep.equal(['Notes'])
    expect(all(dialogs[0], (n) => n.role === 'button').map((b) => b.name)).to.include.members(['Minimise', 'Maximise', 'Close'])
  })

  it('still takes `title`, without leaving the native tooltip attribute set', async () => {
    const box = await fixture<HTMLElement>(html`<div style="position: relative; block-size: 400px"></div>`)
    const win = document.createElement('film-window') as HTMLElement & { updateComplete: Promise<boolean> }
    win.title = 'Console'
    box.append(win)
    await win.updateComplete; await settle()
    expect(all(await fullAxTree(), (n) => n.role === 'dialog').map((d) => d.name)).to.deep.equal(['Console'])
    expect(win.hasAttribute('title'), 'no native tooltip').to.equal(false)
  })
})

describe('#6 combobox announces its results (4.1.3)', () => {
  it('reports "No matches" in a live status region', async () => {
    const el = await fixture<HTMLElement>(html`<film-combobox label="Fruit"><film-select-option value="a">Apple</film-select-option><film-select-option value="b">Banana</film-select-option></film-combobox>`)
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.focus()
    await sendKeys({ type: 'zzz' }); await settle(120)
    const status = all(await axTree(), (n) => n.role === 'status')
    expect(status.map((s) => (s.children ?? []).map((c) => c.name).join('') || s.name).join(' ')).to.contain('No matches')
  })

  it('reports how many results there are', async () => {
    const el = await fixture<HTMLElement>(html`<film-combobox label="Fruit"><film-select-option value="a">Apple</film-select-option><film-select-option value="b">Apricot</film-select-option><film-select-option value="c">Banana</film-select-option></film-combobox>`)
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.focus()
    await sendKeys({ type: 'ap' }); await settle(120)
    const region = el.shadowRoot?.querySelector('[role="status"]')
    expect(region?.textContent?.trim()).to.equal('2 results')
  })
})

describe('#7 reflow at 320px (1.4.10)', () => {
  before(async () => { await setViewport({ width: 320, height: 640 }) })
  after(async () => { await setViewport({ width: 800, height: 600 }) })

  for (const [tag, tpl] of [
    ['film-heading', html`<film-heading level="1">Internationalisation</film-heading>`],
    ['film-text', html`<film-text size="s3">Internationalisation</film-text>`],
    ['film-prose', html`<film-prose><p style="font-size: 3rem">Internationalisation</p></film-prose>`]
  ] as const) {
    it(`${tag} wraps a long word instead of overflowing`, async () => {
      const el = await fixture<HTMLElement>(tpl)
      await settle()
      expect(document.documentElement.scrollWidth).to.be.at.most(320)
      void el
    })
  }

  it('film-button-group (attached) wraps instead of overflowing', async () => {
    await fixture(html`<film-button-group attached><film-button>One</film-button><film-button>Two</film-button><film-button>Three</film-button><film-button>Four</film-button></film-button-group>`)
    await settle()
    expect(document.documentElement.scrollWidth).to.be.at.most(320)
  })
})

describe('#8 breadcrumb separators (1.3.1)', () => {
  it('are not read out', async () => {
    await fixture(html`<film-breadcrumb><film-breadcrumb-item href="/a">Home</film-breadcrumb-item><film-breadcrumb-item href="/b">Docs</film-breadcrumb-item><film-breadcrumb-item current>Page</film-breadcrumb-item></film-breadcrumb>`)
    await settle()
    expect(all(await axTree(), (n) => n.role === 'StaticText' && n.name === '/')).to.have.length(0)
  })
})

describe('#9 labels say what they act on (2.4.6)', () => {
  it('a tag\'s remove button names the tag', async () => {
    const el = await fixture<HTMLElement>(html`<film-cluster><film-tag removable>css</film-tag><film-tag removable>html</film-tag></film-cluster>`)
    await settle()
    const names = Array.from(el.querySelectorAll('film-tag')).map((t) => t.shadowRoot?.querySelector('.remove')?.getAttribute('aria-label'))
    expect(names).to.deep.equal(['Remove css', 'Remove html'])
  })

  it('a table row checkbox names its row', async () => {
    const el = await fixture<HTMLElement>(html`<film-table selectable .columns=${[{ key: 'name', label: 'Name' }]} .rows=${[{ name: 'Ada' }, { name: 'Grace' }]}></film-table>`)
    await settle()
    const names = Array.from(el.shadowRoot?.querySelectorAll('tbody input[type="checkbox"]') ?? []).map((c) => c.getAttribute('aria-label'))
    expect(names).to.deep.equal(['Select Ada', 'Select Grace'])
  })
})

describe('#10 invalid fields are announced as invalid (3.3.1, 4.1.2)', () => {
  const textbox = async (): Promise<AxNode | undefined> => all(await axTree(), (n) => n.role === 'textbox')[0]

  it('not before anyone has tried to submit', async () => {
    await fixture(html`<film-input label="Email" required></film-input>`)
    await settle()
    expect(String((await textbox())?.invalid ?? 'false')).to.equal('false')
  })

  it('after validation fails, and not once fixed', async () => {
    const el = await fixture<HTMLElement & { reportValidity: () => boolean, value: string, updateComplete: Promise<boolean> }>(html`<film-input label="Email" required></film-input>`)
    el.reportValidity(); await settle()
    expect(String((await textbox())?.invalid ?? 'false')).to.equal('true')
    el.value = 'a@b.c'
    await el.updateComplete; await settle()
    expect(String((await textbox())?.invalid ?? 'false')).to.equal('false')
  })

  it('applies to a checkbox, on the element that takes focus', async () => {
    const el = await fixture<HTMLElement & { reportValidity: () => boolean }>(html`<film-checkbox required>Agree</film-checkbox>`)
    el.reportValidity(); await settle()
    expect(el.getAttribute('aria-invalid')).to.equal('true')
  })
})

describe('#11 film-icon-button without a label', () => {
  it('warns that it has no accessible name', async () => {
    const warnings: string[] = []
    const original = console.warn
    console.warn = (...args: unknown[]) => { warnings.push(args.map(String).join(' ')) }
    try {
      await fixture(html`<film-icon-button><svg viewBox="0 0 1 1"></svg></film-icon-button>`)
      await settle()
    } finally {
      console.warn = original
    }
    expect(warnings.join('\n')).to.contain('film-icon-button')
  })
})

describe('#12 moving a window without dragging (2.5.7)', () => {
  it('moves by tap-to-place from its Move button', async () => {
    const box = await fixture<HTMLElement>(html`<div style="position: relative; inline-size: 800px; block-size: 600px"><film-window label="W" x="40" y="40">x</film-window></div>`)
    const win = box.querySelector('film-window') as HTMLElement & { x: number, y: number, updateComplete: Promise<boolean> }
    await win.updateComplete
    const move = win.shadowRoot?.querySelector('button[aria-label="Move"]') as HTMLElement
    expect(move, 'has a Move button').to.exist
    const r = move.getBoundingClientRect()
    const at = (x: number, y: number, type: string, target: Element): void => {
      target.dispatchEvent(new PointerEvent(type, { bubbles: true, composed: true, button: 0, pointerId: 1, clientX: x, clientY: y }))
    }
    at(r.x + 5, r.y + 5, 'pointerdown', move)
    at(r.x + 5, r.y + 5, 'pointerup', move)
    await win.updateComplete
    at(r.x + 105, r.y + 55, 'pointerdown', document.body)
    await win.updateComplete
    expect([win.x, win.y]).to.deep.equal([140, 90])
  })

  it('still raises, not arms, on a plain click of the title bar', async () => {
    const box = await fixture<HTMLElement>(html`<div style="position: relative; inline-size: 800px; block-size: 600px"><film-window label="W" x="40" y="40">x</film-window></div>`)
    const win = box.querySelector('film-window') as HTMLElement & { x: number, y: number, updateComplete: Promise<boolean> }
    await win.updateComplete
    const bar = win.shadowRoot?.querySelector('.titlebar') as HTMLElement
    const r = bar.getBoundingClientRect()
    bar.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, button: 0, pointerId: 1, clientX: r.x + 20, clientY: r.y + 5 }))
    bar.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, composed: true, button: 0, pointerId: 1, clientX: r.x + 20, clientY: r.y + 5 }))
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, button: 0, pointerId: 1, clientX: r.x + 200, clientY: r.y + 200 }))
    await win.updateComplete
    expect([win.x, win.y]).to.deep.equal([40, 40])
  })
})
