import { css, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { FilmToggleControl } from '../internal/toggle-control.js'

/**
 * Checkbox — a form-associated checkbox. The host element is the control, so it
 * carries the `checkbox` role and keyboard behaviour.
 *
 * @slot - The label.
 * @fires change - When the checked state changes.
 */
@customElement('film-checkbox')
export class Checkbox extends FilmToggleControl {
  protected readonly toggleRole = 'checkbox'

  @query('.box') private box!: HTMLElement

  protected override get validationAnchor (): HTMLElement | undefined {
    return this.box ?? undefined
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

    .box {
      inline-size: 1.15em;
      block-size: 1.15em;
      flex: 0 0 auto;
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius-sm);
      background-color: var(--film-color-surface);
      display: grid;
      place-content: center;
    }

    :host([checked]) .box {
      background-color: var(--film-color-inverted-surface);
    }

    .check {
      inline-size: 0.7em;
      block-size: 0.7em;
      color: var(--film-color-inverted-text);
      visibility: hidden;
    }

    :host([checked]) .check {
      visibility: visible;
    }

    :host(:focus-visible) {
      outline: none;
    }

    :host(:focus-visible) .box {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: 2px;
    }
  `

  render () {
    return html`
      <span class="box" aria-hidden="true">
        <svg class="check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M3 8.5l3.5 3.5L13 4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <slot></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-checkbox': Checkbox
  }
}
