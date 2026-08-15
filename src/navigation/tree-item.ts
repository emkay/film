import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * TreeItem — a node in a {@link Tree}. Nest `film-tree-item`s in the default
 * slot to create children; selection and keyboard navigation are managed by the
 * parent `film-tree`.
 *
 * @slot label - The node label.
 * @slot - Nested `film-tree-item` children.
 */
@customElement('film-tree-item')
export class TreeItem extends FilmElement {
  /** Whether the node is expanded. */
  @property({ type: Boolean, reflect: true }) expanded = false

  /** Whether the node is selected. Managed by the tree. */
  @property({ type: Boolean, reflect: true }) selected = false

  /** Whether the node is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false

  @state() private hasChildren = false

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
      color: inherit;
      transition: transform 0.1s ease;
    }

    :host([expanded]) .twist {
      transform: rotate(90deg);
    }

    .twist[hidden] {
      visibility: hidden;
    }

    .children {
      padding-inline-start: var(--s1);
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'treeitem')
    if (!this.hasAttribute('tabindex')) this.tabIndex = -1
  }

  /** The immediate child tree items. */
  get childItems (): TreeItem[] {
    return Array.from(this.querySelectorAll(':scope > film-tree-item'))
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('selected')) this.setAttribute('aria-selected', String(this.selected))
    if (this.hasChildren) this.setAttribute('aria-expanded', String(this.expanded))
    else this.removeAttribute('aria-expanded')
  }

  private readonly onSlotChange = (): void => {
    this.hasChildren = this.childItems.length > 0
  }

  private readonly onTwist = (event: Event): void => {
    event.stopPropagation()
    this.expanded = !this.expanded
  }

  render () {
    return html`
      <div class="row">
        <button
          class="twist"
          ?hidden=${!this.hasChildren}
          aria-hidden="true"
          tabindex="-1"
          @click=${this.onTwist}
        >
          ${this.hasChildren ? '▶' : nothing}
        </button>
        <span class="label"><slot name="label"></slot></span>
      </div>
      <div class="children" role="group" ?hidden=${!this.expanded}>
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
