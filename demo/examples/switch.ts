import { html, type TemplateResult } from 'lit'

export const switchExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-switch">Switch</h3>
    <film-stack space="var(--s-1)">
      <film-switch checked>Wi-Fi</film-switch>
      <film-switch>Bluetooth</film-switch>
      <film-switch disabled>Airplane mode</film-switch>
    </film-stack>
  </film-box>
`
