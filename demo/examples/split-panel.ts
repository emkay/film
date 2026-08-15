import { html, type TemplateResult } from 'lit'

export const splitPanelExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-split-panel">Split Panel</h3>
    <p>Drag the divider (or focus it and use the arrow keys) to resize.</p>
    <div style="block-size: 12rem; border: var(--border-thin) solid var(--film-color-border); border-radius: var(--film-radius-lg); overflow: hidden;">
      <film-split-panel position="40">
        <film-box slot="start"><p>Start pane</p></film-box>
        <film-box slot="end"><p>End pane</p></film-box>
      </film-split-panel>
    </div>
  </film-box>
`
