import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import type { TreeItem } from './tree-item.js'
import { activeElementOf } from '../internal/dom.js'
import { TypeAhead } from '../internal/type-ahead.js'

/**
 * Tree — a hierarchical list of {@link TreeItem}s with single selection and
 * keyboard navigation (up/down to move, left/right to collapse/expand,
 * Enter/Space to select).
 *
 * @slot - The top-level `film-tree-item`s.
 * @fires film-tree-select - When a node is selected. `detail.item` is the node.
 */
@customElement('film-tree')
export class Tree extends FilmElement {
  /** The accessible label for the tree. */
  @property({ type: String }) label = ''

  static styles = css`
    :host {
      display: block;
    }
  `

  private get items (): TreeItem[] {
    return Array.from(this.querySelectorAll('film-tree-item'))
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'tree')
    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', this.onKeydown)
  }

  firstUpdated (): void {
    if (this.label) this.setAttribute('aria-label', this.label)
    const first = this.items.find((item) => !item.disabled)
    if (first) first.tabIndex = 0
  }

  private isVisible (item: TreeItem): boolean {
    let parent = item.parentElement?.closest('film-tree-item') as TreeItem | null
    while (parent) {
      if (!parent.expanded) return false
      parent = parent.parentElement?.closest('film-tree-item') as TreeItem | null
    }
    return true
  }

  private get visibleItems (): TreeItem[] {
    return this.items.filter((item) => !item.disabled && this.isVisible(item))
  }

  private readonly onClick = (event: MouseEvent): void => {
    const item = (event.target as Element).closest('film-tree-item') as TreeItem | null
    if (item && !item.disabled) this.select(item)
  }

  private readonly typeAhead = new TypeAhead()

  private readonly onKeydown = (event: KeyboardEvent): void => {
    const focused = activeElementOf(this) as TreeItem | null
    if (!focused || focused.tagName !== 'FILM-TREE-ITEM') return
    const visible = this.visibleItems
    const index = visible.indexOf(focused)

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.focusItem(visible[index + 1])
        break
      case 'ArrowUp':
        event.preventDefault()
        this.focusItem(visible[index - 1])
        break
      case 'ArrowRight':
        event.preventDefault()
        if (focused.hasChildren && !focused.expanded) focused.expanded = true
        else this.focusItem(focused.childItems.find((child) => !child.disabled))
        break
      case 'ArrowLeft': {
        event.preventDefault()
        if (focused.expanded && focused.childItems.length > 0) {
          focused.expanded = false
        } else {
          const parent = focused.parentElement?.closest('film-tree-item') as TreeItem | null
          if (parent) this.focusItem(parent)
        }
        break
      }
      case 'Home':
        event.preventDefault()
        this.focusItem(visible[0])
        break
      case 'End':
        event.preventDefault()
        this.focusItem(visible[visible.length - 1])
        break
      case 'Enter':
      case ' ': {
        // Space mid-word belongs to type-ahead.
        const match = event.key === ' ' ? this.typeAhead.find(event, visible.map((i) => i.labelText), index) : -1
        event.preventDefault()
        if (match >= 0) this.focusItem(visible[match])
        else this.select(focused)
        break
      }
      default: {
        const match = this.typeAhead.find(event, visible.map((item) => item.labelText), index)
        if (match >= 0) {
          event.preventDefault()
          this.focusItem(visible[match])
        }
      }
    }
  }

  private focusItem (item?: TreeItem): void {
    if (!item) return
    this.items.forEach((node) => {
      node.tabIndex = node === item ? 0 : -1
    })
    item.focus()
  }

  private select (item: TreeItem): void {
    this.items.forEach((node) => {
      node.selected = node === item
    })
    this.focusItem(item)
    this.dispatchEvent(new CustomEvent('film-tree-select', { detail: { item }, bubbles: true }))
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-tree': Tree
  }
}
