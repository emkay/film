import { html, type TemplateResult } from 'lit'

export const calendarExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-calendar">Calendar</h3>
    <p>Arrow keys move by day, PageUp/PageDown change month, Enter selects.</p>
    <film-calendar></film-calendar>
  </film-box>
`
