import { html, type TemplateResult } from 'lit'

export const paginationExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-pagination">Pagination</h3>
    <film-stack space="var(--s0)">
      <film-pagination total="10" page="3" label="Search results"></film-pagination>
      <film-pagination total="20" page="12" sibling-count="2" label="Archive"></film-pagination>
    </film-stack>
  </film-box>
`
