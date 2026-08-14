import { html, type TemplateResult } from 'lit'

export const colorPickerExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-color-picker">Color Picker</h3>
    <film-cluster>
      <film-color-picker label="Brand" value="#0B2B55"></film-color-picker>
      <film-color-picker label="Accent" value="#F4D4AA"></film-color-picker>
    </film-cluster>
  </film-box>
`
