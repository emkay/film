import { html, type TemplateResult } from 'lit'

export const inputExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-input">Input</h3>
    <film-stack space="s0">
      <film-input label="Name" placeholder="Ada Lovelace"></film-input>
      <film-input label="Email" type="email" placeholder="ada@example.com" required></film-input>
      <film-input label="Password" type="password"></film-input>
      <p>
        Set <code>autocomplete</code> so password managers recognise a sign-in
        pair rather than guessing from the input <code>type</code>.
      </p>
      <film-input label="Username" autocomplete="username"></film-input>
      <film-input
        label="Password"
        type="password"
        autocomplete="current-password"
      ></film-input>
    </film-stack>
  </film-box>
`
