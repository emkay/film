import { html, type TemplateResult } from 'lit'

export const switchExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-switch">Switch</h3>
    <film-stack space="s-1">
      <film-switch checked>Wi-Fi</film-switch>
      <film-switch>Bluetooth</film-switch>
      <film-switch disabled>Airplane mode</film-switch>
      <p>
        The label can also come from the <code>label</code> property, the same way
        <code>film-input</code> and <code>film-select</code> take theirs.
      </p>
      <film-switch label="Location services"></film-switch>
    </film-stack>
  </film-box>
`
