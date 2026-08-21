import { html, type TemplateResult } from 'lit'

export const accordionExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-accordion">Accordion</h3>
    <film-accordion>
      <film-accordion-item summary="What is Film?" open>
        <p>An opinionated Lit component library built on a modular scale.</p>
      </film-accordion-item>
      <film-accordion-item summary="Is it accessible?">
        <p>Components ship with sensible ARIA roles and keyboard support.</p>
      </film-accordion-item>
      <film-accordion-item summary="Can I theme it?">
        <p>Yes — override the <code>--film-color-*</code> tokens, or switch palettes.</p>
      </film-accordion-item>
    </film-accordion>
  </film-box>
`
