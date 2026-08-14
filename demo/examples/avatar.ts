import { html, type TemplateResult } from 'lit'

const face =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='100%25' height='100%25' fill='%23052528'/%3E%3Ccircle cx='48' cy='38' r='18' fill='%23D7FAEB'/%3E%3Ccircle cx='48' cy='92' r='30' fill='%23D7FAEB'/%3E%3C/svg%3E"

export const avatarExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-avatar">Avatar</h3>
    <film-cluster>
      <film-avatar label="Ada Lovelace" src=${face}></film-avatar>
      <film-avatar label="Ada Lovelace"></film-avatar>
      <film-avatar label="Grace Hopper" shape="square"></film-avatar>
      <film-avatar label="Katherine Johnson" size="var(--s4)"></film-avatar>
    </film-cluster>
  </film-box>
`
