import { css, html, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import type { Align, Placement } from '../internal/anchor-position.js'
import { PopoverController } from '../internal/popover-controller.js'
import type { Menu } from '../navigation/menu.js'

/**
 * Dropdown — a trigger that reveals a floating panel (typically a
 * {@link Menu}). The panel is promoted to the top layer via the Popover API,
 * giving light-dismiss and Escape-to-close for free, and is positioned by a
 * small hand-rolled anchoring helper.
 *
 * @slot trigger - The triggering element (e.g. a button).
 * @slot - The panel content.
 * @fires film-open - When the panel opens.
 * @fires film-close - When the panel closes.
 */
@customElement('film-dropdown')
export class Dropdown extends FilmElement {
  /** Whether the panel is open. */
  @property({ type: Boolean, reflect: true }) open = false

  /** Which side of the trigger the panel prefers. */
  @property({ type: String }) placement: Placement = 'bottom'

  /** How the panel aligns along the trigger. */
  @property({ type: String }) align: Align = 'start'

  @query('.panel') private panel!: HTMLElement
  @query('slot[name="trigger"]') private triggerSlot!: HTMLSlotElement

  private readonly floating = new PopoverController(this, {
    anchor: () => this.trigger,
    panel: () => this.panel,
    options: () => ({ placement: this.placement, align: this.align })
  })

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
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

  private get trigger (): HTMLElement | undefined {
    return this.triggerSlot?.assignedElements()[0] as HTMLElement | undefined
  }

  show (): void {
    this.open = true
  }

  close (): void {
    this.open = false
  }

  toggle (): void {
    this.open = !this.open
  }

  updated (changed: PropertyValues<this>): void {
    super.updated(changed)
    if (!changed.has('open')) return
    this.trigger?.setAttribute('aria-expanded', String(this.open))
    // Announce only real transitions: `open` starts false, so the first render
    // would otherwise report a close nobody made.
    const wasOpen = this.floating.isOpen
    if (this.open) {
      if (!this.floating.show() || wasOpen) return
      ;(this.querySelector('film-menu') as Menu | null)?.focusFirst()
      this.dispatchEvent(new Event('film-open'))
    } else {
      this.floating.hide()
      if (wasOpen) this.dispatchEvent(new Event('film-close'))
    }
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.trigger?.setAttribute('aria-haspopup', 'menu')
  }

  private readonly onToggle = (event: Event): void => {
    // Keep `open` in sync with light-dismiss / Escape handled by the browser.
    const state = (event as ToggleEvent).newState
    this.open = state === 'open'
  }

  render () {
    return html`
      <slot name="trigger" @click=${this.toggle}></slot>
      <div
        class="panel"
        popover="auto"
        @toggle=${this.onToggle}
        @film-select=${this.close}
      >
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-dropdown': Dropdown
  }
}
