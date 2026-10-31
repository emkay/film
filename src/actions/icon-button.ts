import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { warningsEnabled, warnOnce } from '../internal/attribute-check.js'

/**
 * IconButton — a compact, square button for a single icon. The `label` is
 * required for accessibility (there's no visible text).
 *
 * @slot - The icon (typically an inline `<svg>`).
 */
@customElement('film-icon-button')
export class IconButton extends FilmElement {
  /** Accessible label — required, since the button has no visible text. */
  @property({ type: String }) label = ''

  /** Disable the button. */
  @property({ type: Boolean, reflect: true }) disabled = false

  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      display: inline-grid;
      place-content: center;
      inline-size: 2em;
      block-size: 2em;
      padding: 0;
      font: inherit;
      color: var(--film-color-text);
      background: none;
      border: var(--border-thin) solid transparent;
      border-radius: var(--film-radius);
      cursor: pointer;
    }

    button:hover {
      background-color: var(--film-color-info);
    }

    button:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: 1px;
    }

    button[disabled] {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }

    ::slotted(svg) {
      inline-size: 1.25em;
      block-size: 1.25em;
    }
  `

  // With no visible text, a missing label leaves the button with no name at
  // all (WCAG 4.1.2) — say so, like Film's other attribute warnings.
  updated (changed: PropertyValues<this>): void {
    super.updated(changed)
    if (changed.has('label') && !this.label && !this.hasAttribute('aria-label') && warningsEnabled()) {
      warnOnce('film-icon-button @label', 'film-icon-button has no label, so assistive tech announces it as an unnamed button.')
    }
  }

  render () {
    return html`
      <button ?disabled=${this.disabled} aria-label=${this.label}>
        <slot></slot>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-icon-button': IconButton
  }
}
