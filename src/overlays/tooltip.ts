import { css, html, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { PLACEMENTS, type Placement } from '../internal/anchor-position.js'
import { PopoverController } from '../internal/popover-controller.js'

/**
 * Tooltip — shows a short hint on hover or focus of its slotted target. The
 * hint is promoted to the top layer via the Popover API and positioned by the
 * anchoring helper.
 *
 * @slot - The target element the tooltip describes.
 * @slot content - Rich tooltip content (overrides `content`).
 */
@customElement('film-tooltip')
export class Tooltip extends FilmElement {
  static allowedValues = { placement: PLACEMENTS }

  /** The tooltip text. */
  @property({ type: String }) content = ''

  /** Which side of the target the tooltip prefers. */
  @property({ type: String }) placement: Placement = 'top'

  @property({ type: Boolean, reflect: true }) open = false

  @query('.tip') private tip!: HTMLElement
  @query('slot:not([name])') private targetSlot!: HTMLSlotElement

  private readonly floating = new PopoverController(this, {
    anchor: (): HTMLElement => this.target ?? this,
    panel: () => this.tip,
    options: () => ({ placement: this.placement, align: 'center' })
  })
  private static counter = 0
  private readonly tipId = `film-tooltip-${(Tooltip.counter += 1)}`

  static styles = css`
    :host {
      display: inline-block;
    }

    .tip {
      margin: 0;
      inset: unset;
      max-inline-size: 24ch;
      padding: var(--s-3) var(--s-1);
      font-size: var(--s-1);
      color: var(--film-color-inverted-text);
      background-color: var(--film-color-inverted-surface);
      border: none;
      border-radius: var(--film-radius-sm);
      box-shadow: var(--film-shadow-1);
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    this.addEventListener('mouseenter', this.show)
    this.addEventListener('mouseleave', this.hide)
    this.addEventListener('focusin', this.show)
    this.addEventListener('focusout', this.hide)
    this.addEventListener('keydown', this.onKeydown)
  }

  disconnectedCallback (): void {
    this.removeEventListener('mouseenter', this.show)
    this.removeEventListener('mouseleave', this.hide)
    this.removeEventListener('focusin', this.show)
    this.removeEventListener('focusout', this.hide)
    this.removeEventListener('keydown', this.onKeydown)
    super.disconnectedCallback()
  }

  private get target (): HTMLElement | undefined {
    return this.targetSlot?.assignedElements()[0] as HTMLElement | undefined
  }

  show = (): void => {
    this.open = true
  }

  hide = (): void => {
    this.open = false
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') this.hide()
  }

  updated (changed: PropertyValues<this>): void {
    super.updated(changed)
    if (!changed.has('open')) return
    if (this.open) {
      this.target?.setAttribute('aria-describedby', this.tipId)
      this.floating.show()
    } else {
      this.target?.removeAttribute('aria-describedby')
      this.floating.hide()
    }
  }

  render () {
    return html`
      <slot></slot>
      <div class="tip" id=${this.tipId} role="tooltip" popover="manual">
        ${this.content}<slot name="content"></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-tooltip': Tooltip
  }
}
