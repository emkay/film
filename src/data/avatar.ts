import { css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Avatar — a user image with graceful fallback to initials derived from
 * `label`.
 */
@customElement('film-avatar')
export class Avatar extends FilmElement {
  /** The image URL. When absent (or it fails to load), initials are shown. */
  @property({ type: String }) src = ''

  /** The person's name — used for initials and the image alt text. */
  @property({ type: String }) label = ''

  /** The avatar shape. */
  @property({ type: String, reflect: true }) shape: 'circle' | 'square' = 'circle'

  /** The size, as any length. Defaults to a modular-scale step. */
  @property({ type: String }) size = 'var(--s3)'

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--avatar-size, var(--s3));
      block-size: var(--avatar-size, var(--s3));
      border-radius: 50%;
      overflow: hidden;
      background-color: var(--film-color-inverted-surface);
      color: var(--film-color-inverted-text);
      font-size: var(--s-1);
      user-select: none;
    }

    :host([shape='square']) {
      border-radius: var(--film-radius);
    }

    img {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }
  `

  private get initials (): string {
    return this.label
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('')
  }

  static styleProps: Record<string, string> = { '--avatar-size': 'size' }

  private onError (): void {
    this.src = ''
  }

  render () {
    return this.src
      ? html`<img src=${this.src} alt=${this.label || nothing} @error=${this.onError} />`
      : html`<span aria-hidden=${this.label ? nothing : 'true'}>${this.initials}</span>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-avatar': Avatar
  }
}
