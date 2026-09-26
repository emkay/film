import type { PropertyValues } from 'lit'
import { property } from 'lit/decorators.js'
import { FilmElement } from './film-element.js'

/**
 * Base class for form-associated custom elements. Wires up `ElementInternals`
 * so subclasses participate in a native `<form>`: they submit a value by name,
 * take part in constraint validation, and respond to form reset / disable.
 *
 * It also owns the lifecycle every control shares: the value and validity are
 * sent to the form on first render and whenever one of {@link formProps}
 * changes, and a form reset restores the control's default. Subclasses
 * implement {@link getFormValue}; they call {@link syncForm} themselves only for
 * state that isn't a reactive property.
 */
export abstract class FilmFormControl extends FilmElement {
  static formAssociated = true

  /** Properties that feed the submitted value or its validity. */
  static formProps: readonly string[] = ['value']

  static shadowRootOptions: ShadowRootInit = {
    ...FilmElement.shadowRootOptions,
    delegatesFocus: true
  }

  protected readonly internals = this.attachInternals()

  /** The control's form-submission name. */
  @property({ type: String }) name = ''

  /** Whether the control is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /**
   * The host's own `aria-label` — set by a consumer, or by `film-field`. On the
   * host it names nothing useful: assistive tech lands on the inner input, a
   * shadow-root element the host's label doesn't reach. Controls forward it
   * there through {@link accessibleName}.
   */
  @property({ attribute: 'aria-label' }) protected hostLabel: string | null = null

  /** Whether a value is required for the form to be valid. */
  @property({ type: Boolean, reflect: true }) required = false

  /** `value` as the control first connected — the reset fallback. */
  private initialValue: unknown
  private initialCaptured = false

  /**
   * The name for the element that takes focus: the control's visible `label`,
   * else the host's `aria-label`, else `fallback`.
   */
  protected accessibleName (fallback = ''): string {
    const visible = (this as unknown as { label?: string }).label
    return visible || this.hostLabel || fallback
  }

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

  connectedCallback (): void {
    super.connectedCallback()
    if (!this.initialCaptured) {
      this.initialValue = (this as unknown as Record<string, unknown>).value
      this.initialCaptured = true
    }
  }

  firstUpdated (_changed: PropertyValues): void {
    this.syncForm()
  }

  updated (changed: PropertyValues): void {
    super.updated(changed)
    const props = (this.constructor as typeof FilmFormControl).formProps
    if (props.some((name) => changed.has(name))) this.syncForm()
  }

  formDisabledCallback (disabled: boolean): void {
    this.disabled = disabled
  }

  formResetCallback (): void {
    this.restoreDefault()
    this.syncForm()
  }

  /**
   * Put the control back to its default for a form reset: the `value`
   * attribute if there is one — as on a native input — otherwise the value it
   * started with. Override for state beyond `value`.
   */
  protected restoreDefault (): void {
    const self = this as unknown as Record<string, unknown>
    const attribute = this.getAttribute('value')
    if (attribute === null) {
      self.value = this.initialValue
      return
    }
    const ctor = this.constructor as typeof FilmFormControl
    self.value = ctor.elementProperties.get('value')?.type === Number ? Number(attribute) : attribute
  }
}
