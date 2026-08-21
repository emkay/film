import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

interface FormControl extends HTMLElement {
  name: string
  value?: unknown
  checked?: boolean
  checkValidity?: () => boolean
  reportValidity?: () => boolean
  formResetCallback?: () => void
}

const CONTROL_SELECTOR =
  'film-input, film-textarea, film-select, film-checkbox, film-switch, film-radio-group, film-range, film-color-picker'

/**
 * Form — aggregates Film's form-associated controls. Slotted custom elements
 * can't associate with a shadow `<form>`, so this manages them directly: it
 * collects values by `name`, validates, and exposes `submit`/`reset`.
 *
 * Trigger submit/reset by calling the methods, or by clicking a slotted element
 * carrying `type="submit"` / `data-film-submit` (or `type="reset"` /
 * `data-film-reset`); Enter inside a `film-input` also submits.
 *
 * @slot - The form content.
 * @fires film-submit - On a valid submit. `detail.values` is the collected data.
 * @fires film-invalid - When submit is blocked by validation.
 * @fires film-reset - After a reset.
 */
@customElement('film-form')
export class Form extends FilmElement {
  /** Skip validation before submitting. */
  @property({ type: Boolean }) novalidate = false

  get controls (): FormControl[] {
    return Array.from(this.querySelectorAll(CONTROL_SELECTOR)) as FormControl[]
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', this.onKeydown)
  }

  /** The current values, keyed by each control's `name`. */
  getValues (): Record<string, unknown> {
    const values: Record<string, unknown> = {}
    for (const control of this.controls) {
      if (!control.name) continue
      if (typeof control.checked === 'boolean') {
        if (control.checked) values[control.name] = control.value ?? true
      } else {
        values[control.name] = control.value
      }
    }
    return values
  }

  checkValidity (): boolean {
    return this.controls.every((control) => control.checkValidity?.() ?? true)
  }

  reportValidity (): boolean {
    let valid = true
    for (const control of this.controls) {
      if (control.reportValidity && !control.reportValidity()) valid = false
    }
    return valid
  }

  submit (): void {
    if (!this.novalidate && !this.reportValidity()) {
      this.dispatchEvent(new Event('film-invalid', { bubbles: true }))
      return
    }
    this.dispatchEvent(
      new CustomEvent('film-submit', { detail: { values: this.getValues() }, bubbles: true })
    )
  }

  reset (): void {
    for (const control of this.controls) control.formResetCallback?.()
    this.dispatchEvent(new Event('film-reset', { bubbles: true }))
  }

  private readonly onClick = (event: MouseEvent): void => {
    const target = event.target as Element
    if (target.closest('[type="submit"], [data-film-submit]')) {
      event.preventDefault()
      this.submit()
    } else if (target.closest('[type="reset"], [data-film-reset]')) {
      event.preventDefault()
      this.reset()
    }
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && (event.target as Element).closest('film-input')) this.submit()
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-form': Form
  }
}
