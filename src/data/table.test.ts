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

  it('drops selection for rows that are no longer present', async () => {
    const el = await fixture<Table>(
      html`<film-table selectable .columns=${columns} .rows=${rows}></film-table>`
    )
    const boxes = el.shadowRoot?.querySelectorAll('tbody input[type="checkbox"]') as NodeListOf<HTMLInputElement>
    boxes[1].click()
    boxes[2].click()
    await el.updateComplete

    el.rows = [{ name: 'z', n: 9 }]
    await el.updateComplete
    const all = el.shadowRoot?.querySelector('thead input[type="checkbox"]') as HTMLInputElement
    expect(all.indeterminate).to.equal(false)
    expect(all.checked).to.equal(false)

    const box = el.shadowRoot?.querySelector('tbody input[type="checkbox"]') as HTMLInputElement
    setTimeout(() => box.click())
    const event = await oneEvent(el, 'film-selection-change')
    expect(event.detail.rows).to.deep.equal([{ name: 'z', n: 9 }])
  })

  it('keeps selection attached to the same row objects when rows are reordered', async () => {
    const data = [...rows]
    const el = await fixture<Table>(
      html`<film-table selectable .columns=${columns} .rows=${data}></film-table>`
    )
    const first = el.shadowRoot?.querySelector('tbody input[type="checkbox"]') as HTMLInputElement
    first.click()
    await el.updateComplete

    el.rows = [data[2], data[1], data[0]]
    await el.updateComplete
    const boxes = el.shadowRoot?.querySelectorAll('tbody input[type="checkbox"]') as NodeListOf<HTMLInputElement>
    expect(Array.from(boxes).map((b) => b.checked)).to.deep.equal([false, false, true])
  })

  describe('row-key', () => {
    const people = (): TableRow[] => [
      { id: 1, name: 'Ada', n: 3 },
      { id: 2, name: 'Grace', n: 1 },
      { id: 3, name: 'Alan', n: 2 }
    ]
    const keyed: TableColumn[] = [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'n', label: 'N', sortable: true }
    ]
    const bodyBoxes = (el: Table): HTMLInputElement[] =>
      Array.from(el.shadowRoot?.querySelectorAll('tbody input[type="checkbox"]') ?? [])
    const headerBox = (el: Table): HTMLInputElement =>
      el.shadowRoot?.querySelector('thead input[type="checkbox"]') as HTMLInputElement

    async function keyedTable (): Promise<Table> {
      return fixture<Table>(
        html`<film-table selectable row-key="id" .columns=${keyed} .rows=${people()}></film-table>`
      )
    }

    it('keeps selection when rows are refetched as new objects', async () => {
      const el = await keyedTable()
      bodyBoxes(el)[1].click()
      await el.updateComplete

      el.rows = people()
      await el.updateComplete
      expect(bodyBoxes(el).map((b) => b.checked)).to.deep.equal([false, true, false])
      expect(headerBox(el).indeterminate).to.equal(true)
    })

    it('does not report a selection change when a refetch keeps every selected key', async () => {
      const el = await keyedTable()
      bodyBoxes(el)[0].click()
      await el.updateComplete
      let events = 0
      el.addEventListener('film-selection-change', () => { events += 1 })

      el.rows = people()
      await el.updateComplete
      expect(events).to.equal(0)
    })

    it('reports the current row objects, not the ones that were clicked', async () => {
      const el = await keyedTable()
      bodyBoxes(el)[0].click()
      await el.updateComplete

      const fresh = people()
      fresh[0].name = 'Ada Lovelace'
      el.rows = fresh
      await el.updateComplete
      setTimeout(() => bodyBoxes(el)[2].click())
      const event = await oneEvent(el, 'film-selection-change')
      expect(event.detail.rows).to.deep.equal([fresh[0], fresh[2]])
      expect(event.detail.rows[0]).to.equal(fresh[0])
    })

    it('drops keys that are no longer present and reports it', async () => {
      const el = await keyedTable()
      bodyBoxes(el)[0].click()
      bodyBoxes(el)[1].click()
      await el.updateComplete

      setTimeout(() => { el.rows = people().filter((row) => row.id !== 1) })
      const event = await oneEvent(el, 'film-selection-change')
      expect(event.detail.rows.map((row: TableRow) => row.id)).to.deep.equal([2])
    })

    it('keeps selection on the same rows through a sort', async () => {
      const el = await keyedTable()
      bodyBoxes(el)[1].click() // Grace
      await el.updateComplete

      ;(el.shadowRoot?.querySelector('.sort') as HTMLButtonElement).click() // by name
      await el.updateComplete
      const names = Array.from(el.shadowRoot?.querySelectorAll('tbody tr') ?? []).map(
        (tr) => tr.querySelectorAll('td')[1].textContent
      )
      const checked = bodyBoxes(el).map((b) => b.checked)
      expect(names[checked.indexOf(true)]).to.equal('Grace')
    })

    it('falls back to identity for a row without the key field', async () => {
      const loose = { name: 'No id', n: 0 }
      const el = await fixture<Table>(
        html`<film-table selectable row-key="id" .columns=${keyed} .rows=${[...people(), loose]}></film-table>`
      )
      bodyBoxes(el)[3].click()
      await el.updateComplete

      el.rows = [...people(), loose]
      await el.updateComplete
      expect(bodyBoxes(el)[3].checked, 'same object, still selected').to.equal(true)

      el.rows = [...people(), { name: 'No id', n: 0 }]
      await el.updateComplete
      expect(bodyBoxes(el)[3].checked, 'a new object has no key to match').to.equal(false)
    })

    it('re-checks the selection when row-key itself changes', async () => {
      const el = await keyedTable()
      bodyBoxes(el)[0].click()
      await el.updateComplete

      setTimeout(() => { el.rowKey = 'name' })
      const event = await oneEvent(el, 'film-selection-change')
      // The stored key was an id; under `name` nothing matches it any more.
      expect(event.detail.rows).to.deep.equal([])
    })

    it('selects every row with the header checkbox, surviving a refetch', async () => {
      const el = await keyedTable()
      headerBox(el).click()
      await el.updateComplete

      el.rows = people()
      await el.updateComplete
      expect(headerBox(el).checked).to.equal(true)
      expect(bodyBoxes(el).every((b) => b.checked)).to.equal(true)
    })
  })
})
