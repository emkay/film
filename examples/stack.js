import { html } from 'lit'

export default () => {
  return html`
    <film-box>
      <h2 id="film-components-stack">Stack</h2>
      <film-stack>
        <p>This is an example of a paragraph in a Stack.</p>
        <p>This is the second paragraph. This should stack and have some space between it and the first paragraph.</p>
        <p>This is the third paragraph. This should stack and have some space between it and the second paragraph.</p>

        <h3>Usage</h3>
        <pre>
          <code class="language-css">p { color: red }</code>
        </pre>
      </film-stack>
    </film-box>`
}
