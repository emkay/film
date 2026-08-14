import { html, type TemplateResult } from 'lit'

export const rangeExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-range">Range</h3>
    <film-stack space="var(--s0)">
      <film-range label="Volume" show-value value="40"></film-range>
      <film-range label="Brightness" show-value value="70" min="0" max="100"></film-range>
    </film-stack>
  </film-box>
`
