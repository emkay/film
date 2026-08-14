import { html, type TemplateResult } from 'lit'

export const dropdownExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-dropdown">Dropdown</h3>
    <film-dropdown>
      <film-button slot="trigger">Actions ▾</film-button>
      <film-menu>
        <film-menu-item value="edit">Edit</film-menu-item>
        <film-menu-item value="duplicate">Duplicate</film-menu-item>
        <film-menu-item value="archive">Archive</film-menu-item>
        <film-menu-item value="delete" disabled>Delete</film-menu-item>
      </film-menu>
    </film-dropdown>
  </film-box>
`
