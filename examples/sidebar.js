import { html } from 'lit'

export default () => {
  return html`
    <film-box>
      <h3 id="film-components-sidebar">Sidebar</h3>
      <film-stack>
        <film-sidebar>
          <input type="text"/>
          <film-button>Search</flim-button>
        </film-sidebar>
      </film-stack>
    </film-box>
  `
}
