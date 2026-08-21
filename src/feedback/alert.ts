import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { variantSurface } from '../internal/variant-surface.js'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

/**
 * Alert — a callout for contextual messages. Sets an appropriate ARIA role so
 * screen readers announce it (`alert` for warning/danger, `status` otherwise).
 *
 * @slot - The message content.
 * @slot icon - An optional leading icon.
 */
@customElement('film-alert')
export class Alert extends FilmElement {
  /** The severity / colour treatment. */
  @property({ type: String })
  variant: AlertVariant = 'info'

  static styles = css`
    :host {
      display: block;
    }

    .alert {
      display: flex;
      gap: var(--s0);
      padding: var(--s0);
      border-inline-start: var(--border-thick) solid var(--film-color-border);
      border-radius: var(--film-radius);
      background-color: var(--alert-surface, var(--film-color-info));
      color: var(--film-color-text);
    }

    .icon {
      flex: 0 0 auto;
    }

    .content ::slotted(*) {
      margin: 0;
    }
  `

  private manageRole = true

  connectedCallback (): void {
    super.connectedCallback()
    // Respect a consumer-provided role; otherwise derive it from `variant`.
    this.manageRole = !this.hasAttribute('role')
  }

  updated (changed: PropertyValues<this>): void {
    if (!changed.has('variant')) return
    this.reflectStyleProps({
      '--alert-surface': variantSurface(this.variant, 'var(--film-color-info)')
    })
    if (this.manageRole) {
      const assertive = this.variant === 'danger' || this.variant === 'warning'
      this.setAttribute('role', assertive ? 'alert' : 'status')
    }
  }

  render () {
    return html`
      <div class="alert">
        <span class="icon"><slot name="icon"></slot></span>
        <div class="content"><slot></slot></div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-alert': Alert
  }
}
