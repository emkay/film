import { html, type TemplateResult } from 'lit'

export const proseExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-prose">Prose</h3>
    <film-prose>
      <h2>Long-form content</h2>
      <p>
        Prose constrains the line length to a readable measure and adds even
        vertical rhythm between blocks, so articles and documentation read well
        without per-element styling.
      </p>
      <p>Paragraphs are spaced by the modular scale, and <a href="#/prose">links</a> pick up the theme colour.</p>
      <blockquote>Design is not just what it looks like — it's how it works.</blockquote>
    </film-prose>
  </film-box>
`
