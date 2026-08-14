import { html, type TemplateResult } from 'lit'

export const detailsExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-details">Details</h3>
    <film-stack space="var(--s-1)">
      <film-details summary="What is Film?" open>
        <p>Film is an opinionated Lit component library built on a modular scale.</p>
      </film-details>
      <film-details summary="Is it accessible?">
        <p>Components ship with sensible ARIA roles and keyboard support.</p>
      </film-details>
    </film-stack>
  </film-box>
`
