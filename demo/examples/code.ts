import { html, type TemplateResult } from 'lit'

const snippet = `import '@mk/film'
import '@mk/film/css/themes/default/index.css'`

export const codeExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-code">Code</h3>
    <film-stack space="var(--s0)">
      <film-code code="npm i @mk/film lit"></film-code>
      <film-code code=${snippet}></film-code>
    </film-stack>
  </film-box>
`
