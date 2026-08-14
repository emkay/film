import { css, html, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { anchorPosition, type Align, type Placement } from '../internal/anchor-position.js'
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

  private cleanup?: () => void

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
    if (!changed.has('open')) return
    this.trigger?.setAttribute('aria-expanded', String(this.open))
    if (this.open) this.openPanel()
    else this.closePanel()
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.trigger?.setAttribute('aria-haspopup', 'menu')
  }

  disconnectedCallback (): void {
    this.cleanup?.()
    super.disconnectedCallback()
  }

  private openPanel (): void {
    const trigger = this.trigger
    if (!trigger || !this.panel) return
    this.panel.showPopover()
    this.cleanup = anchorPosition(trigger, this.panel, {
      placement: this.placement,
      align: this.align
    })
    const menu = this.querySelector('film-menu') as Menu | null
    menu?.focusFirst()
    this.dispatchEvent(new Event('film-open'))
  }

  private closePanel (): void {
    this.cleanup?.()
    this.cleanup = undefined
    if (this.panel?.matches(':popover-open')) this.panel.hidePopover()
    this.dispatchEvent(new Event('film-close'))
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
