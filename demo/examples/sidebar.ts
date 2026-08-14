import { html, type TemplateResult } from 'lit'

export const sidebarExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-sidebar">Sidebar</h3>
    <film-stack>
      <film-sidebar>
        <input type="text" />
        <film-button>Search</film-button>
      </film-sidebar>
    </film-stack>
  </film-box>
`
