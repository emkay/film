import { html, type TemplateResult } from 'lit'

export const fieldExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-field">Field</h3>
    <p>Wraps a control with a label, hint, required marker and error message.</p>
    <film-stack space="var(--s0)">
      <film-field label="Full name" hint="As it appears on your ID.">
        <film-input name="name" placeholder="Ada Lovelace"></film-input>
      </film-field>
      <film-field label="Bio" hint="A sentence or two.">
        <film-textarea name="bio" auto-grow></film-textarea>
      </film-field>
      <film-field label="Newsletter">
        <film-checkbox name="news">Subscribe me</film-checkbox>
      </film-field>
    </film-stack>
  </film-box>
`
