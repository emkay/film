import { css, html, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Switcher — lays children out in a row, but switches them to a vertical stack
 * once the container gets narrower than `threshold`. Set `limit` to also force
 * the stack whenever there are more than that many children.
 *
 * @slot - The elements to switch between horizontal and vertical.
 */
@customElement('film-switcher')
export class Switcher extends FilmElement {
  /** The gap between items. A scale step (`s1`) or any CSS length. */
  @property({ type: String })
  space = 'var(--s1)'

  /** The container width at which the layout flips to a vertical stack. */
  @property({ type: String })
  threshold = '30rem'

  /** Force a vertical stack when there are more than this many children (0 = never). */
  @property({ type: Number })
  limit = 0

  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: var(--switcher-space, var(--s1));
    }

    ::slotted(*) {
      flex-grow: 1;
      flex-basis: calc((var(--switcher-threshold, 30rem) - 100%) * 999);
    }

    :host(:state(over-limit)) {
      flex-direction: column;
    }

    :host(:state(over-limit)) ::slotted(*) {
      flex-basis: auto;
    }
  `

  static styleProps: Record<string, string> = {
    '--switcher-space': 'space',
    '--switcher-threshold': 'threshold'
  }

  @query('slot') private slotEl!: HTMLSlotElement

  // A custom state rather than a host class: `class` belongs to the consumer,
  // and a React className or Lit class binding would silently wipe ours.
  private readonly internals = this.attachInternals()

  private applyLimit (): void {
    const count = this.slotEl?.assignedElements().length ?? 0
    if (this.limit > 0 && count > this.limit) this.internals.states.add('over-limit')
    else this.internals.states.delete('over-limit')
  }

  private readonly onSlotChange = (): void => this.applyLimit()

  updated (changed: PropertyValues<this>): void {
    super.updated(changed)
    if (changed.has('limit')) this.applyLimit()
  }

  render () {
    return html`<slot @slotchange=${this.onSlotChange}></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-switcher': Switcher
  }
}
