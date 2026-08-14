import { html, type TemplateResult } from 'lit'

export const switcherExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-switcher">Switcher</h3>
    <p>A row that switches to a stack below the <code>threshold</code> width.</p>
    <film-switcher threshold="25rem">
      <film-box><p>First</p></film-box>
      <film-box><p>Second</p></film-box>
      <film-box><p>Third</p></film-box>
    </film-switcher>
  </film-box>
`
