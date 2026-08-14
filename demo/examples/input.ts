import { html, type TemplateResult } from 'lit'

export const inputExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-input">Input</h3>
    <film-stack space="var(--s0)">
      <film-input label="Name" placeholder="Ada Lovelace"></film-input>
      <film-input label="Email" type="email" placeholder="ada@example.com" required></film-input>
      <film-input label="Password" type="password"></film-input>
    </film-stack>
  </film-box>
`
