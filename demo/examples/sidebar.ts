import { html, type TemplateResult } from 'lit'

export const sidebarExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-sidebar">Sidebar</h3>
    <film-stack>
      <film-sidebar>
        <film-input aria-label="Search the docs"></film-input>
        <film-button>Search</film-button>
      </film-sidebar>
    </film-stack>
  </film-box>
`
