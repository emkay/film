import { css, html, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { oneOf } from '../internal/attribute-check.js'
import { ALIGNS, PLACEMENTS, type Align, type Placement } from '../internal/anchor-position.js'
import { PopoverController } from '../internal/popover-controller.js'

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
  static allowedValues = {
    placement: PLACEMENTS,
    align: ALIGNS,
    trigger: oneOf<Popover['trigger']>()('click', 'hover', 'manual')
  }

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

  private readonly floating = new PopoverController(this, {
    anchor: () => this.triggerEl,
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

  disconnectedCallback (): void {
    clearTimeout(this.closeTimer)
    document.removeEventListener('keydown', this.onDocumentKeydown)
    super.disconnectedCallback()
  }

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

  // On slotchange rather than connect: on first connect the trigger slot isn't
  // rendered yet, so there's no trigger to label. This also covers a trigger
  // that's swapped for another.
  private readonly onTriggerSlotChange = (): void => {
    this.triggerEl?.setAttribute('aria-haspopup', 'dialog')
    this.triggerEl?.setAttribute('aria-expanded', String(this.open))
  }

  updated (changed: PropertyValues<this>): void {
    super.updated(changed)
    if (!changed.has('open')) return
    this.triggerEl?.setAttribute('aria-expanded', String(this.open))
    // Announce only real transitions. `open` starts false, so the first render
    // must not report a close; and when the browser dismisses the panel (Escape,
    // click outside) it is already hidden, so the DOM can't say it was open —
    // the previous value of `open` can.
    const wasOpen = changed.get('open') === true
    const alreadyShown = this.floating.isOpen
    if (this.open && this.trigger !== 'click') document.addEventListener('keydown', this.onDocumentKeydown)
    else document.removeEventListener('keydown', this.onDocumentKeydown)
    if (this.open) {
      if (this.floating.show() && !alreadyShown) this.dispatchEvent(new Event('film-open'))
    } else {
      this.floating.hide()
      if (wasOpen) this.dispatchEvent(new Event('film-close'))
    }
  }


  private readonly onToggle = (event: Event): void => {
    // Keep `open` in sync with browser-driven light-dismiss / Escape.
    this.open = (event as ToggleEvent).newState === 'open'
  }

  private readonly onTriggerClick = (): void => {
    if (this.trigger === 'click') this.toggle()
  }

  /**
   * Hover mode (WCAG 1.4.13): the panel must stay open while the pointer is on
   * it, so leaving the trigger only closes after a short grace period — long
   * enough to cross onto the panel, which cancels it.
   */
  private closeTimer?: ReturnType<typeof setTimeout>

  private readonly onTriggerEnter = (): void => {
    if (this.trigger !== 'hover') return
    clearTimeout(this.closeTimer)
    this.open = true
  }

  private readonly onTriggerLeave = (): void => {
    if (this.trigger === 'hover') this.closeSoon()
  }

  private readonly onPanelEnter = (): void => {
    if (this.trigger === 'hover') clearTimeout(this.closeTimer)
  }

  private readonly onPanelLeave = (): void => {
    if (this.trigger === 'hover') this.closeSoon()
  }

  private closeSoon (): void {
    clearTimeout(this.closeTimer)
    this.closeTimer = setTimeout(() => { this.open = false }, 150)
  }

  // A click popover is popover="auto", so the browser closes it on Escape.
  // Hover and manual ones aren't, so Escape is handled here — on the document,
  // since focus can be anywhere while the pointer holds it open.
  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.open) this.open = false
  }

  render () {
    return html`
      <slot
        name="trigger"
        @slotchange=${this.onTriggerSlotChange}
        @click=${this.onTriggerClick}
        @mouseenter=${this.onTriggerEnter}
        @mouseleave=${this.onTriggerLeave}
      ></slot>
      <div
        class="panel"
        popover=${this.trigger === 'click' ? 'auto' : 'manual'}
        @mouseenter=${this.onPanelEnter}
        @mouseleave=${this.onPanelLeave}
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
