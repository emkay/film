import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

export type TagVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger'

const SURFACES: Record<TagVariant, string> = {
  neutral: 'var(--color-light)',
  accent: 'var(--surface-info)',
  success: 'var(--surface-success)',
  warning: 'var(--surface-warning)',
  danger: 'var(--surface-danger)'
}

/**
 * Tag — a labelled chip, optionally removable.
 *
 * @slot - The tag content.
 * @fires film-remove - When the remove button is activated.
 */
@customElement('film-tag')
export class Tag extends FilmElement {
  /** The colour treatment. */
  @property({ type: String }) variant: TagVariant = 'neutral'

  /** Show a remove button. */
  @property({ type: Boolean, reflect: true }) removable = false

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--s-2);
      padding: 0.15em 0.5em;
      border: var(--border-thin) solid var(--color-dark);
      border-radius: var(--s-3);
      background-color: var(--tag-surface, var(--color-light));
      color: var(--color-dark);
      font-size: var(--s-1);
      line-height: 1.4;
    }

    .remove {
      border: none;
      background: none;
      color: inherit;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      font-size: 0.9em;
      opacity: 0.7;
    }

    .remove:hover {
      opacity: 1;
    }

    .remove:focus-visible {
      outline: var(--border-thin) solid var(--color-links);
    }
  `

  updated (changed: PropertyValues<this>): void {
    if (changed.has('variant')) {
      this.reflectStyleProps({ '--tag-surface': SURFACES[this.variant] ?? SURFACES.neutral })
    }
  }

  private onRemove (): void {
    this.dispatchEvent(new Event('film-remove', { bubbles: true }))
  }

  render () {
    return html`
      <slot></slot>
      ${this.removable
        ? html`<button class="remove" aria-label="Remove" @click=${this.onRemove}>✕</button>`
        : nothing}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-tag': Tag
  }
}
