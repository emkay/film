import { html, type TemplateResult } from 'lit'
import type { TableColumn, TableRow } from '../../src/index.js'

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'commits', label: 'Commits', align: 'end', sortable: true }
]

const rows: TableRow[] = [
  { name: 'Ada Lovelace', role: 'Author', commits: 128 },
  { name: 'Grace Hopper', role: 'Maintainer', commits: 96 },
  { name: 'Katherine Johnson', role: 'Reviewer', commits: 42 }
]

const bigColumns: TableColumn[] = [
  { key: 'id', label: '#', align: 'end' },
  { key: 'name', label: 'File', sortable: true },
  { key: 'size', label: 'Size', align: 'end', sortable: true }
]

const bigRows: TableRow[] = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `file-${String(i + 1).padStart(4, '0')}.log`,
  size: `${(i * 7) % 900} KB`
}))

export const tableExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-table">Table</h3>
    <film-stack>
      <div>
        <p>Click a column header to sort; tick rows to select.</p>
        <film-table caption="Contributors" selectable .columns=${columns} .rows=${rows}></film-table>
      </div>
      <div>
        <h4>Virtualised (5,000 rows)</h4>
        <p>Only the visible rows are rendered; the header stays put.</p>
        <film-table
          virtualized
          sticky-header
          row-height="34"
          style="block-size: 16rem;"
          .columns=${bigColumns}
          .rows=${bigRows}
        ></film-table>
      </div>
    </film-stack>
  </film-box>
`
