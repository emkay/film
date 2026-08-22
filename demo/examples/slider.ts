import { html, type TemplateResult } from 'lit'

export const sliderExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-slider">Slider</h3>
    <film-stack space="var(--s1)">
      <film-slider label="Price range" show-values value-min="200" value-max="800" min="0" max="1000" step="50"></film-slider>
      <film-slider label="Opacity" show-values value-min="20" value-max="60"></film-slider>
    </film-stack>
  </film-box>
`
