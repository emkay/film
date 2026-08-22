import { css, html, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { anchorPosition, type Align, type Placement } from '../internal/anchor-position.js'

/**
 * Popover — a generic anchored panel promoted to the top layer via the Popover
 * API and positioned by the shared anchoring helper. Open it on `click`
 * (light-dismiss), on `hover`, or drive it manually via the `open` property.
 *
 * @slot trigger - The element the popover is anchored to.
 * @slot - The popover content.
 * @fires film-open - When the popover opens.
 * @fires film-close - When the popover closes.
 */
@customElement('film-popover')
export class Popover extends FilmElement {
  /** Whether the popover is open. */
  @property({ type: Boolean, reflect: true }) open = false

  /** Preferred side of the trigger. */
  @property({ type: String }) placement: Placement = 'bottom'

  /** Alignment along the trigger. */
  @property({ type: String }) align: Align = 'center'

  /** How the popover is triggered. */
  @property({ type: String }) trigger: 'click' | 'hover' | 'manual' = 'click'

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
      inset: unset;
      border: none;
      padding: 0;
      background: none;
      overflow: visible;
    }

    .content {
      max-inline-size: 20rem;
      padding: var(--s0);
      color: var(--film-color-text);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius);
      box-shadow: var(--film-shadow-2);
    }

    .panel:popover-open {
      display: block;
    }
  `

  private get triggerEl (): HTMLElement | undefined {
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

  connectedCallback (): void {
    super.connectedCallback()
    this.triggerEl?.setAttribute('aria-haspopup', 'dialog')
  }

  disconnectedCallback (): void {
    this.cleanup?.()
    super.disconnectedCallback()
  }

  updated (changed: PropertyValues<this>): void {
    if (!changed.has('open')) return
    this.triggerEl?.setAttribute('aria-expanded', String(this.open))
    if (this.open) this.openPanel()
    else this.closePanel()
  }

  private openPanel (): void {
    const trigger = this.triggerEl
    if (!trigger || !this.panel) return
    this.panel.showPopover()
    this.cleanup = anchorPosition(trigger, this.panel, { placement: this.placement, align: this.align })
    this.dispatchEvent(new Event('film-open'))
  }

  private closePanel (): void {
    this.cleanup?.()
    this.cleanup = undefined
    if (this.panel?.matches(':popover-open')) this.panel.hidePopover()
    this.dispatchEvent(new Event('film-close'))
  }

  private readonly onToggle = (event: Event): void => {
    // Keep `open` in sync with browser-driven light-dismiss / Escape.
    this.open = (event as ToggleEvent).newState === 'open'
  }

  private readonly onTriggerClick = (): void => {
    if (this.trigger === 'click') this.toggle()
  }

  private readonly onTriggerEnter = (): void => {
    if (this.trigger === 'hover') this.open = true
  }

  private readonly onTriggerLeave = (): void => {
    if (this.trigger === 'hover') this.open = false
  }

  render () {
    return html`
      <slot
        name="trigger"
        @click=${this.onTriggerClick}
        @mouseenter=${this.onTriggerEnter}
        @mouseleave=${this.onTriggerLeave}
      ></slot>
      <div
        class="panel"
        popover=${this.trigger === 'click' ? 'auto' : 'manual'}
        @toggle=${this.onToggle}
      >
        <div class="content"><slot></slot></div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-popover': Popover
  }
}
