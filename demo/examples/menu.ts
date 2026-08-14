import { html, type TemplateResult } from 'lit'

export const menuExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-menu">Menu</h3>
    <film-menu style="max-inline-size: 16rem;">
      <film-menu-item value="new">New file</film-menu-item>
      <film-menu-item value="open">Open…</film-menu-item>
      <film-menu-item value="save">Save</film-menu-item>
      <film-menu-item value="export" disabled>Export (Pro)</film-menu-item>
    </film-menu>
  </film-box>
`
