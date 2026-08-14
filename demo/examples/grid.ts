import { html, type TemplateResult } from 'lit'

export const gridExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-grid">Grid</h3>
    <p>Columns are created automatically; each is at least <code>min</code> wide.</p>
    <film-grid min="12rem">
      ${['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map(
        (n) => html`<film-box><p>${n}</p></film-box>`
      )}
    </film-grid>
  </film-box>
`
