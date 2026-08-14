import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

const SURFACES: Record<AlertVariant, string> = {
  info: 'var(--surface-info)',
  success: 'var(--surface-success)',
  warning: 'var(--surface-warning)',
  danger: 'var(--surface-danger)'
}

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
      border-inline-start: var(--border-thick) solid var(--color-dark);
      border-radius: var(--s-2);
      background-color: var(--alert-surface, var(--surface-info));
      color: var(--color-dark);
    }

    .icon {
      flex: 0 0 auto;
    }

    .content ::slotted(*) {
      margin: 0;
    }
  `

  updated () {
    this.reflectStyleProps({
      '--alert-surface': SURFACES[this.variant] ?? SURFACES.info
    })
    if (!this.hasAttribute('role')) {
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
