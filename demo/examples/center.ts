import { html, type TemplateResult } from 'lit'

export const centerExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-center">Center</h3>
    <film-stack>
      <film-center>
        <film-box>
          <p>This is a box that is centered.</p>
        </film-box>
      </film-center>

      <film-box>
        <film-center>
          <p>Content is centered.</p>
        </film-center>
      </film-box>
    </film-stack>
  </film-box>
`
