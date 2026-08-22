import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import '../feedback/spinner.js'

/**
 * TreeItem — a node in a {@link Tree}. Nest `film-tree-item`s in the default
 * slot to create children; selection and keyboard navigation are managed by the
 * parent `film-tree`.
 *
 * For lazily-loaded hierarchies, set `has-children` on a node with no children
 * yet: it shows a disclosure arrow, and expanding it fires `film-tree-expand`.
 * The consumer then sets `loading`, injects child `film-tree-item`s (or sets
 * `error-message`), and clears `loading`.
 *
 * @slot label - The node label.
 * @slot - Nested `film-tree-item` children.
 * @fires film-tree-expand - When an unloaded node is expanded. `detail.item` is the node.
 */
@customElement('film-tree-item')
export class TreeItem extends FilmElement {
  /** Whether the node is expanded. */
  @property({ type: Boolean, reflect: true }) expanded = false

  /** Whether the node is selected. Managed by the tree. */
  @property({ type: Boolean, reflect: true }) selected = false

  /** Whether the node is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /**
   * Whether the node has children. Derived from slotted children automatically;
   * set it explicitly for a lazy node whose children aren't loaded yet.
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-children' }) hasChildren = false

  /** Show a spinner in the disclosure position while children load. */
  @property({ type: Boolean, reflect: true }) loading = false

  /** An error message shown in place of children when a load fails. */
  @property({ type: String, attribute: 'error-message' }) errorMessage = ''

  static styles = css`
    :host {
      display: block;
    }

    .row {
      display: flex;
      align-items: center;
      gap: var(--s-2);
      padding: var(--s-3) var(--s-2);
      border-radius: var(--film-radius-sm);
      cursor: pointer;
    }

    :host([selected]) > .row {
      background-color: var(--film-color-info);
    }

    :host(:focus-visible) {
      outline: none;
    }

    :host(:focus-visible) > .row {
      outline: var(--border-thin) solid var(--film-color-focus);
    }

    .twist {
      border: none;
      background: none;
      cursor: pointer;
      padding: 0;
      inline-size: 1em;
      block-size: 1em;
      display: grid;
      place-content: center;
      color: inherit;
      transition: transform var(--film-duration-fast) var(--film-ease);
    }

    :host([expanded]) .twist:not(.loading) {
      transform: rotate(90deg);
    }

    .twist[hidden] {
      visibility: hidden;
    }

    .children {
      padding-inline-start: var(--s1);
    }

    .error {
      padding: var(--s-3) var(--s-2);
      font-size: var(--s-1);
      color: var(--film-color-danger);
    }
  `

  /** Whether the consumer declared this a lazy node via the `has-children` attribute. */
  private lazy = false

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'treeitem')
    if (!this.hasAttribute('tabindex')) this.tabIndex = -1
    this.lazy = this.hasAttribute('has-children')
  }

  /** The immediate child tree items. */
  get childItems (): TreeItem[] {
    return Array.from(this.querySelectorAll(':scope > film-tree-item'))
  }

  updated (changed: PropertyValues<this>): void {
    super.updated(changed)
    if (changed.has('selected')) this.setAttribute('aria-selected', String(this.selected))
    if (changed.has('loading')) this.setAttribute('aria-busy', String(this.loading))
    if (this.hasChildren) this.setAttribute('aria-expanded', String(this.expanded))
    else this.removeAttribute('aria-expanded')

    // Ask the consumer to load children when an unloaded node is expanded.
    if (
      changed.has('expanded') &&
      this.expanded &&
      this.hasChildren &&
      this.childItems.length === 0 &&
      !this.loading
    ) {
      this.dispatchEvent(
        new CustomEvent('film-tree-expand', { detail: { item: this }, bubbles: true, composed: true })
      )
    }
  }

  private readonly onSlotChange = (): void => {
    // Derive hasChildren from the slot for normal trees (both directions, so
    // removing children clears the arrow). A lazy node — declared with the
    // `has-children` attribute — keeps its arrow before its children arrive.
    if (!this.lazy) this.hasChildren = this.childItems.length > 0
  }

  private readonly onTwist = (event: Event): void => {
    event.stopPropagation()
    this.expanded = !this.expanded
  }

  render () {
    return html`
      <div class="row">
        <button
          class="twist ${this.loading ? 'loading' : ''}"
          ?hidden=${!this.hasChildren}
          aria-hidden="true"
          tabindex="-1"
          @click=${this.onTwist}
        >
          ${this.loading
            ? html`<film-spinner size="0.9em" label="Loading"></film-spinner>`
            : this.hasChildren
              ? '▶'
              : nothing}
        </button>
        <span class="label"><slot name="label"></slot></span>
      </div>
      <div class="children" role="group" ?hidden=${!this.expanded}>
        ${this.errorMessage ? html`<div class="error" role="alert">${this.errorMessage}</div>` : nothing}
        <slot @slotchange=${this.onSlotChange}></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-tree-item': TreeItem
  }
}
