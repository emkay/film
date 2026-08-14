import { html, type TemplateResult } from 'lit'

export const alertExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-alert">Alert</h3>
    <film-stack space="var(--s0)">
      <film-alert variant="info">Heads up — this is some information.</film-alert>
      <film-alert variant="success">Saved successfully.</film-alert>
      <film-alert variant="warning">Careful, this needs your attention.</film-alert>
      <film-alert variant="danger">Something went wrong.</film-alert>
    </film-stack>
  </film-box>
`
