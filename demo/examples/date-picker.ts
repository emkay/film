import { html, type TemplateResult } from 'lit'

export const datePickerExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-date-picker">Date Picker</h3>
    <film-cluster>
      <film-field label="Start date" hint="Pick from the calendar.">
        <film-date-picker name="start"></film-date-picker>
      </film-field>
    </film-cluster>
  </film-box>
`
