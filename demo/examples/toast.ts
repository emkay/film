import { html, type TemplateResult } from 'lit'
import { toast } from '../../src/index.js'

export const toastExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-toast">Toast</h3>
    <p>Transient notifications shown via the <code>toast()</code> helper.</p>
    <film-cluster>
      <film-button @click=${() => toast('Saved your changes.')}>Default</film-button>
      <film-button @click=${() => toast('Profile updated.', { variant: 'success' })}>Success</film-button>
      <film-button @click=${() => toast('Storage almost full.', { variant: 'warning' })}>Warning</film-button>
      <film-button @click=${() => toast('Something went wrong.', { variant: 'danger', duration: 0 })}>Sticky error</film-button>
    </film-cluster>
  </film-box>
`
