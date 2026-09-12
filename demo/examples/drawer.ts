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
    <p>
      The body scrolls when the content is taller than the panel, so the Done
      button below stays reachable.
    </p>
    <div>
      <film-button @click=${openDrawer}>Open drawer</film-button>
      <film-drawer label="Settings" placement="end">
        <film-stack>
          <film-switch checked>Dark mode</film-switch>
          <film-switch>Notifications</film-switch>
          ${Array.from(
            { length: 20 },
            (_, i) => html`<film-switch label=${`Option ${String(i + 1)}`}></film-switch>`
          )}
          <film-button @click=${closeDrawer}>Done</film-button>
        </film-stack>
      </film-drawer>
    </div>
  </film-box>
`
