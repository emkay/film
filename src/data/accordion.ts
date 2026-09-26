import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { ownDescendants } from '../internal/dom.js'
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
    return ownDescendants<AccordionItem>(this, 'film-accordion-item')
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.addEventListener('film-toggle', this.onToggle as EventListener)
  }

  private readonly onToggle = (event: CustomEvent<{ open: boolean }>): void => {
    if (this.multiple || !event.detail.open) return
    // film-toggle also bubbles from film-details and nested accordions inside a
    // panel; only one of this accordion's own items opening should close the rest.
    const opened = event.target as AccordionItem
    if (!this.items.includes(opened)) return
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
