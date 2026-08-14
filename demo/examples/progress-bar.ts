import { html, type TemplateResult } from 'lit'

export const progressBarExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-progress-bar">Progress Bar</h3>
    <film-stack space="var(--s0)">
      <film-progress-bar label="Upload" value="35"></film-progress-bar>
      <film-progress-bar label="Download" value="80"></film-progress-bar>
      <film-progress-bar label="Working" indeterminate></film-progress-bar>
    </film-stack>
  </film-box>
`
