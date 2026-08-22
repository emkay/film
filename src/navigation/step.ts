import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Step — a single step within a {@link Steps}. Its index and state are managed
 * by the parent `film-steps`.
 *
 * @slot - The step label (overrides `label`).
 */
@customElement('film-step')
export class Step extends FilmElement {
  /** The step label. */
  @property({ type: String }) label = ''

  /** The 0-based position. Managed by the parent. */
  @property({ type: Number, reflect: true }) index = 0

  /** Managed by the parent. */
  @property({ type: String, reflect: true }) state: 'complete' | 'active' | 'upcoming' = 'upcoming'

  static styles = css`
    :host {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--s-2);
      text-align: center;
    }

    .rail {
      display: flex;
      align-items: center;
      inline-size: 100%;
    }

    .line {
      flex: 1;
      block-size: var(--border-thin);
      background-color: var(--film-color-border);
    }

    :host(:first-child) .line.lead,
    :host(:last-child) .line.trail {
      visibility: hidden;
    }

    .marker {
      flex: 0 0 auto;
      inline-size: 1.9em;
      block-size: 1.9em;
      margin-inline: var(--s-2);
      border-radius: 50%;
      display: grid;
      place-content: center;
      border: var(--border-thin) solid var(--film-color-border);
      background-color: var(--film-color-surface);
      color: var(--film-color-text);
    }

    :host([state='active']) .marker {
      border-color: var(--film-color-inverted-surface);
      font-weight: 600;
    }

    :host([state='complete']) .marker {
      background-color: var(--film-color-inverted-surface);
      color: var(--film-color-inverted-text);
      border-color: var(--film-color-inverted-surface);
    }

    .check {
      inline-size: 0.9em;
      block-size: 0.9em;
    }

    .label {
      font-size: var(--s-1);
    }

    :host([state='upcoming']) .label {
      color: var(--film-color-text-muted);
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'listitem')
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('state')) {
      if (this.state === 'active') this.setAttribute('aria-current', 'step')
      else this.removeAttribute('aria-current')
    }
  }

  render () {
    return html`
      <div class="rail">
        <span class="line lead"></span>
        <span class="marker">
          ${this.state === 'complete'
            ? html`<svg class="check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path d="M3 8.5l3.5 3.5L13 4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>`
            : this.index + 1}
        </span>
        <span class="line trail"></span>
      </div>
      <span class="label"><slot>${this.label}</slot></span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-step': Step
  }
}
