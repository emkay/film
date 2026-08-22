import { html, type TemplateResult } from 'lit'

export const headingExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-heading">Heading</h3>
    <film-stack space="var(--s-1)">
      <film-heading level="1">Heading level 1</film-heading>
      <film-heading level="2">Heading level 2</film-heading>
      <film-heading level="3">Heading level 3</film-heading>
      <film-heading level="4">Heading level 4</film-heading>
    </film-stack>
  </film-box>
`
