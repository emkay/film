import { html, type TemplateResult } from 'lit'

export const searchExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-search">Search</h3>
    <film-search label="Search" placeholder="Search components…"></film-search>
  </film-box>
`
