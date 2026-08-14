import { html, type TemplateResult } from 'lit'

export const radioExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-radio">Radio</h3>
    <film-radio-group label="Size" value="m">
      <film-radio value="s">Small</film-radio>
      <film-radio value="m">Medium</film-radio>
      <film-radio value="l">Large</film-radio>
    </film-radio-group>
  </film-box>
`
