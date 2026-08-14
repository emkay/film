import { html, type TemplateResult } from 'lit'

export const checkboxExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-checkbox">Checkbox</h3>
    <film-stack space="var(--s-1)">
      <film-checkbox checked>Subscribe to updates</film-checkbox>
      <film-checkbox>Remember me</film-checkbox>
      <film-checkbox disabled>Unavailable option</film-checkbox>
    </film-stack>
  </film-box>
`
