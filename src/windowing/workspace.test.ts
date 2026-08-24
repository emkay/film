import { fixture, html, expect } from '@open-wc/testing'
import './workspace.js'
import './window.js'
import type { Workspace } from './workspace.js'
import type { Window } from './window.js'

const windowsOf = (ws: Workspace): Window[] => Array.from(ws.querySelectorAll('film-window'))

describe('film-workspace', () => {
  it('activates the focused window and deactivates the others', async () => {
    const ws = await fixture<Workspace>(html`
      <film-workspace style="display:block;width:600px;height:400px">
        <film-window title="A">a</film-window>
        <film-window title="B">b</film-window>
      </film-workspace>
    `)
    await ws.updateComplete
    const [a, b] = windowsOf(ws)
    a.dispatchEvent(new CustomEvent('film-window-focus', { bubbles: true }))
    await a.updateComplete
    await b.updateComplete
    expect(a.active).to.equal(true)
    expect(b.active).to.equal(false)
  })

  it('tiles windows into a grid and pins them', async () => {
    const ws = await fixture<Workspace>(html`
      <film-workspace layout="tiled" style="display:block;width:600px;height:400px">
        <film-window>a</film-window>
        <film-window>b</film-window>
      </film-workspace>
    `)
    await ws.updateComplete
    const [a, b] = windowsOf(ws)
    expect(a.movable).to.equal(false)
    expect(a.resizable).to.equal(false)
    expect(a.x).to.not.equal(b.x)
  })

  it('splits recursively in bsp tiling', async () => {
    const ws = await fixture<Workspace>(html`
      <film-workspace layout="tiled" tiling="bsp" style="display:block;width:600px;height:400px">
        <film-window>a</film-window>
        <film-window>b</film-window>
        <film-window>c</film-window>
      </film-workspace>
    `)
    await ws.updateComplete
    const [a, b, c] = windowsOf(ws)
    // First window takes the full-height left half; the rest split the right half.
    expect(a.x).to.equal(0)
    expect(a.width).to.be.closeTo(300, 1)
    expect(a.height).to.equal(400)
    expect(b.x).to.be.closeTo(300, 1)
    expect(c.x).to.be.closeTo(300, 1)
    expect(a.height).to.be.greaterThan(b.height)
    expect(b.y).to.not.equal(c.y)
  })

  it('snaps a dragged window to the left half at the left edge', async () => {
    const ws = await fixture<Workspace>(html`
      <film-workspace style="display:block;width:600px;height:400px">
        <film-window title="A" x="120" y="120" width="200" height="150">a</film-window>
      </film-workspace>
    `)
    await ws.updateComplete
    const [a] = windowsOf(ws)
    const r = ws.getBoundingClientRect()
    a.dispatchEvent(new CustomEvent('film-window-movestart', { bubbles: true }))
    ws.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + 5, clientY: r.top + 200, bubbles: true }))
    await ws.updateComplete
    a.dispatchEvent(new CustomEvent('film-window-moveend', { bubbles: true }))
    await a.updateComplete
    expect(a.x).to.equal(0)
    expect(a.y).to.equal(0)
    expect(a.width).to.be.closeTo(300, 1)
    expect(a.height).to.equal(400)
  })

  it('maximises a window snapped to the top edge', async () => {
    const ws = await fixture<Workspace>(html`
      <film-workspace style="display:block;width:600px;height:400px">
        <film-window title="A" x="100" y="100" width="200" height="150">a</film-window>
      </film-workspace>
    `)
    await ws.updateComplete
    const [a] = windowsOf(ws)
    const r = ws.getBoundingClientRect()
    a.dispatchEvent(new CustomEvent('film-window-movestart', { bubbles: true }))
    ws.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + 300, clientY: r.top + 5, bubbles: true }))
    await ws.updateComplete
    a.dispatchEvent(new CustomEvent('film-window-moveend', { bubbles: true }))
    await a.updateComplete
    expect(a.maximised).to.equal(true)
  })
})
