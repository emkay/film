import { html, type TemplateResult } from 'lit'

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='100%25' height='100%25' fill='%230B2B55'/%3E%3Ccircle cx='200' cy='200' r='120' fill='%23F4D4AA'/%3E%3C/svg%3E"

export const frameExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-frame">Frame</h3>
    <p>Crops media to a fixed aspect ratio without distortion.</p>
    <film-frame ratio="16:9">
      <img src=${placeholder} alt="A square image cropped to 16:9" />
    </film-frame>
  </film-box>
`
