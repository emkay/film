import { html, type TemplateResult } from 'lit'

export const coverExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-cover">Cover</h3>
    <p>Fills a minimum height and centres its principal content.</p>
    <film-box>
      <film-cover min-height="18rem">
        <h4 slot="top">Header</h4>
        <film-box><p>Centred content</p></film-box>
        <small slot="bottom">Footer</small>
      </film-cover>
    </film-box>
  </film-box>
`
