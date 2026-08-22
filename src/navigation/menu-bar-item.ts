import { css, html, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { anchorPosition } from '../internal/anchor-position.js'
import type { Menu } from './menu.js'

/**
 * MenuBarItem — a single top-level menu in a {@link MenuBar}. Renders a trigger
 * labelled by `label` (or the `label` slot) and reveals a slotted `film-menu`
 * below it. Opening, closing, and roving focus are coordinated by the parent
 * `film-menu-bar`.
 *
 * @slot - The `film-menu` to reveal.
 * @slot label - Custom trigger content (overrides `label`).
 * @fires film-menubar-open - When this menu opens.
 * @fires film-menubar-close - When this menu closes.
 */
@customElement('film-menu-bar-item')
export class MenuBarItem extends FilmElement {
  /** The trigger label. */
  @property({ type: String }) label = ''

  /** Whether the menu is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** Whether the menu is open. */
  @property({ type: Boolean, reflect: true }) open = false

  /** Whether this trigger is the roving tab stop (managed by the bar). */
  @property({ type: Boolean }) tabbable = false

  @query('.trigger') private triggerEl!: HTMLButtonElement
  @query('.panel') private panel!: HTMLElement

  private cleanup?: () => void
  private pendingFocus: 'first' | 'last' | 'none' = 'none'

  static styles = css`
    :host {
      display: inline-block;
    }

    .trigger {
      font: inherit;
      color: var(--film-color-text);
      background: none;
      border: none;
      padding: var(--s-2) var(--s0);
      border-radius: var(--film-radius-sm);
      cursor: pointer;
    }

    .trigger:hover:not(:disabled),
    .trigger[aria-expanded='true'] {
      background-color: var(--film-color-info);
    }

    .trigger:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: -1px;
    }

    .trigger:disabled {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }

    .panel {
      margin: 0;
      padding: 0;
      border: none;
      background: none;
      inset: unset;
      overflow: visible;
    }

    .panel:popover-open {
      display: block;
    }
  `

  /** The menu assigned to the default slot, if any. */
  get menu (): Menu | null {
    return this.querySelector('film-menu')
  }

  /** Focus the trigger. */
  focus (): void {
    this.triggerEl?.focus()
  }

  /**
   * Open the menu, optionally moving focus to the `first` or `last` item. If it
   * is already open, apply the requested focus immediately (the popover is
   * shown, so its items are focusable).
   */
  openMenu (focus: 'first' | 'last' | 'none' = 'none'): void {
    if (this.disabled || !this.menu) return
    if (this.open) {
      this.applyMenuFocus(focus)
      return
    }
    this.pendingFocus = focus
    this.open = true
  }

  /** Close the menu. Pass `true` to return focus to the trigger. */
  closeMenu (focusTrigger = false): void {
    this.open = false
    if (focusTrigger) this.focus()
  }

  private applyMenuFocus (focus: 'first' | 'last' | 'none'): void {
    if (focus === 'first') this.menu?.focusFirst()
    else if (focus === 'last') this.menu?.focusLast()
  }

  updated (changed: PropertyValues<this>): void {
    if (!changed.has('open')) return
    if (this.open) {
      this.panel.showPopover()
      this.cleanup = anchorPosition(this.triggerEl, this.panel, { placement: 'bottom', align: 'start' })
      this.applyMenuFocus(this.pendingFocus)
      this.pendingFocus = 'none'
      this.dispatchEvent(new Event('film-menubar-open', { bubbles: true }))
    } else {
      this.cleanup?.()
      this.cleanup = undefined
      if (this.panel?.matches(':popover-open')) this.panel.hidePopover()
      this.dispatchEvent(new Event('film-menubar-close', { bubbles: true }))
    }
  }

  disconnectedCallback (): void {
    this.cleanup?.()
    super.disconnectedCallback()
  }

  private readonly onToggle = (event: Event): void => {
    // Sync when the browser closes the popover (light-dismiss / Escape / a sibling opening).
    const isOpen = (event as ToggleEvent).newState === 'open'
    if (isOpen === this.open) return
    this.open = isOpen
    if (!isOpen && this.isConnected && document.activeElement === document.body) this.focus()
  }

  private readonly onTriggerClick = (): void => {
    if (this.disabled) return
    if (this.open) this.closeMenu()
    else this.openMenu()
  }

  private readonly onTriggerKeydown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case 'ArrowDown':
      case 'Enter':
      case ' ':
        event.preventDefault()
        this.openMenu('first')
        break
      case 'ArrowUp':
        event.preventDefault()
        this.openMenu('last')
        break
      case 'Escape':
        if (this.open) {
          event.preventDefault()
          this.closeMenu(true)
        }
        break
    }
  }

  render () {
    return html`
      <button
        class="trigger"
        part="trigger"
        ?disabled=${this.disabled}
        aria-haspopup="menu"
        aria-expanded=${this.open ? 'true' : 'false'}
        tabindex=${this.tabbable ? 0 : -1}
        @click=${this.onTriggerClick}
        @keydown=${this.onTriggerKeydown}
      >
        <slot name="label">${this.label}</slot>
      </button>
      <div class="panel" popover="auto" @toggle=${this.onToggle} @film-select=${() => this.closeMenu()}>
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-menu-bar-item': MenuBarItem
  }
}
