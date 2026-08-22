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

  it('fires film-row-activate on row click when activatable', async () => {
    const el = await fixture<Table>(
      html`<film-table activatable .columns=${columns} .rows=${rows}></film-table>`
    )
    const firstRow = el.shadowRoot?.querySelector('tbody tr') as HTMLTableRowElement
    setTimeout(() => firstRow.click())
    const event = await oneEvent(el, 'film-row-activate')
    expect(event.detail.index).to.equal(0)
    expect(event.detail.row).to.equal(rows[0])
  })

  it('does not activate a row when its select checkbox is clicked', async () => {
    const el = await fixture<Table>(
      html`<film-table activatable selectable .columns=${columns} .rows=${rows}></film-table>`
    )
    let activated = false
    el.addEventListener('film-row-activate', () => {
      activated = true
    })
    const checkbox = el.shadowRoot?.querySelector('tbody input[type="checkbox"]') as HTMLInputElement
    checkbox.click()
    await el.updateComplete
    expect(activated).to.equal(false)
  })

  it('renders custom cell content via column.render', async () => {
    const cols: TableColumn[] = [
      { key: 'name', label: 'Name' },
      { key: 'n', label: 'Action', render: (_v, row) => html`<button type="button">Go ${row.name}</button>` }
    ]
    const el = await fixture<Table>(html`<film-table .columns=${cols} .rows=${rows}></film-table>`)
    const button = el.shadowRoot?.querySelector('tbody button')
    expect(button).to.exist
    expect(button?.textContent).to.contain('Go b')
  })

  it('only renders a window of rows when virtualized', async () => {
    const many: TableRow[] = Array.from({ length: 1000 }, (_, i) => ({ name: `row ${i}` }))
    const el = await fixture<Table>(html`
      <film-table
        virtualized
        row-height="20"
        style="display:block;height:200px"
        .columns=${[{ key: 'name', label: 'Name' }]}
        .rows=${many}
      ></film-table>
    `)
    await el.updateComplete
    await el.updateComplete
    const dataRows = el.shadowRoot?.querySelectorAll('tbody tr:not([aria-hidden])') ?? []
    expect(dataRows.length).to.be.greaterThan(0)
    expect(dataRows.length).to.be.lessThan(60)
    expect(el.shadowRoot?.querySelector('table')?.getAttribute('aria-rowcount')).to.equal('1001')
  })
})
