import { html, type TemplateResult } from 'lit'
import type { TableColumn, TableRow } from '../../src/index.js'

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'commits', label: 'Commits', align: 'end' }
]

const rows: TableRow[] = [
  { name: 'Ada Lovelace', role: 'Author', commits: 128 },
  { name: 'Grace Hopper', role: 'Maintainer', commits: 96 },
  { name: 'Katherine Johnson', role: 'Reviewer', commits: 42 }
]

export const tableExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-table">Table</h3>
    <film-table caption="Contributors" .columns=${columns} .rows=${rows}></film-table>
  </film-box>
`
