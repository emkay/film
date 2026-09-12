import { html, type TemplateResult } from 'lit'

export const clusterExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-cluster">Cluster</h3>
    <film-stack>
      <film-cluster>
        <p>This is a paragraph inside a cluster.</p>
        <p>This is another paragraph inside a cluster.</p>
        <p>Below are two boxes in a cluster.</p>
        <film-box>Hello</film-box>
        <film-box>World</film-box>
      </film-cluster>

      <h4>justify</h4>
      <p>A heading with its action pushed to the opposite edge.</p>
      <film-cluster justify="space-between">
        <film-heading level="3">Members</film-heading>
        <film-button size="small">Invite</film-button>
      </film-cluster>

      <h4>align</h4>
      <film-cluster align="baseline">
        <film-text size="s2">Large</film-text>
        <film-text size="s0">Baseline-aligned</film-text>
        <film-text size="s-1">Small</film-text>
      </film-cluster>

      <h4>space</h4>
      <p>
        <code>space</code> takes a scale step or any CSS length — these two are
        equivalent.
      </p>
      <film-cluster space="s2">
        <film-box>s2</film-box>
        <film-box>step</film-box>
      </film-cluster>
      <film-cluster space="var(--s2)">
        <film-box>var(--s2)</film-box>
        <film-box>length</film-box>
      </film-cluster>
    </film-stack>
  </film-box>
`
