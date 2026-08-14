import { css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

export interface TableColumn {
  key: string
  label: string
  align?: 'start' | 'center' | 'end'
}

export type TableRow = Record<string, unknown>

/**
 * Table — a themed, data-driven table. Provide `columns` and `rows` as
 * properties.
 */
@customElement('film-table')
export class Table extends FilmElement {
  /** The column definitions. */
  @property({ attribute: false }) columns: TableColumn[] = []

  /** The row data, keyed by column `key`. */
  @property({ attribute: false }) rows: TableRow[] = []

  /** An optional caption. */
  @property({ type: String }) caption = ''

  static styles = css`
    :host {
      display: block;
      overflow-x: auto;
    }

    table {
      inline-size: 100%;
      border-collapse: collapse;
      color: var(--color-dark);
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
      border-block-end: var(--border-thin) solid var(--color-dark);
    }

    th {
      font-weight: 600;
      border-block-end-width: var(--border-thick);
    }

    tbody tr:hover {
      background-color: var(--surface-info);
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

  render () {
    return html`
      <table>
        ${this.caption ? html`<caption>${this.caption}</caption>` : nothing}
        <thead>
          <tr>
            ${this.columns.map(
              (column) => html`<th scope="col" data-align=${column.align ?? nothing}>${column.label}</th>`
            )}
          </tr>
        </thead>
        <tbody>
          ${this.rows.map(
            (row) => html`
              <tr>
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
