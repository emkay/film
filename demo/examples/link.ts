import { html, type TemplateResult } from 'lit'

export const linkExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-link">Link</h3>
    <film-link href="#">This is a link example</film-link>
  </film-box>
`
