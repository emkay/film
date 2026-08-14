import { html, type TemplateResult } from 'lit'

export const boxExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-box">Box</h3>
    <film-stack>
      <h4>Simple Box</h4>
      <film-box>
        <p>This is a box.</p>
      </film-box>
      <film-box>
        <p>This is another box.</p>
      </film-box>
      <film-box>
        <p>A box with multiple children and some longer text.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </film-box>

      <h4>Inverted Box</h4>
      <film-box invert>
        <p>This is an inverted box.</p>
      </film-box>

      <h4>Nested Box</h4>
      <film-box>
        <p>A Box</p>
        <film-box>
          <p>within a Box</p>
          <film-box>
            <p>within a Box.</p>
          </film-box>
        </film-box>
      </film-box>
    </film-stack>
  </film-box>
`
