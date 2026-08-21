import { css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Pagination — page navigation with a first/last anchor, a window around the
 * current page, and ellipses for the gaps.
 *
 * @fires film-page-change - When a page is chosen. `detail.page` is the new page.
 */
@customElement('film-pagination')
export class Pagination extends FilmElement {
  /** Total number of pages. */
  @property({ type: Number }) total = 1

  /** The current page (1-based). */
  @property({ type: Number }) page = 1

  /** How many pages to show either side of the current one. */
  @property({ type: Number, attribute: 'sibling-count' }) siblingCount = 1

  /** Accessible label for the navigation landmark. */
  @property({ type: String }) label = 'Pagination'

  static styles = css`
    :host {
      display: block;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      gap: var(--s-3);
      list-style: none;
      margin: 0;
      padding: 0;
    }

    button {
      font: inherit;
      min-inline-size: 2.25em;
      padding: 0.3em 0.5em;
      color: var(--film-color-text);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius);
      cursor: pointer;
    }

    button:hover:not([disabled]):not([aria-current]) {
      background-color: var(--film-color-info);
    }

    button[aria-current] {
      background-color: var(--film-color-inverted-surface);
      color: var(--film-color-inverted-text);
    }

    button:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: 1px;
    }

    button[disabled] {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }

    .ellipsis {
      display: inline-grid;
      place-content: center;
      min-inline-size: 2.25em;
      opacity: 0.6;
    }
  `

  private get items (): Array<number | 'ellipsis'> {
    const { total, page, siblingCount } = this
    if (total <= 1) return total === 1 ? [1] : []
    const start = Math.max(2, page - siblingCount)
    const end = Math.min(total - 1, page + siblingCount)
    const items: Array<number | 'ellipsis'> = [1]
    if (start > 2) items.push('ellipsis')
    for (let i = start; i <= end; i++) items.push(i)
    if (end < total - 1) items.push('ellipsis')
    items.push(total)
    return items
  }

  private go (page: number): void {
    if (page < 1 || page > this.total || page === this.page) return
    this.page = page
    this.dispatchEvent(new CustomEvent('film-page-change', { detail: { page }, bubbles: true }))
  }

  render () {
    return html`
      <nav aria-label=${this.label}>
        <ul>
          <li>
            <button
              ?disabled=${this.page <= 1}
              aria-label="Previous page"
              @click=${() => this.go(this.page - 1)}
            >‹</button>
          </li>
          ${this.items.map((item) =>
            item === 'ellipsis'
              ? html`<li><span class="ellipsis" aria-hidden="true">…</span></li>`
              : html`
                  <li>
                    <button
                      aria-current=${item === this.page ? 'page' : nothing}
                      aria-label="Page ${item}"
                      @click=${() => this.go(item)}
                    >${item}</button>
                  </li>
                `
          )}
          <li>
            <button
              ?disabled=${this.page >= this.total}
              aria-label="Next page"
              @click=${() => this.go(this.page + 1)}
            >›</button>
          </li>
        </ul>
      </nav>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-pagination': Pagination
  }
}
