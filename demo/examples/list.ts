import { html, type TemplateResult } from 'lit'

export const listExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-list">List</h3>
    <film-list bordered>
      <film-list-item>
        <film-avatar slot="start" label="Ada Lovelace"></film-avatar>
        Ada Lovelace
        <film-badge slot="end" variant="accent">Owner</film-badge>
      </film-list-item>
      <film-list-item>
        <film-avatar slot="start" label="Grace Hopper"></film-avatar>
        Grace Hopper
        <film-badge slot="end">Editor</film-badge>
      </film-list-item>
      <film-list-item href="#/">
        <film-avatar slot="start" label="Katherine Johnson"></film-avatar>
        Katherine Johnson
        <film-badge slot="end">Viewer</film-badge>
      </film-list-item>
    </film-list>
  </film-box>
`
