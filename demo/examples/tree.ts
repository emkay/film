import { html, type TemplateResult } from 'lit'
import type { TreeItem } from '../../src/index.js'

// Lazily load a node's children when it's first expanded.
const loadChildren = (event: Event): void => {
  const item = (event as CustomEvent<{ item: TreeItem }>).detail.item
  item.loading = true
  setTimeout(() => {
    for (const name of ['draft.md', 'notes.md', 'todo.md']) {
      const child = document.createElement('film-tree-item')
      const label = document.createElement('span')
      label.slot = 'label'
      label.textContent = name
      child.appendChild(label)
      item.appendChild(child)
    }
    item.loading = false
  }, 700)
}

export const treeExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-tree">Tree</h3>
    <film-tree label="File system" @film-tree-expand=${loadChildren}>
      <film-tree-item expanded>
        <span slot="label">src</span>
        <film-tree-item>
          <span slot="label">components</span>
          <film-tree-item><span slot="label">button.ts</span></film-tree-item>
          <film-tree-item><span slot="label">box.ts</span></film-tree-item>
        </film-tree-item>
        <film-tree-item><span slot="label">index.ts</span></film-tree-item>
      </film-tree-item>
      <film-tree-item has-children>
        <span slot="label">documents (loads on expand)</span>
      </film-tree-item>
      <film-tree-item>
        <span slot="label">package.json</span>
      </film-tree-item>
    </film-tree>
  </film-box>
`
