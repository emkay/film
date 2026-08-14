import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger'

const SURFACES: Record<BadgeVariant, string> = {
  neutral: 'var(--color-dark)',
  accent: 'var(--surface-info)',
  success: 'var(--surface-success)',
  warning: 'var(--surface-warning)',
  danger: 'var(--surface-danger)'
}

/**
 * Badge — a small pill for counts, statuses and tags.
 *
 * @slot - The badge content.
 */
@customElement('film-badge')
export class Badge extends FilmElement {
  /** The colour treatment. */
  @property({ type: String })
  variant: BadgeVariant = 'neutral'

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.4em;
      padding: 0.2em 0.6em;
      border-radius: 999px;
      font-size: var(--s-1);
      line-height: 1;
      white-space: nowrap;
      background-color: var(--badge-surface, var(--color-dark));
      color: var(--badge-ink, var(--color-light));
    }
  `

  updated () {
    this.reflectStyleProps({
      '--badge-surface': SURFACES[this.variant] ?? SURFACES.neutral,
      '--badge-ink': this.variant === 'neutral' ? 'var(--color-light)' : 'var(--color-dark)'
    })
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-badge': Badge
  }
}
