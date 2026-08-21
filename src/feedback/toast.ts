import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { variantSurface } from '../internal/variant-surface.js'
import type { AlertVariant } from './alert.js'

/**
 * Toast — a single transient notification. Usually created via the {@link toast}
 * helper rather than authored directly. Auto-dismisses after `duration` ms
 * (0 keeps it until dismissed); hovering pauses the timer.
 *
 * @slot - The message.
 * @fires film-close - When dismissed (after the exit transition).
 */
@customElement('film-toast')
export class Toast extends FilmElement {
  /** The colour treatment. */
  @property({ type: String }) variant: AlertVariant = 'info'

  /** Auto-dismiss delay in ms (0 = stay until dismissed). */
  @property({ type: Number }) duration = 4000

  /** Whether the toast is shown (drives the enter/exit transition). */
  @property({ type: Boolean, reflect: true }) open = false

  private timer?: ReturnType<typeof setTimeout>

  static styles = css`
    :host {
      display: block;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: var(--s-1);
      padding: var(--s-1) var(--s0);
      min-inline-size: 14ch;
      max-inline-size: 42ch;
      color: var(--film-color-text);
      background-color: var(--toast-surface, var(--film-color-info));
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius);
      transition: opacity 0.2s ease, transform 0.2s ease;
    }

    :host(:not([open])) .toast {
      opacity: 0;
      transform: translateY(0.5rem);
    }

    .message {
      flex: 1;
    }

    .close {
      border: none;
      background: none;
      color: inherit;
      cursor: pointer;
      font-size: 0.9em;
      line-height: 1;
      padding: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .toast {
        transition: none;
      }
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    const assertive = this.variant === 'danger' || this.variant === 'warning'
    this.setAttribute('role', assertive ? 'alert' : 'status')
  }

  disconnectedCallback (): void {
    if (this.timer) clearTimeout(this.timer)
    super.disconnectedCallback()
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('variant')) {
      this.reflectStyleProps({ '--toast-surface': variantSurface(this.variant, 'var(--film-color-info)') })
    }
  }

  show (): void {
    this.open = true
    this.restart()
  }

  close (): void {
    if (!this.open) return
    this.open = false
    if (this.timer) clearTimeout(this.timer)
    // Let the exit transition play before signalling removal.
    setTimeout(() => this.dispatchEvent(new Event('film-close', { bubbles: true })), 200)
  }

  private restart (): void {
    if (this.timer) clearTimeout(this.timer)
    if (this.duration > 0) this.timer = setTimeout(() => this.close(), this.duration)
  }

  private readonly onEnter = (): void => {
    if (this.timer) clearTimeout(this.timer)
  }

  private readonly onLeave = (): void => this.restart()

  render () {
    return html`
      <div class="toast" @mouseenter=${this.onEnter} @mouseleave=${this.onLeave}>
        <span class="message"><slot></slot></span>
        <button class="close" @click=${this.close} aria-label="Dismiss">✕</button>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-toast': Toast
  }
}
