import { css, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { FilmToggleControl } from '../internal/toggle-control.js'

/**
 * Switch — a form-associated on/off toggle (`switch` role).
 *
 * @slot - The label.
 * @fires change - When the checked state changes.
 */
@customElement('film-switch')
export class Switch extends FilmToggleControl {
  protected readonly toggleRole = 'switch'

  @query('.track') private track!: HTMLElement

  protected override get validationAnchor (): HTMLElement | undefined {
    return this.track ?? undefined
  }

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--s-1);
      cursor: pointer;
    }

    :host([disabled]) {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }

    .track {
      inline-size: 2.2em;
      block-size: 1.2em;
      flex: 0 0 auto;
      border-radius: var(--film-radius-pill);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      padding: 0.1em;
      display: flex;
      transition: background-color var(--film-duration-fast) var(--film-ease);
    }

    :host([checked]) .track {
      background-color: var(--film-color-inverted-surface);
    }

    .thumb {
      inline-size: 1em;
      block-size: 1em;
      border-radius: 50%;
      background-color: var(--film-color-inverted-surface);
      transition: transform var(--film-duration-fast) var(--film-ease), background-color var(--film-duration-fast) var(--film-ease);
    }

    :host([checked]) .thumb {
      background-color: var(--film-color-surface);
      transform: translateX(1em);
    }

    :host(:focus-visible) {
      outline: none;
    }

    :host(:focus-visible) .track {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: 2px;
    }
  `

  render () {
    return html`
      <span class="track" aria-hidden="true"><span class="thumb"></span></span>
      <slot></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-switch': Switch
  }
}
