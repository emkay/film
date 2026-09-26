import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Reel — a horizontally scrolling strip of items with scroll snapping. Useful
 * for carousels, galleries and any "scroll sideways" list.
 *
 * When its items overflow, the reel joins the tab order so it can be scrolled
 * with the arrow keys, and leaves it again when everything fits. Give it a
 * `label` so the focused region is announced by name.
 *
 * @slot - The items in the reel.
 */
@customElement('film-reel')
export class Reel extends FilmElement {
  /** The gap between items. A scale step (`s1`) or any CSS length. */
  @property({ type: String })
  space = 'var(--s1)'

  /** The width of each item; `auto` lets items size to their content. */
  @property({ type: String, attribute: 'item-width' })
  itemWidth = 'auto'

  /** Names the reel as a region, announced when it takes keyboard focus. */
  @property({ type: String })
  label = ''

  /** Whether the tabindex is ours to manage, rather than set by the consumer. */
  private manageTabindex = true

  private readonly resizeObserver = new ResizeObserver(() => this.syncFocusable())

  static styles = css`
    :host {
      display: flex;
      gap: var(--reel-space, var(--s1));
      overflow-x: auto;
      overflow-y: hidden;
      scroll-snap-type: x proximity;
      overscroll-behavior-inline: contain;
    }

    ::slotted(*) {
      flex: 0 0 var(--reel-item-width, auto);
      scroll-snap-align: start;
    }
  `

  static styleProps: Record<string, string> = {
    '--reel-space': 'space',
    '--reel-item-width': 'itemWidth'
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.manageTabindex = !this.hasAttribute('tabindex')
    this.resizeObserver.observe(this)
  }

  disconnectedCallback (): void {
    this.resizeObserver.disconnect()
    super.disconnectedCallback()
  }

  updated (changed: PropertyValues<this>): void {
    super.updated(changed)
    if (!changed.has('label')) return
    if (this.label) {
      this.setAttribute('role', 'region')
      this.setAttribute('aria-label', this.label)
    } else {
      this.removeAttribute('role')
      this.removeAttribute('aria-label')
    }
  }

  // Scrollable content has to be reachable without a pointer. Only while it
  // overflows, though: a reel that fits would be a pointless tab stop.
  private readonly syncFocusable = (): void => {
    if (!this.manageTabindex) return
    if (this.scrollWidth > this.clientWidth) this.tabIndex = 0
    else this.removeAttribute('tabindex')
  }

  render () {
    return html`<slot @slotchange=${this.syncFocusable}></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-reel': Reel
  }
}
