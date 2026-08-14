import { html, type TemplateResult } from 'lit'

export const badgeExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-badge">Badge</h3>
    <film-cluster>
      <film-badge>Neutral</film-badge>
      <film-badge variant="accent">Accent</film-badge>
      <film-badge variant="success">Success</film-badge>
      <film-badge variant="warning">Warning</film-badge>
      <film-badge variant="danger">Danger</film-badge>
    </film-cluster>
  </film-box>
`
