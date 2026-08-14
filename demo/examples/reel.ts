import { html, type TemplateResult } from 'lit'

export const reelExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-reel">Reel</h3>
    <p>A horizontally scrolling strip with scroll snapping.</p>
    <film-reel item-width="12rem">
      ${['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'].map(
        (n) => html`<film-box><p>${n}</p></film-box>`
      )}
    </film-reel>
  </film-box>
`
