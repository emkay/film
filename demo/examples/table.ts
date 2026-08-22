import { html, type TemplateResult } from 'lit'
import { toast, type TableColumn, type TableRow } from '../../src/index.js'

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

const navColumns: TableColumn[] = [
  { key: 'name', label: 'Folder', sortable: true },
  { key: 'count', label: 'Unread', align: 'end', sortable: true },
  {
    key: 'status',
    label: 'Sync',
    render: (value) =>
      html`<film-tag variant=${value === 'synced' ? 'success' : 'warning'}>${value}</film-tag>`
  }
]

const navRows: TableRow[] = [
  { name: 'Inbox', count: 12, status: 'synced' },
  { name: 'Drafts', count: 2, status: 'pending' },
  { name: 'Archive', count: 0, status: 'synced' }
]

const onActivate = (event: Event): void => {
  const { row } = (event as CustomEvent<{ row: TableRow }>).detail
  toast(`Opened ${String(row.name)}`)
}

export const tableExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-table">Table</h3>
    <film-stack>
      <div>
        <p>Click a column header to sort; tick rows to select.</p>
        <film-table caption="Contributors" selectable .columns=${columns} .rows=${rows}></film-table>
      </div>
      <div>
        <h4>Activatable rows</h4>
        <p>Rows are focusable and clickable — <code>film-row-activate</code> fires with the row. A
        column's <code>render</code> can return any content, like the status tag below.</p>
        <film-table
          activatable
          caption="Mailboxes"
          .columns=${navColumns}
          .rows=${navRows}
          @film-row-activate=${onActivate}
        ></film-table>
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
