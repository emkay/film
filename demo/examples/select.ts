import { html, type TemplateResult } from 'lit'

export const selectExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-select">Select</h3>
    <film-field label="Framework" hint="Pick your favourite.">
      <film-select name="framework" placeholder="Choose one…">
        <film-select-option value="lit">Lit</film-select-option>
        <film-select-option value="react">React</film-select-option>
        <film-select-option value="vue">Vue</film-select-option>
        <film-select-option value="svelte" disabled>Svelte (soon)</film-select-option>
      </film-select>
    </film-field>
  </film-box>
`
