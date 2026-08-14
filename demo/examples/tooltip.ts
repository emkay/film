import { html, type TemplateResult } from 'lit'

export const tooltipExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-tooltip">Tooltip</h3>
    <film-cluster>
      <film-tooltip content="Saves your changes">
        <film-button>Hover me</film-button>
      </film-tooltip>
      <film-tooltip content="Appears below" placement="bottom">
        <film-button>And me</film-button>
      </film-tooltip>
    </film-cluster>
  </film-box>
`
