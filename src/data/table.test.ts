import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './table.js'
import type { Table, TableColumn, TableRow } from './table.js'

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'n', label: 'N', sortable: true }
]

const rows: TableRow[] = [
  { name: 'b', n: 2 },
  { name: 'a', n: 3 },
  { name: 'c', n: 1 }
]

describe('film-table', () => {
  it('renders a row per data item', async () => {
    const el = await fixture<Table>(html`<film-table .columns=${columns} .rows=${rows}></film-table>`)
    expect(el.shadowRoot?.querySelectorAll('tbody tr').length).to.equal(3)
  })

  it('sorts ascending when a sortable header is clicked', async () => {
    const el = await fixture<Table>(html`<film-table .columns=${columns} .rows=${rows}></film-table>`)
    ;(el.shadowRoot?.querySelector('.sort') as HTMLButtonElement).click()
    await el.updateComplete
    const first = el.shadowRoot?.querySelector('tbody tr td')?.textContent
    expect(first).to.equal('a')
  })

  it('emits film-selection-change with the selected rows', async () => {
    const el = await fixture<Table>(
      html`<film-table selectable .columns=${columns} .rows=${rows}></film-table>`
    )
    const checkbox = el.shadowRoot?.querySelectorAll('tbody input[type="checkbox"]')[0] as HTMLInputElement
    setTimeout(() => checkbox.click())
    const event = await oneEvent(el, 'film-selection-change')
    expect(event.detail.rows.length).to.equal(1)
  })
})
