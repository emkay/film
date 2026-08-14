import { html, type TemplateResult } from 'lit'

const openDialog = (event: Event): void => {
  ;(event.currentTarget as HTMLElement).parentElement
    ?.querySelector('film-dialog')
    ?.show()
}

const closeDialog = (event: Event): void => {
  ;(event.currentTarget as HTMLElement).closest('film-dialog')?.close()
}

export const dialogExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-dialog">Dialog</h3>
    <div>
      <film-button @click=${openDialog}>Open dialog</film-button>
      <film-dialog label="Confirm">
        <span slot="header">Delete file?</span>
        <p>This action cannot be undone.</p>
        <film-cluster slot="footer">
          <film-button @click=${closeDialog}>Cancel</film-button>
          <film-button invert @click=${closeDialog}>Delete</film-button>
        </film-cluster>
      </film-dialog>
    </div>
  </film-box>
`
