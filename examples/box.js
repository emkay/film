import { html } from 'lit'

export default () => {
  return html`
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
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </film-box>

        <h4>Inverted Box</h4>
        <film-box ?invert=${true}>
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
    </film-box>`
}
