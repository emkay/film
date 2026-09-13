import { html, type TemplateResult } from 'lit'

export const datePickerExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-date-picker">Date Picker</h3>
    <film-stack>
      <film-cluster>
        <film-field label="Start date" hint="Pick from the calendar.">
          <film-date-picker name="start"></film-date-picker>
        </film-field>
      </film-cluster>

      <h4>Reaching a date years away</h4>
      <p>
        The calendar header steps by year (« ») as well as by month (‹ ›), and
        both stop at <code>min</code> / <code>max</code> rather than wandering
        into a fully disabled month. Shift+PageUp / PageDown does the same from
        the keyboard.
      </p>
      <film-cluster>
        <film-field label="Readiness as at" hint="Bounded to the audit window.">
          <film-date-picker name="as-at" min="2020-01-01" max="2026-12-31"></film-date-picker>
        </film-field>
      </film-cluster>

      <h4>Typing instead</h4>
      <p>
        For a date far from today, <code>film-input</code> with
        <code>type="date"</code> is usually quicker: it is a real text field with
        the platform picker and keyboard entry, and <code>min</code> /
        <code>max</code> are enforced by constraint validation.
      </p>
      <film-cluster>
        <film-input
          label="Readiness as at"
          type="date"
          name="as-at-typed"
          min="2020-01-01"
          max="2026-12-31"
        ></film-input>
      </film-cluster>
    </film-stack>
  </film-box>
`
