import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import type { Step } from './step.js'

/**
 * Steps — a horizontal progress stepper. Marks each {@link Step} as complete,
 * active, or upcoming based on `current`.
 *
 * @slot - The `film-step` children.
 */
@customElement('film-steps')
export class Steps extends FilmElement {
  /** The 0-based index of the active step. */
  @property({ type: Number }) current = 0

  static styles = css`
    :host {
      display: flex;
      align-items: flex-start;
    }
  `

  private get steps (): Step[] {
    return Array.from(this.querySelectorAll('film-step'))
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'list')
  }

  firstUpdated (): void {
    this.sync()
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('current')) this.sync()
  }

  private sync = (): void => {
    this.steps.forEach((step, index) => {
      step.index = index
      step.state = index < this.current ? 'complete' : index === this.current ? 'active' : 'upcoming'
    })
  }

  render () {
    return html`<slot @slotchange=${this.sync}></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-steps': Steps
  }
}
