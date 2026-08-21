import { html, type TemplateResult } from 'lit'

export const spinnerExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-spinner">Spinner</h3>
    <film-cluster>
      <film-spinner></film-spinner>
      <film-spinner size="var(--s2)"></film-spinner>
      <film-spinner size="var(--s3)"></film-spinner>
    </film-cluster>
  </film-box>
`
