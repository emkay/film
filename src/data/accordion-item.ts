import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

let uid = 0

/**
 * AccordionItem — a single collapsible panel within an {@link Accordion}.
 *
 * @slot - The panel content.
 * @slot summary - The header content (overrides `summary`).
 * @fires film-toggle - When opened or closed. `detail.open` reflects the state.
 */
@customElement('film-accordion-item')
export class AccordionItem extends FilmElement {
  /** Whether the panel is open. */
  @property({ type: Boolean, reflect: true }) open = false

  /** The header text. */
  @property({ type: String }) summary = ''

  /** Whether the item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false

  private readonly headerId = `film-accordion-header-${(uid += 1)}`
  private readonly panelId = `film-accordion-panel-${uid}`

  static styles = css`
    :host {
      display: block;
    }

    :host(:not(:first-child)) {
      border-block-start: var(--border-thin) solid var(--film-color-border);
    }

    .header {
      margin: 0;
      font-size: inherit;
    }

    button {
      inline-size: 100%;
      display: flex;
      align-items: center;
      gap: var(--s-1);
      font: inherit;
      text-align: start;
      color: var(--film-color-text);
      background: none;
      border: none;
      padding: var(--s-1) var(--s0);
      cursor: pointer;
    }

    button:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: -2px;
    }

    button[disabled] {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }

    .marker {
      transition: transform var(--film-duration-fast) var(--film-ease);
    }

    :host([open]) .marker {
      transform: rotate(90deg);
    }

    .panel {
      padding: 0 var(--s0) var(--s0);
    }

    .panel[hidden] {
      display: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .marker {
        transition: none;
      }
    }
  `

  private toggle (): void {
    if (this.disabled) return
    this.open = !this.open
    this.dispatchEvent(new CustomEvent('film-toggle', { detail: { open: this.open }, bubbles: true }))
  }

  render () {
    return html`
      <h3 class="header">
        <button
          id=${this.headerId}
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls=${this.panelId}
          ?disabled=${this.disabled}
          @click=${this.toggle}
        >
          <span class="marker" aria-hidden="true">▸</span>
          <slot name="summary">${this.summary}</slot>
        </button>
      </h3>
      <div
        class="panel"
        id=${this.panelId}
        role="region"
        aria-labelledby=${this.headerId}
        ?hidden=${!this.open}
      >
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-accordion-item': AccordionItem
  }
}
