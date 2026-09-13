import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'search'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'

/**
 * Copy a ValidityState's set flags into the plain object `setValidity` takes.
 * `valid` is derived, so it isn't a flag and must not be forwarded.
 */
function validityFlags (validity: ValidityState): ValidityStateFlags {
  const flags: ValidityStateFlags = {}
  for (const key of Object.keys(ValidityState.prototype) as (keyof ValidityState)[]) {
    if (key !== 'valid' && validity[key]) flags[key as keyof ValidityStateFlags] = true
  }
  return flags
}

/**
 * Input — a themed, form-associated text input.
 *
 * `type="date"` (and the rest of the date/time family) gives a typeable field
 * with the platform's own picker and keyboard entry, which is the quickest way
 * to reach a date far from today. `min` / `max` / `step` bound it, and are
 * enforced through the browser's own constraint validation rather than just
 * being decorative.
 *
 * Pressing Enter submits the associated native `<form>`, as it would in a plain
 * `<input>`; inside a `<film-form>` that component handles it instead.
 *
 * @fires input - When the value changes.
 * @fires change - When the value is committed.
 */
@customElement('film-input')
export class Input extends FilmFormControl {
  @property({ type: String }) type: InputType = 'text'
  @property({ type: String }) value = ''
  @property({ type: String }) placeholder = ''
  @property({ type: String }) label = ''
  @property({ type: Boolean }) readonly = false

  /**
   * The autofill hint passed to the inner input, e.g. `username`,
   * `current-password`, `email`. Without it password managers have only the
   * input `type` to go on.
   */
  @property({ type: String }) autocomplete = ''

  /**
   * Lower bound for the value. A `YYYY-MM-DD` date for `type="date"`, a number
   * for `type="number"`, and so on — whatever the input type expects.
   */
  @property({ type: String }) min = ''

  /** Upper bound for the value, in the same form as {@link min}. */
  @property({ type: String }) max = ''

  /** Granularity of the value, e.g. `1` for whole numbers or `7` for weeks. */
  @property({ type: String }) step = ''

  @query('input') private input!: HTMLInputElement

  static styles = css`
    :host {
      display: block;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: var(--s-2);
    }

    label {
      font-size: var(--s-1);
    }

    input {
      inline-size: 100%;
      font: inherit;
      color: var(--film-color-text);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius);
      padding: 0.4em 0.6em;
    }

    input:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: 1px;
    }

    :host([disabled]) input {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }
  `

  protected getFormValue (): string {
    return this.value
  }

  protected override get validationAnchor (): HTMLElement | undefined {
    return this.input
  }

  /**
   * Delegate to the inner input, which already enforces `type`, `required`,
   * `min`, `max` and `step`. Without this the host reports only `required`, so
   * a date outside `min`/`max` would submit as valid.
   */
  protected override updateValidity (): void {
    const input = this.input
    if (!input) {
      super.updateValidity()
      return
    }
    if (input.validity.valid) {
      this.internals.setValidity({})
      return
    }
    this.internals.setValidity(validityFlags(input.validity), input.validationMessage, input)
  }

  formResetCallback (): void {
    this.value = this.getAttribute('value') ?? ''
    this.syncForm()
  }

  firstUpdated (): void {
    this.syncForm()
  }

  // Constraints are forwarded as attributes during render, so re-running
  // validation here picks up the inner input's freshly applied bounds.
  updated (changed: PropertyValues<this>): void {
    const constraints = ['value', 'min', 'max', 'step', 'type', 'required'] as const
    if (constraints.some((name) => changed.has(name))) this.syncForm()
  }

  private onInput (event: Event): void {
    this.value = (event.target as HTMLInputElement).value
  }

  // Implicit submission: the inner input is alone in its shadow root, so the
  // browser has no form to submit on Enter. Do it through the association the
  // element itself has.
  private onKeydown (event: KeyboardEvent): void {
    if (event.key !== 'Enter') return
    if (this.closest('film-form')) return
    const form = this.form
    if (form) form.requestSubmit()
  }

  // The inner input's native `change` is not composed and stays in the shadow
  // root; re-emit a composed one so external listeners hear it.
  private onChange (): void {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  render () {
    return html`
      <div class="field">
        ${this.label ? html`<label for="control">${this.label}</label>` : nothing}
        <input
          id="control"
          .type=${this.type}
          .value=${this.value}
          placeholder=${this.placeholder}
          autocomplete=${this.autocomplete || nothing}
          min=${this.min || nothing}
          max=${this.max || nothing}
          step=${this.step || nothing}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          aria-label=${this.label || nothing}
          @input=${this.onInput}
          @change=${this.onChange}
          @keydown=${this.onKeydown}
        />
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-input': Input
  }
}
