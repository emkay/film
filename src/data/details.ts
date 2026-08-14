import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Details — a themed disclosure built on the native `<details>`/`<summary>`
 * elements, so it is keyboard accessible by default.
 *
 * @slot - The disclosed content.
 * @slot summary - The summary (overrides `summary`).
 * @fires film-toggle - When opened or closed. `detail.open` reflects the state.
 */
@customElement('film-details')
export class Details extends FilmElement {
  /** Whether the disclosure is open. */
  @property({ type: Boolean, reflect: true }) open = false

  /** The summary text. */
  @property({ type: String }) summary = ''

  static styles = css`
    :host {
      display: block;
    }

    details {
      border: var(--border-thin) solid var(--color-dark);
      border-radius: var(--s-1);
      background-color: var(--color-light);
      color: var(--color-dark);
    }

    summary {
      cursor: pointer;
      padding: var(--s-1) var(--s0);
      font-weight: 600;
      list-style-position: inside;
    }

    summary:focus-visible {
      outline: var(--border-thin) solid var(--color-links);
      outline-offset: -2px;
    }

    .content {
      padding: 0 var(--s0) var(--s0);
    }
  `

  private onToggle (event: Event): void {
    const open = (event.target as HTMLDetailsElement).open
    if (open === this.open) return
    this.open = open
    this.dispatchEvent(new CustomEvent('film-toggle', { detail: { open }, bubbles: true }))
  }

  render () {
    return html`
      <details ?open=${this.open} @toggle=${this.onToggle}>
        <summary><slot name="summary">${this.summary}</slot></summary>
        <div class="content"><slot></slot></div>
      </details>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-details': Details
  }
}
