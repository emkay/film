import { html, type TemplateResult } from 'lit'

const openDrawer = (event: Event): void => {
  ;(event.currentTarget as HTMLElement).parentElement
    ?.querySelector('film-drawer')
    ?.show()
}

const closeDrawer = (event: Event): void => {
  ;(event.currentTarget as HTMLElement).closest('film-drawer')?.close()
}

export const drawerExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-drawer">Drawer</h3>
    <div>
      <film-button @click=${openDrawer}>Open drawer</film-button>
      <film-drawer label="Settings" placement="end">
        <film-stack>
          <film-switch checked>Dark mode</film-switch>
          <film-switch>Notifications</film-switch>
          <film-button @click=${closeDrawer}>Done</film-button>
        </film-stack>
      </film-drawer>
    </div>
  </film-box>
`
