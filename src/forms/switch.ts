import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'

/**
 * Switch — a form-associated on/off toggle (`switch` role).
 *
 * @slot - The label.
 * @fires change - When the checked state changes.
 */
@customElement('film-switch')
export class Switch extends FilmFormControl {
  /** Whether the switch is on. */
  @property({ type: Boolean, reflect: true }) checked = false

  /** The value submitted when on. */
  @property({ type: String }) value = 'on'

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--s-1);
      cursor: pointer;
    }

    :host([disabled]) {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .track {
      inline-size: 2.2em;
      block-size: 1.2em;
      flex: 0 0 auto;
      border-radius: 1em;
      background-color: var(--color-light);
      border: var(--border-thin) solid var(--color-dark);
      padding: 0.1em;
      display: flex;
      transition: background-color 0.15s ease;
    }

    :host([checked]) .track {
      background-color: var(--color-dark);
    }

    .thumb {
      inline-size: 1em;
      block-size: 1em;
      border-radius: 50%;
      background-color: var(--color-dark);
      transition: transform 0.15s ease, background-color 0.15s ease;
    }

    :host([checked]) .thumb {
      background-color: var(--color-light);
      transform: translateX(1em);
    }

    :host(:focus-visible) {
      outline: none;
    }

    :host(:focus-visible) .track {
      outline: var(--border-thin) solid var(--color-links);
      outline-offset: 2px;
    }
  `

  constructor () {
    super()
    this.addEventListener('click', () => this.toggle())
    this.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        this.toggle()
      }
    })
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', this.getAttribute('role') ?? 'switch')
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0
  }

  protected getFormValue (): string | null {
    return this.checked ? this.value : null
  }

  formResetCallback (): void {
    this.checked = this.hasAttribute('checked')
    this.syncForm()
  }

  firstUpdated (): void {
    this.syncForm()
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('checked')) {
      this.setAttribute('aria-checked', String(this.checked))
      this.syncForm()
    }
    if (changed.has('disabled')) {
      this.setAttribute('aria-disabled', String(this.disabled))
      this.tabIndex = this.disabled ? -1 : 0
    }
  }

  private toggle (): void {
    if (this.disabled) return
    this.checked = !this.checked
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }

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
