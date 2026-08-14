import { html, type TemplateResult } from 'lit'

export const dividerExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-divider">Divider</h3>
    <p>Above the divider.</p>
    <film-divider></film-divider>
    <p>Below the divider.</p>
    <film-cluster>
      <span>Left</span>
      <film-divider vertical></film-divider>
      <span>Right</span>
    </film-cluster>
  </film-box>
`
