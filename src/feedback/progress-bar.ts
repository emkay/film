import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * ProgressBar — a determinate or indeterminate progress indicator.
 */
@customElement('film-progress-bar')
export class ProgressBar extends FilmElement {
  /** The current value. */
  @property({ type: Number }) value = 0

  /** The maximum value. */
  @property({ type: Number }) max = 100

  /** Show an indeterminate animation instead of a value. */
  @property({ type: Boolean, reflect: true }) indeterminate = false

  /** An accessible label. */
  @property({ type: String }) label = ''

  static styles = css`
    :host {
      display: block;
    }

    .track {
      block-size: var(--s0);
      inline-size: 100%;
      background-color: var(--color-light);
      border: var(--border-thin) solid var(--color-dark);
      border-radius: 1em;
      overflow: hidden;
    }

    .fill {
      block-size: 100%;
      background-color: var(--color-dark);
      transition: inline-size 0.2s ease;
    }

    :host([indeterminate]) .fill {
      inline-size: 40% !important;
      animation: slide 1.2s ease-in-out infinite;
    }

    @keyframes slide {
      from { transform: translateX(-100%); }
      to { transform: translateX(300%); }
    }

    @media (prefers-reduced-motion: reduce) {
      :host([indeterminate]) .fill {
        animation: none;
        inline-size: 100% !important;
      }
    }
  `

  private get percent (): number {
    return Math.max(0, Math.min(100, (this.value / this.max) * 100))
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'progressbar')
  }

  updated (changed: PropertyValues<this>): void {
    if (this.label && changed.has('label')) this.setAttribute('aria-label', this.label)
    if (this.indeterminate) {
      this.removeAttribute('aria-valuenow')
    } else {
      this.setAttribute('aria-valuemin', '0')
      this.setAttribute('aria-valuemax', String(this.max))
      this.setAttribute('aria-valuenow', String(this.value))
    }
  }

  render () {
    return html`
      <div class="track">
        <div class="fill" style=${this.indeterminate ? nothing : `inline-size: ${this.percent}%`}></div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-progress-bar': ProgressBar
  }
}
