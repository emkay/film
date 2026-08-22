import { css, html, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { anchorPosition } from '../internal/anchor-position.js'
import type { Menu } from './menu.js'

/**
 * MenuItem — a single actionable item within a {@link Menu}.
 *
 * Nest a `film-menu` in the `submenu` slot to turn the item into a flyout
 * parent: it opens on hover, on click, and on `ArrowRight`, and closes on
 * `ArrowLeft`, `Escape`, or light-dismiss. Activating a leaf anywhere in the
 * chain collapses it.
 *
 * @slot - The item label.
 * @slot start - Content before the label (e.g. an icon).
 * @slot submenu - A nested `film-menu` shown as a flyout.
 * @fires film-select - When the item is activated. `detail.value` is the item's value.
 */
@customElement('film-menu-item')
export class MenuItem extends FilmElement {
  /** A value identifying the item, surfaced in the `film-select` event. */
  @property({ type: String }) value = ''

  /** Whether the item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false

  @state() private hasSubmenu = false
  @state() private submenuOpen = false

  @query('.submenu') private submenuEl!: HTMLElement
  @query('slot[name="submenu"]') private submenuSlot!: HTMLSlotElement

  private cleanup?: () => void
  private closeTimer?: number

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: var(--s-1);
      padding: var(--s-2) var(--s0);
      cursor: pointer;
      border-radius: var(--film-radius-sm);
      color: var(--film-color-text);
      white-space: nowrap;
    }

    :host(:hover:not([disabled])),
    :host(:focus-visible),
    :host([aria-expanded='true']) {
      background-color: var(--film-color-info);
      outline: none;
    }

    :host([disabled]) {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }

    .arrow {
      margin-inline-start: auto;
      padding-inline-start: var(--s0);
      font-size: var(--s-2);
      opacity: 0.7;
    }

    .submenu {
      margin: 0;
      padding: 0;
      border: none;
      background: none;
      inset: unset;
      overflow: visible;
    }

    .submenu:popover-open {
      display: block;
    }
  `

  /** The nested menu assigned to the `submenu` slot, if any. */
  get submenu (): Menu | null {
    return (this.submenuSlot?.assignedElements().find((el) => el.tagName === 'FILM-MENU') as Menu) ?? null
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'menuitem')
    if (!this.hasAttribute('tabindex')) this.tabIndex = -1
    this.addEventListener('click', this.onActivate)
    this.addEventListener('keydown', this.onKeydown)
    this.addEventListener('pointerenter', this.onPointerEnter)
    this.addEventListener('pointerleave', this.onPointerLeave)
    this.addEventListener('film-select', this.onDescendantSelect)
  }

  disconnectedCallback (): void {
    this.cleanup?.()
    if (this.closeTimer) clearTimeout(this.closeTimer)
    super.disconnectedCallback()
  }

  private readonly onSubmenuSlotChange = (): void => {
    this.hasSubmenu = this.submenu !== null
    if (this.hasSubmenu) {
      this.setAttribute('aria-haspopup', 'menu')
      this.setAttribute('aria-expanded', String(this.submenuOpen))
    } else {
      this.removeAttribute('aria-haspopup')
      this.removeAttribute('aria-expanded')
    }
  }

  private readonly onActivate = (event?: Event): void => {
    if (this.disabled) return
    // Ignore clicks that bubbled up from a nested item — only act on our own.
    const target = event?.target as Element | null
    if (target && target.closest('film-menu-item') !== this) return
    if (this.hasSubmenu) {
      event?.stopPropagation()
      this.toggleSubmenu(true)
      return
    }
    this.dispatchEvent(
      new CustomEvent('film-select', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    )
  }

  private toggleSubmenu (focusFirst = false): void {
    if (this.submenuOpen) this.closeSubmenu()
    else this.openSubmenu(focusFirst)
  }

  /** Open the flyout. */
  openSubmenu (focusFirst = false): void {
    if (!this.hasSubmenu) return
    if (!this.submenuOpen) {
      this.submenuEl.showPopover()
      this.cleanup = anchorPosition(this, this.submenuEl, { placement: 'right', align: 'start', gap: 2 })
      this.submenuOpen = true
      this.setAttribute('aria-expanded', 'true')
    }
    if (focusFirst) this.submenu?.focusFirst()
  }

  /** Close the flyout. */
  closeSubmenu (): void {
    if (!this.submenuOpen) return
    this.cleanup?.()
    this.cleanup = undefined
    if (this.submenuEl?.matches(':popover-open')) this.submenuEl.hidePopover()
    this.submenuOpen = false
    this.setAttribute('aria-expanded', 'false')
  }

  private readonly onSubmenuToggle = (event: Event): void => {
    // Sync when the browser closes the popover (Escape / light-dismiss / ancestor hidden).
    if ((event as ToggleEvent).newState === 'open' || !this.submenuOpen) return
    this.cleanup?.()
    this.cleanup = undefined
    this.submenuOpen = false
    this.setAttribute('aria-expanded', 'false')
    // Escape moves focus to the body; return it to the item so the menu stays operable.
    if (this.isConnected && document.activeElement === document.body) this.focus()
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        if (event.target === this) {
          event.preventDefault()
          this.onActivate()
        }
        break
      case 'ArrowRight':
        if (this.hasSubmenu && event.target === this) {
          event.preventDefault()
          event.stopPropagation()
          this.openSubmenu(true)
        }
        break
      case 'ArrowLeft':
        if (this.submenuOpen) {
          event.preventDefault()
          event.stopPropagation()
          this.closeSubmenu()
          this.focus()
        }
        break
    }
  }

  private readonly onPointerEnter = (): void => {
    if (!this.hasSubmenu || this.disabled) return
    this.cancelClose()
    this.openSubmenu()
  }

  private readonly onPointerLeave = (): void => {
    if (this.hasSubmenu) this.scheduleClose()
  }

  private readonly onSubmenuPointerEnter = (): void => {
    this.cancelClose()
  }

  private readonly onSubmenuPointerLeave = (): void => {
    this.scheduleClose()
  }

  private scheduleClose (): void {
    this.cancelClose()
    this.closeTimer = window.setTimeout(() => this.closeSubmenu(), 250)
  }

  private cancelClose (): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer)
      this.closeTimer = undefined
    }
  }

  private readonly onDescendantSelect = (event: Event): void => {
    // A leaf deeper in the chain was chosen — collapse this flyout too.
    if (event.target !== this) this.closeSubmenu()
  }

  render () {
    return html`
      <slot name="start"></slot>
      <slot></slot>
      ${this.hasSubmenu ? html`<span class="arrow" aria-hidden="true">▸</span>` : nothing}
      <div
        class="submenu"
        popover="auto"
        @toggle=${this.onSubmenuToggle}
        @pointerenter=${this.onSubmenuPointerEnter}
        @pointerleave=${this.onSubmenuPointerLeave}
      >
        <slot name="submenu" @slotchange=${this.onSubmenuSlotChange}></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-menu-item': MenuItem
  }
}
