import { css, html, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'

/**
 * Checkbox — a form-associated checkbox. The host element is the control, so it
 * carries the `checkbox` role and keyboard behaviour.
 *
 * @slot - The label.
 * @fires change - When the checked state changes.
 */
@customElement('film-checkbox')
export class Checkbox extends FilmFormControl {
  /** Whether the checkbox is checked. */
  @property({ type: Boolean, reflect: true }) checked = false

  /** The value submitted when checked. */
  @property({ type: String }) value = 'on'

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
    this.setAttribute('role', this.getAttribute('role') ?? 'checkbox')
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
