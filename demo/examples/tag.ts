import { html, type TemplateResult } from 'lit'

export const tagExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-tag">Tag</h3>
    <film-cluster>
      <film-tag>Default</film-tag>
      <film-tag variant="accent">Accent</film-tag>
      <film-tag variant="success">Success</film-tag>
      <film-tag variant="warning" removable>Warning</film-tag>
      <film-tag variant="danger" removable>Danger</film-tag>
    </film-cluster>
  </film-box>
`
