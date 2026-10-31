import { css, html, type PropertyValues } from 'lit'
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
  /** The space between children. A scale step (`s1`) or any CSS length. */
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

  /**
   * The split rule lives in a constructed stylesheet, not a <style> element: a
   * strict Content-Security-Policy blocks inline <style>, and text written
   * into one could carry rules of its own. Only a positive whole number gets
   * through, whatever `splitAfter` was set to from JavaScript.
   */
  private readonly splitSheet = new CSSStyleSheet()

  updated (changed: PropertyValues<this>): void {
    super.updated(changed)
    if (!changed.has('splitAfter')) return
    const n = Number(this.splitAfter)
    this.splitSheet.replaceSync(Number.isInteger(n) && n > 0
      ? `::slotted(:nth-child(${n})) { margin-block-end: auto; }`
      : '')
    const root = this.shadowRoot as ShadowRoot
    if (!root.adoptedStyleSheets.includes(this.splitSheet)) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, this.splitSheet]
    }
  }

  static styleProps: Record<string, string> = { '--stack-space': 'space' }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-stack': Stack
  }
}
