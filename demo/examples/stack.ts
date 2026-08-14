import { html, type TemplateResult } from 'lit'

export const stackExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-stack">Stack</h3>
    <film-stack>
      <p>This is an example of a paragraph in a Stack.</p>
      <p>This is the second paragraph. This should stack and have some space between it and the first paragraph.</p>
      <p>This is the third paragraph. This should stack and have some space between it and the second paragraph.</p>

      <h4>Usage</h4>
      <pre><code class="language-html">&lt;film-stack&gt;
  &lt;p&gt;One&lt;/p&gt;
  &lt;p&gt;Two&lt;/p&gt;
&lt;/film-stack&gt;</code></pre>
    </film-stack>
  </film-box>
`
