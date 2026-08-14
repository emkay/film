import { html, type TemplateResult } from 'lit'

export const treeExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-tree">Tree</h3>
    <film-tree label="File system">
      <film-tree-item expanded>
        <span slot="label">src</span>
        <film-tree-item>
          <span slot="label">components</span>
          <film-tree-item><span slot="label">button.ts</span></film-tree-item>
          <film-tree-item><span slot="label">box.ts</span></film-tree-item>
        </film-tree-item>
        <film-tree-item><span slot="label">index.ts</span></film-tree-item>
      </film-tree-item>
      <film-tree-item>
        <span slot="label">package.json</span>
      </film-tree-item>
    </film-tree>
  </film-box>
`
