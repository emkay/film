import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import type { AccordionItem } from './accordion-item.js'

/**
 * Accordion — a group of {@link AccordionItem}s. By default opening one closes
 * the others; set `multiple` to allow several open at once.
 *
 * @slot - The `film-accordion-item` children.
 */
@customElement('film-accordion')
export class Accordion extends FilmElement {
  /** Allow more than one item open at a time. */
  @property({ type: Boolean }) multiple = false

  static styles = css`
    :host {
      display: block;
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius-lg);
      overflow: hidden;
    }
  `

  private get items (): AccordionItem[] {
    return Array.from(this.querySelectorAll('film-accordion-item'))
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.addEventListener('film-toggle', this.onToggle as EventListener)
  }

  private readonly onToggle = (event: CustomEvent<{ open: boolean }>): void => {
    if (this.multiple || !event.detail.open) return
    const opened = event.target as AccordionItem
    for (const item of this.items) {
      if (item !== opened) item.open = false
    }
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-accordion': Accordion
  }
}
