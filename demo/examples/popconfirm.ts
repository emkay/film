import { html, type TemplateResult } from 'lit'
import { toast } from '../../src/index.js'

export const popconfirmExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-popconfirm">Popconfirm</h3>
    <film-popconfirm
      message="Delete this item? This can't be undone."
      confirm-label="Delete"
      @film-confirm=${() => toast('Item deleted.', { variant: 'danger' })}
      @film-cancel=${() => toast('Cancelled.')}
    >
      <film-button slot="trigger" invert>Delete</film-button>
    </film-popconfirm>
  </film-box>
`
