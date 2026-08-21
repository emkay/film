import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Stack — inserts even, scale-based spacing between its children and nothing
 * around them. Composition primitive: the Stack owns the space *between* items
 * so the items themselves stay margin-free.
 *
 * @slot - The elements to space out vertically.
 */
@customElement('film-stack')
export class Stack extends FilmElement {
  /** The space between children. Any length; defaults to a modular-scale step. */
  @property({ type: String })
  space = 'var(--s1)'

  /**
   * When set, the child at this 1-based index gets an auto bottom margin, so
   * everything after it is pushed to the end of the stack (e.g. a footer).
   */
  @property({ type: Number, attribute: 'split-after' })
  splitAfter: number | null = null

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: var(--stack-space, var(--s1));
    }
  `

  private get splitStyles () {
    if (!this.splitAfter) return html``
    return html`
      <style>
        ::slotted(:nth-child(${this.splitAfter})) {
          margin-block-end: auto;
        }
      </style>
    `
  }

  static styleProps: Record<string, string> = { '--stack-space': 'space' }

  render () {
    return html`${this.splitStyles}<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-stack': Stack
  }
}
