import { html, type TemplateResult } from 'lit'
import type { Window } from '../../src/index.js'

let z = 1

// Raise + activate the focused window, deactivate its siblings. (film-workspace
// will own this; here it previews the behaviour for standalone windows.)
const onFocus = (event: Event): void => {
  const win = event.currentTarget as Window
  win.style.zIndex = String((z += 1))
  win.parentElement?.querySelectorAll('film-window').forEach((other) => {
    other.active = other === win
  })
}

const onClose = (event: Event): void => {
  ;(event.currentTarget as Window).remove()
}

export const windowExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-window">Window</h3>
    <p>Drag the title bar to move, edges/corners to resize (or focus them and use arrows). Double-click the bar to maximise.</p>
    <div style="position: relative; block-size: 24rem; overflow: hidden; border: var(--border-thin) solid var(--film-color-border); border-radius: var(--film-radius);">
      <film-window
        title="Notes"
        x="24"
        y="24"
        width="260"
        height="180"
        active
        @film-window-focus=${onFocus}
        @film-window-close=${onClose}
      >
        <p>A non-modal window. Move, resize, minimise, maximise, or close it.</p>
      </film-window>
      <film-window
        title="Files"
        x="200"
        y="120"
        width="280"
        height="200"
        @film-window-focus=${onFocus}
        @film-window-close=${onClose}
      >
        <film-list>
          <film-list-item>report.pdf</film-list-item>
          <film-list-item>photo.jpg</film-list-item>
          <film-list-item>notes.md</film-list-item>
        </film-list>
      </film-window>
    </div>
  </film-box>
`
