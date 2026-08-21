import { css, html, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

export interface TableColumn {
  key: string
  label: string
  align?: 'start' | 'center' | 'end'
  /** Allow sorting by this column. */
  sortable?: boolean
}

export type TableRow = Record<string, unknown>

/**
 * Table — a themed, data-driven table with optional sorting, row selection and
 * a sticky header. Provide `columns` and `rows` as properties.
 *
 * @fires film-sort - When the sort changes. `detail` is `{ key, direction }`.
 * @fires film-selection-change - When row selection changes. `detail.rows` is the selected rows.
 */
@customElement('film-table')
export class Table extends FilmElement {
  /** The column definitions. */
  @property({ attribute: false }) columns: TableColumn[] = []

  /** The row data, keyed by column `key`. */
  @property({ attribute: false }) rows: TableRow[] = []

  /** An optional caption. */
  @property({ type: String }) caption = ''

  /** Show a checkbox column for selecting rows. */
  @property({ type: Boolean }) selectable = false

  /** Keep the header visible while the body scrolls. */
  @property({ type: Boolean, reflect: true, attribute: 'sticky-header' }) stickyHeader = false

  @state() private sortKey: string | null = null
  @state() private sortDir: 'asc' | 'desc' = 'asc'
  @state() private selected = new Set<number>()

  static styles = css`
    :host {
      display: block;
      overflow-x: auto;
    }

    :host([sticky-header]) {
      overflow: auto;
    }

    table {
      inline-size: 100%;
      border-collapse: collapse;
      color: var(--film-color-text);
    }

    caption {
      text-align: start;
      padding-block-end: var(--s-1);
      font-size: var(--s-1);
      opacity: 0.8;
    }

    th,
    td {
      padding: var(--s-2) var(--s0);
      text-align: start;
      border-block-end: var(--border-thin) solid var(--film-color-border);
    }

    th {
      font-weight: 600;
      border-block-end-width: var(--border-thick);
    }

    :host([sticky-header]) thead th {
      position: sticky;
      inset-block-start: 0;
      background-color: var(--film-color-surface);
      z-index: 1;
    }

    tbody tr:hover {
      background-color: var(--film-color-info);
    }

    .sort {
      display: inline-flex;
      align-items: center;
      gap: var(--s-3);
      font: inherit;
      font-weight: inherit;
      color: inherit;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }

    .sort:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
    }

    td[data-align='center'],
    th[data-align='center'] {
      text-align: center;
    }

    td[data-align='end'],
    th[data-align='end'] {
      text-align: end;
    }
  `

  private get displayRows (): Array<{ row: TableRow; index: number }> {
    const rows = this.rows.map((row, index) => ({ row, index }))
    if (!this.sortKey) return rows
    const key = this.sortKey
    const dir = this.sortDir === 'asc' ? 1 : -1
    return rows.sort((a, b) => {
      const av = a.row[key]
      const bv = b.row[key]
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av ?? '').localeCompare(String(bv ?? '')) * dir
    })
  }

  private toggleSort (key: string): void {
    if (this.sortKey === key) {
      if (this.sortDir === 'asc') this.sortDir = 'desc'
      else this.sortKey = null
    } else {
      this.sortKey = key
      this.sortDir = 'asc'
    }
    this.dispatchEvent(
      new CustomEvent('film-sort', {
        detail: { key: this.sortKey, direction: this.sortKey ? this.sortDir : null },
        bubbles: true
      })
    )
  }

  private get allSelected (): boolean {
    return this.rows.length > 0 && this.selected.size === this.rows.length
  }

  private toggleAll (checked: boolean): void {
    this.selected = checked ? new Set(this.rows.map((_, index) => index)) : new Set()
    this.emitSelection()
  }

  private toggleRow (index: number): void {
    const next = new Set(this.selected)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    this.selected = next
    this.emitSelection()
  }

  private emitSelection (): void {
    const rows = Array.from(this.selected)
      .sort((a, b) => a - b)
      .map((index) => this.rows[index])
    this.dispatchEvent(new CustomEvent('film-selection-change', { detail: { rows }, bubbles: true }))
  }

  private sortIndicator (key: string): string {
    if (this.sortKey !== key) return ''
    return this.sortDir === 'asc' ? ' ▲' : ' ▼'
  }

  render () {
    const someSelected = this.selected.size > 0 && !this.allSelected
    return html`
      <table>
        ${this.caption ? html`<caption>${this.caption}</caption>` : nothing}
        <thead>
          <tr>
            ${this.selectable
              ? html`<th scope="col">
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    .checked=${this.allSelected}
                    .indeterminate=${someSelected}
                    @change=${(e: Event) => this.toggleAll((e.target as HTMLInputElement).checked)}
                  />
                </th>`
              : nothing}
            ${this.columns.map(
              (column) => html`
                <th
                  scope="col"
                  data-align=${column.align ?? nothing}
                  aria-sort=${this.sortKey === column.key
                    ? this.sortDir === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : nothing}
                >
                  ${column.sortable
                    ? html`<button class="sort" @click=${() => this.toggleSort(column.key)}>
                        ${column.label}<span aria-hidden="true">${this.sortIndicator(column.key)}</span>
                      </button>`
                    : column.label}
                </th>
              `
            )}
          </tr>
        </thead>
        <tbody>
          ${this.displayRows.map(
            ({ row, index }) => html`
              <tr>
                ${this.selectable
                  ? html`<td>
                      <input
                        type="checkbox"
                        aria-label="Select row"
                        .checked=${this.selected.has(index)}
                        @change=${() => this.toggleRow(index)}
                      />
                    </td>`
                  : nothing}
                ${this.columns.map(
                  (column) => html`<td data-align=${column.align ?? nothing}>${String(row[column.key] ?? '')}</td>`
                )}
              </tr>
            `
          )}
        </tbody>
      </table>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-table': Table
  }
}
