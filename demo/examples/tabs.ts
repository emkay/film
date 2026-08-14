import { html, type TemplateResult } from 'lit'

export const tabsExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-tabs">Tabs</h3>
    <film-tabs>
      <film-tab slot="nav" panel="overview">Overview</film-tab>
      <film-tab slot="nav" panel="specs">Specs</film-tab>
      <film-tab slot="nav" panel="reviews">Reviews</film-tab>
      <film-tab-panel name="overview"><p>A quick overview of the product.</p></film-tab-panel>
      <film-tab-panel name="specs"><p>The technical specifications.</p></film-tab-panel>
      <film-tab-panel name="reviews"><p>What customers are saying.</p></film-tab-panel>
    </film-tabs>
  </film-box>
`
