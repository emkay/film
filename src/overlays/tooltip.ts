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

  /**
   * The `content` text, kept in the light DOM beside the trigger. The visible
   * tip lives in this element's shadow root, and an `aria-describedby` ID can't
   * reach into a shadow root — so the trigger is described by this copy
   * instead. It's slotted into a hidden container: unslotted content isn't in
   * the flat tree at all, so it would have no accessibility node to read.
   */
  private readonly description = Object.assign(document.createElement('span'), {
    id: `${this.tipId}-description`
  })

  /** The trigger we last described, and the ID tokens we added to it. */
  private described?: { target: HTMLElement, ids: string[] }

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
    this.description.setAttribute('slot', 'film-tooltip-description')
    if (this.description.parentNode !== this) this.append(this.description)
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
    if (changed.has('content')) {
      this.description.textContent = this.content
      this.describe()
    }
    if (!changed.has('open')) return
    if (this.open) this.floating.show()
    else this.floating.hide()
  }

  /**
   * Point the trigger's `aria-describedby` at the description: the `content`
   * copy and any rich `slot="content"` elements, which are already light DOM.
   * Always, not only while open — a screen reader announces the focused
   * element straight away, before the tip would have opened. The trigger's own
   * describedby tokens are kept.
   */
  private readonly describe = (): void => {
    const rich = (this.shadowRoot?.querySelector('slot[name="content"]') as HTMLSlotElement | null)
      ?.assignedElements() ?? []
    rich.forEach((el, i) => { el.id ||= `${this.tipId}-content-${i}` })
    const ids = [...(this.content ? [this.description.id] : []), ...rich.map((el) => el.id)]

    const target = this.target
    const previous = this.described
    if (previous) {
      const kept = (previous.target.getAttribute('aria-describedby') ?? '')
        .split(/\s+/).filter((id) => id && !previous.ids.includes(id))
      if (kept.length) previous.target.setAttribute('aria-describedby', kept.join(' '))
      else previous.target.removeAttribute('aria-describedby')
    }
    if (!target || ids.length === 0) {
      this.described = undefined
      return
    }
    const own = (target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean)
    target.setAttribute('aria-describedby', [...own, ...ids.filter((id) => !own.includes(id))].join(' '))
    this.described = { target, ids }
  }

  render () {
    return html`
      <slot @slotchange=${this.describe}></slot>
      <div class="tip" id=${this.tipId} role="tooltip" popover="manual">
        ${this.content}<slot name="content" @slotchange=${this.describe}></slot>
      </div>
      <div hidden><slot name="film-tooltip-description"></slot></div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-tooltip': Tooltip
  }
}
