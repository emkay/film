import { html, type TemplateResult } from 'lit'

export const stepsExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-steps">Steps</h3>
    <film-steps current="1">
      <film-step label="Account"></film-step>
      <film-step label="Profile"></film-step>
      <film-step label="Payment"></film-step>
      <film-step label="Confirm"></film-step>
    </film-steps>
  </film-box>
`
