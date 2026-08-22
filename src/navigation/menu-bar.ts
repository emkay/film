import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import type { MenuBarItem } from './menu-bar-item.js'

/**
 * MenuBar — a horizontal application menu (File / Edit / View …). Holds
 * {@link MenuBarItem}s, each revealing a `film-menu`. Provides roving-tabindex
 * focus, `ArrowLeft`/`ArrowRight` traversal, and menubar hover/switch
 * behaviour: once one menu is open, moving or hovering opens the next.
 *
 * @slot - The `film-menu-bar-item` children.
 */
@customElement('film-menu-bar')
export class MenuBar extends FilmElement {
  private activeItem: MenuBarItem | null = null
  private openItem: MenuBarItem | null = null

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: var(--s-3);
      padding: var(--s-3);
      background-color: var(--film-color-surface);
      border-block-end: var(--border-thin) solid var(--film-color-border);
    }
  `

  private get items (): MenuBarItem[] {
    return Array.from(this.querySelectorAll<MenuBarItem>(':scope > film-menu-bar-item')).filter(
      (item) => !item.disabled
    )
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'menubar')
    this.addEventListener('keydown', this.onKeydown)
    this.addEventListener('pointerover', this.onPointerOver)
    this.addEventListener('film-menubar-open', this.onItemOpen)
    this.addEventListener('film-menubar-close', this.onItemClose)
  }

  disconnectedCallback (): void {
    this.removeEventListener('keydown', this.onKeydown)
    this.removeEventListener('pointerover', this.onPointerOver)
    this.removeEventListener('film-menubar-open', this.onItemOpen)
    this.removeEventListener('film-menubar-close', this.onItemClose)
    super.disconnectedCallback()
  }

  private onSlotChange (): void {
    // Establish the roving tab stop on the first item.
    if (!this.activeItem || !this.items.includes(this.activeItem)) {
      this.setActive(this.items[0] ?? null)
    }
  }

  private setActive (item: MenuBarItem | null): void {
    this.activeItem = item
    for (const other of this.items) other.tabbable = other === item
  }

  private readonly onItemOpen = (event: Event): void => {
    const item = event.target as MenuBarItem
    this.openItem = item
    this.setActive(item)
  }

  private readonly onItemClose = (event: Event): void => {
    if (event.target === this.openItem) this.openItem = null
  }

  private readonly onPointerOver = (event: Event): void => {
    if (!this.openItem) return
    const item = (event.target as HTMLElement).closest('film-menu-bar-item') as MenuBarItem | null
    if (!item || item === this.openItem || !this.items.includes(item)) return
    this.openItem.closeMenu()
    this.setActive(item)
    item.openMenu()
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    const items = this.items
    if (items.length === 0) return
    const current = (event.target as HTMLElement).closest('film-menu-bar-item') as MenuBarItem | null
    const idx = current ? items.indexOf(current) : -1

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        this.move(items, (idx + 1) % items.length)
        break
      case 'ArrowLeft':
        event.preventDefault()
        this.move(items, (idx - 1 + items.length) % items.length)
        break
      case 'Home':
        event.preventDefault()
        this.move(items, 0)
        break
      case 'End':
        event.preventDefault()
        this.move(items, items.length - 1)
        break
    }
  }

  private move (items: MenuBarItem[], nextIndex: number): void {
    const next = items[nextIndex]
    if (!next) return
    const wasOpen = this.openItem
    this.setActive(next)
    next.focus()
    // Menubar convention: if a menu was open, open the newly focused one too,
    // keeping focus on the trigger.
    if (wasOpen && wasOpen !== next) {
      wasOpen.closeMenu()
      next.openMenu()
    }
  }

  render () {
    return html`<slot @slotchange=${this.onSlotChange}></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-menu-bar': MenuBar
  }
}
