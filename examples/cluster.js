import { html } from 'lit'

export default () => {
  return html`
    <film-box>
      <h3 id="film-components-cluster">Cluster</h3>
      <film-cluster>
        <p>This is a paragraph inside a cluster.</p>
        <p>This is another paragraph inside a cluster.</p>
        <p>Below are two boxes in a cluster.</p>
        <film-box>Hello</film-box>
        <film-box>World</film-box>
      </film-cluster>
    </film-box>`
}
