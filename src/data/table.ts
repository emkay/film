import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

export interface TableColumn {
  key: string
  label: string
  align?: 'start' | 'center' | 'end'
  /** Allow sorting by this column. */
  sortable?: boolean
  /**
   * Custom cell renderer — return a string, a Lit `TemplateResult`, or a DOM
   * node (e.g. to inject a control). Receives the raw value, the row, and its
   * index. Without it the raw `row[key]` value is rendered directly.
   */
  render?: (value: unknown, row: TableRow, index: number) => unknown
}

export type TableRow = Record<string, unknown>

interface IndexedRow {
  row: TableRow
  index: number
}

const OVERSCAN = 4

/**
 * Table — a themed, data-driven table with optional sorting, row selection, a
 * sticky header, and opt-in row virtualisation for large datasets. Provide
 * `columns` and `rows` as properties.
 *
 * For `virtualized`, give the table a bounded height (e.g. `style="height:20rem"`)
 * so it scrolls; a fixed `row-height` drives the windowing. Pair it with
 * `sticky-header` for the best result.
 *
 * Cells render the raw `row[key]` value directly, so a `TemplateResult` or DOM
 * node passes through; use `column.render` for a per-column cell renderer. Set
 * `activatable` to make rows focusable and clickable (fires `film-row-activate`).
 *
 * @fires film-sort - When the sort changes. `detail` is `{ key, direction }`.
 * @fires film-selection-change - When row selection changes. `detail.rows` is the selected rows.
 * @fires film-row-activate - When an activatable row is clicked or Enter/Space is pressed. `detail` is `{ row, index }`.
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

  /** Make rows focusable and activatable (click / Enter / Space) — fires `film-row-activate`. */
  @property({ type: Boolean, reflect: true }) activatable = false

  /** Keep the header visible while the body scrolls. */
  @property({ type: Boolean, reflect: true, attribute: 'sticky-header' }) stickyHeader = false

  /** Only render the visible rows (needs a bounded height + fixed `row-height`). */
  @property({ type: Boolean, reflect: true }) virtualized = false

  /** Fixed row height in pixels, used for virtualisation. */
  @property({ type: Number, attribute: 'row-height' }) rowHeight = 36

  @state() private sortKey: string | null = null
  @state() private sortDir: 'asc' | 'desc' = 'asc'
  @state() private selected = new Set<number>()
  @state() private scrollOffset = 0

  private resizeObserver?: ResizeObserver
  private rafPending = false

  static styles = css`
    :host {
      display: block;
      overflow-x: auto;
    }

    :host([sticky-header]),
    :host([virtualized]) {
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

    :host([activatable]) tbody tr {
      cursor: pointer;
    }

    :host([activatable]) tbody tr:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: -2px;
    }

    :host([virtualized]) tbody tr {
      block-size: var(--film-row-height, 36px);
    }

    :host([virtualized]) td {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
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

  connectedCallback (): void {
    super.connectedCallback()
    if (this.virtualized) this.enableVirtual()
  }

  disconnectedCallback (): void {
    this.disableVirtual()
    super.disconnectedCallback()
  }

  firstUpdated (): void {
    // Re-render now that clientHeight is known, so the initial window is right.
    if (this.virtualized) this.requestUpdate()
  }

  updated (changed: PropertyValues<this>): void {
    super.updated(changed)
    if (changed.has('rowHeight')) this.style.setProperty('--film-row-height', `${this.rowHeight}px`)
    if (changed.has('virtualized')) {
      if (this.virtualized) this.enableVirtual()
      else this.disableVirtual()
    }
  }

  /** Attach the scroll listener + ResizeObserver that drive windowing. */
  private enableVirtual (): void {
    if (this.resizeObserver) return
    this.addEventListener('scroll', this.onScroll)
    this.resizeObserver = new ResizeObserver(() => this.requestUpdate())
    this.resizeObserver.observe(this)
  }

  private disableVirtual (): void {
    this.removeEventListener('scroll', this.onScroll)
    this.resizeObserver?.disconnect()
    this.resizeObserver = undefined
  }

  private readonly onScroll = (): void => {
    if (!this.virtualized || this.rafPending) return
    this.rafPending = true
    requestAnimationFrame(() => {
      this.rafPending = false
      this.scrollOffset = this.scrollTop
    })
  }

  private get displayRows (): IndexedRow[] {
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

  private cellContent (column: TableColumn, row: TableRow, index: number): unknown {
    const value = row[column.key]
    if (column.render) return column.render(value, row, index)
    // Render the raw value directly: Lit handles strings/numbers, TemplateResults
    // and DOM nodes; null/undefined render as empty.
    return value ?? nothing
  }

  private isInteractive (target: EventTarget | null): boolean {
    return (target as HTMLElement | null)?.closest('button, a, input, select, textarea, label') != null
  }

  private readonly onRowClick = (row: TableRow, index: number, event: MouseEvent): void => {
    // Let controls inside the row (checkbox, buttons, links) handle their own clicks.
    if (this.isInteractive(event.target)) return
    this.activateRow(row, index)
  }

  private readonly onRowKeydown = (row: TableRow, index: number, event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    if (this.isInteractive(event.target)) return
    event.preventDefault()
    this.activateRow(row, index)
  }

  private activateRow (row: TableRow, index: number): void {
    this.dispatchEvent(new CustomEvent('film-row-activate', { detail: { row, index }, bubbles: true }))
  }

  private renderRow ({ row, index }: IndexedRow, ariaRowIndex?: number) {
    return html`
      <tr
        aria-rowindex=${ariaRowIndex ?? nothing}
        tabindex=${this.activatable ? 0 : nothing}
        @click=${this.activatable ? (e: MouseEvent) => this.onRowClick(row, index, e) : nothing}
        @keydown=${this.activatable ? (e: KeyboardEvent) => this.onRowKeydown(row, index, e) : nothing}
      >
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
          (column) => html`<td data-align=${column.align ?? nothing}>${this.cellContent(column, row, index)}</td>`
        )}
      </tr>
    `
  }

  private renderBody () {
    const rows = this.displayRows
    if (!this.virtualized) {
      return html`<tbody>${rows.map((r) => this.renderRow(r))}</tbody>`
    }

    const total = rows.length
    const viewport = this.clientHeight || 400
    const start = Math.max(0, Math.floor(this.scrollOffset / this.rowHeight) - OVERSCAN)
    const count = Math.ceil(viewport / this.rowHeight) + OVERSCAN * 2
    const end = Math.min(total, start + count)
    const colspan = this.columns.length + (this.selectable ? 1 : 0)
    const topPad = start * this.rowHeight
    const bottomPad = (total - end) * this.rowHeight

    return html`
      <tbody>
        ${topPad > 0
          ? html`<tr aria-hidden="true" style="block-size:${topPad}px"><td colspan=${colspan}></td></tr>`
          : nothing}
        ${rows.slice(start, end).map((r, i) => this.renderRow(r, start + i + 2))}
        ${bottomPad > 0
          ? html`<tr aria-hidden="true" style="block-size:${bottomPad}px"><td colspan=${colspan}></td></tr>`
          : nothing}
      </tbody>
    `
  }

  render () {
    const someSelected = this.selected.size > 0 && !this.allSelected
    return html`
      <table aria-rowcount=${this.virtualized ? this.rows.length + 1 : nothing}>
        ${this.caption ? html`<caption>${this.caption}</caption>` : nothing}
        <thead>
          <tr aria-rowindex=${this.virtualized ? 1 : nothing}>
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
        ${this.renderBody()}
      </table>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-table': Table
  }
}
