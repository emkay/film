import { html, type TemplateResult } from 'lit'

export const textExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-text">Text</h3>
    <film-stack space="var(--s-1)">
      <film-text size="s1">Larger body text on the modular scale.</film-text>
      <film-text>Default body text.</film-text>
      <film-text weight="600">Semibold body text.</film-text>
      <film-text tone="muted" size="s-1">Muted small print for secondary info.</film-text>
    </film-stack>
  </film-box>
`
