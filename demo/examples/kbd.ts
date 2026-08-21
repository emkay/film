import { html, type TemplateResult } from 'lit'

export const kbdExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-kbd">Kbd</h3>
    <p>Press <film-kbd>⌘</film-kbd> <film-kbd>K</film-kbd> to open search, or <film-kbd>Esc</film-kbd> to close.</p>
  </film-box>
`
