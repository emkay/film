import { html, type TemplateResult } from 'lit'

export const breadcrumbExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-breadcrumb">Breadcrumb</h3>
    <film-breadcrumb>
      <film-breadcrumb-item href="#/">Home</film-breadcrumb-item>
      <film-breadcrumb-item href="#/components">Components</film-breadcrumb-item>
      <film-breadcrumb-item current>Breadcrumb</film-breadcrumb-item>
    </film-breadcrumb>
  </film-box>
`
