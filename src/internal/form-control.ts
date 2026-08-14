import { property } from 'lit/decorators.js'
import { FilmElement } from './film-element.js'

/**
 * Base class for form-associated custom elements. Wires up `ElementInternals`
 * so subclasses participate in a native `<form>`: they submit a value by name,
 * take part in constraint validation, and respond to form reset / disable.
 *
 * Subclasses implement {@link getFormValue} and {@link formResetCallback}, and
 * call {@link syncForm} whenever their value changes.
 */
export abstract class FilmFormControl extends FilmElement {
  static formAssociated = true

  static shadowRootOptions: ShadowRootInit = {
    ...FilmElement.shadowRootOptions,
    delegatesFocus: true
  }

  protected readonly internals = this.attachInternals()

  /** The control's form-submission name. */
  @property({ type: String }) name = ''

  /** Whether the control is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** Whether a value is required for the form to be valid. */
  @property({ type: Boolean, reflect: true }) required = false

  /** The associated form, if any. */
  get form (): HTMLFormElement | null {
    return this.internals.form
  }

  get validity (): ValidityState {
    return this.internals.validity
  }

  get validationMessage (): string {
    return this.internals.validationMessage
  }

  checkValidity (): boolean {
    return this.internals.checkValidity()
  }

  reportValidity (): boolean {
    return this.internals.reportValidity()
  }

  /** The current value(s) to submit with the form. */
  protected abstract getFormValue (): string | File | FormData | null

  /** The shadow element validation should be anchored to, if any. */
  protected get validationAnchor (): HTMLElement | undefined {
    return undefined
  }

  /** Recompute validity. Override for control-specific rules; the default only checks `required`. */
  protected updateValidity (): void {
    const value = this.getFormValue()
    const empty = value === null || value === ''
    if (this.required && empty) {
      this.internals.setValidity(
        { valueMissing: true },
        'Please fill out this field.',
        this.validationAnchor
      )
    } else {
      this.internals.setValidity({})
    }
  }

  /** Push the current value and validity to the associated form. */
  protected syncForm (): void {
    this.internals.setFormValue(this.getFormValue())
    this.updateValidity()
  }

  formDisabledCallback (disabled: boolean): void {
    this.disabled = disabled
  }

  abstract formResetCallback (): void
}
