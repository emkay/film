import { html, type TemplateResult } from 'lit'

export const numberInputExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-number-input">Number Input</h3>
    <film-cluster>
      <film-field label="Quantity">
        <film-number-input name="qty" value="3" min="0" max="10"></film-number-input>
      </film-field>
      <film-field label="Step by 5">
        <film-number-input name="amount" value="10" step="5"></film-number-input>
      </film-field>
    </film-cluster>
  </film-box>
`
