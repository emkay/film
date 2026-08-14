import { html, type TemplateResult } from 'lit'

export const copyButtonExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-copy-button">Copy Button</h3>
    <film-cluster>
      <film-copy-button value="npm i @mk/film">Copy install command</film-copy-button>
      <code>npm i @mk/film</code>
    </film-cluster>
  </film-box>
`
