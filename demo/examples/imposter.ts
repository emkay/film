import { html, type TemplateResult } from 'lit'

export const imposterExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-imposter">Imposter</h3>
    <p>Overlays content centred on a positioned ancestor.</p>
    <div style="position: relative; min-height: 12rem;">
      <film-box><p>Positioned container</p></film-box>
      <film-imposter contain margin="var(--s1)">
        <film-box invert><p>I am the imposter</p></film-box>
      </film-imposter>
    </div>
  </film-box>
`
