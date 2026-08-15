import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import type { MenuItem } from './menu-item.js'

/**
 * Menu — a themed list of {@link MenuItem}s with arrow-key navigation. Can be
 * used on its own or as the panel of a {@link Dropdown}.
 *
 * @slot - The `film-menu-item` children.
 */
@customElement('film-menu')
export class Menu extends FilmElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--s-4);
      padding: var(--s-3);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius-lg);
      min-inline-size: 12ch;
    }
  `

  private get items (): MenuItem[] {
    return Array.from(this.querySelectorAll('film-menu-item')).filter(
      (item) => !item.disabled
    )
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'menu')
    this.addEventListener('keydown', this.onKeydown)
  }

  /** Move focus to the first item. */
  focusFirst (): void {
    this.items[0]?.focus()
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    const items = this.items
    if (items.length === 0) return
    const current = items.indexOf(document.activeElement as MenuItem)

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        items[(current + 1) % items.length]?.focus()
        break
      case 'ArrowUp':
        event.preventDefault()
        items[(current - 1 + items.length) % items.length]?.focus()
        break
      case 'Home':
        event.preventDefault()
        items[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        items[items.length - 1]?.focus()
        break
    }
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-menu': Menu
  }
}
