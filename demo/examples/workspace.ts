import { html, type TemplateResult } from 'lit'
import type { Workspace } from '../../src/index.js'

const onLayout = (event: Event): void => {
  const value = (event.target as HTMLElement & { value: string }).value
  const ws = (event.currentTarget as HTMLElement).parentElement?.querySelector('film-workspace') as Workspace | null
  if (!ws) return
  if (value === 'floating') {
    ws.layout = 'floating'
  } else {
    ws.layout = 'tiled'
    ws.tiling = value as 'grid' | 'bsp'
  }
}

const onClose = (event: Event): void => {
  ;(event.currentTarget as HTMLElement).remove()
}

export const workspaceExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-workspace">Workspace</h3>
    <p>
      Click a window to raise it. In floating layout, drag one to an edge or corner to snap it to a
      half or quarter. Tile them into a uniform grid or a recursive BSP split.
    </p>
    <film-stack space="var(--s0)">
      <film-radio-group value="floating" label="Layout" @change=${onLayout}>
        <film-radio value="floating">Floating</film-radio>
        <film-radio value="grid">Tiled — grid</film-radio>
        <film-radio value="bsp">Tiled — BSP</film-radio>
      </film-radio-group>
      <film-workspace
        layout="floating"
        gap="8"
        style="block-size: 24rem; border: var(--border-thin) solid var(--film-color-border); border-radius: var(--film-radius);"
      >
        <film-window title="Editor" x="16" y="16" width="240" height="150" @film-window-close=${onClose}>
          <p>Drag me to a screen edge to snap.</p>
        </film-window>
        <film-window title="Preview" x="120" y="90" width="240" height="150" @film-window-close=${onClose}>
          <p>Windows stack and focus independently.</p>
        </film-window>
        <film-window title="Console" x="220" y="150" width="240" height="150" @film-window-close=${onClose}>
          <film-code code="film build --watch"></film-code>
        </film-window>
      </film-workspace>
    </film-stack>
  </film-box>
`
