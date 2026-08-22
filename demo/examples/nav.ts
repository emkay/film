import { html, type TemplateResult } from 'lit'

export const navExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-nav">Nav</h3>
    <film-nav label="Docs" style="max-inline-size: 16rem;">
      <film-nav-item href="#/nav" active>Overview</film-nav-item>
      <film-nav-item href="#/components">Components</film-nav-item>
      <film-nav-item href="#/theming">Theming</film-nav-item>
      <film-nav-item href="#/roadmap">Roadmap</film-nav-item>
    </film-nav>
  </film-box>
`
