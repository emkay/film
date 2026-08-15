import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger'

const SURFACES: Record<BadgeVariant, string> = {
  neutral: 'var(--film-color-inverted-surface)',
  accent: 'var(--film-color-info)',
  success: 'var(--film-color-success)',
  warning: 'var(--film-color-warning)',
  danger: 'var(--film-color-danger)'
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
      border-radius: var(--film-radius-pill);
      font-size: var(--s-1);
      line-height: 1;
      white-space: nowrap;
      background-color: var(--badge-surface, var(--film-color-inverted-surface));
      color: var(--badge-ink, var(--film-color-inverted-text));
    }
  `

  updated () {
    this.reflectStyleProps({
      '--badge-surface': SURFACES[this.variant] ?? SURFACES.neutral,
      '--badge-ink': this.variant === 'neutral' ? 'var(--film-color-inverted-text)' : 'var(--film-color-text)'
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
