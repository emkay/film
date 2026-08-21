import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

interface FieldControl extends HTMLElement {
  validationMessage?: string
  required?: boolean
}

/**
 * Field — wraps a single form control with a label, optional hint, a required
 * marker, and an error message that appears when the control reports invalid
 * (via the native `invalid` event). Set `error` to show a message manually.
 *
 * Note: because the control is slotted (light DOM) while the label lives in the
 * shadow root, cross-root `aria-describedby` isn't possible yet, so the error
 * region is marked `role="alert"` (announced when it appears) and the label is
 * applied as the control's `aria-label`. For controls that render their own
 * inner input (input, textarea, select), their own `label` still gives the most
 * precise accessible name.
 *
 * @slot - The single form control.
 */
@customElement('film-field')
export class Field extends FilmElement {
  /** The field label. */
  @property({ type: String }) label = ''

  /** Helper text shown below the control (hidden while an error is showing). */
  @property({ type: String }) hint = ''

  /** A manually-set error message (overrides the control's own). */
  @property({ type: String }) error = ''

  @state() private autoError = ''
  @state() private controlRequired = false

  private control: FieldControl | null = null

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
      font-weight: 600;
    }

    .required {
      color: var(--film-color-danger);
      margin-inline-start: 0.15em;
    }

    .hint {
      font-size: var(--s-1);
      color: var(--film-color-text-muted);
    }

    .error {
      font-size: var(--s-1);
      color: var(--film-color-danger);
    }
  `

  private get shownError (): string {
    return this.error || this.autoError
  }

  private readonly onInvalid = (event: Event): void => {
    event.preventDefault() // suppress the native bubble; we render our own
    this.autoError = this.control?.validationMessage ?? ''
  }

  private readonly onControlInput = (): void => {
    if (this.autoError) this.autoError = ''
  }

  private onSlotChange (event: Event): void {
    const next = ((event.target as HTMLSlotElement).assignedElements()[0] as FieldControl | undefined) ?? null
    if (next === this.control) return
    if (this.control) {
      this.control.removeEventListener('invalid', this.onInvalid)
      this.control.removeEventListener('input', this.onControlInput)
    }
    this.control = next
    if (this.control) {
      this.control.addEventListener('invalid', this.onInvalid)
      this.control.addEventListener('input', this.onControlInput)
      this.controlRequired = Boolean(this.control.required)
      this.nameControl()
    }
  }

  private nameControl (): void {
    if (this.control && this.label) this.control.setAttribute('aria-label', this.label)
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('label')) this.nameControl()
  }

  render () {
    return html`
      <div class="field">
        ${this.label
          ? html`<label>${this.label}${this.controlRequired ? html`<span class="required" aria-hidden="true">*</span>` : nothing}</label>`
          : nothing}
        <slot @slotchange=${this.onSlotChange}></slot>
        ${this.shownError
          ? html`<div class="error" role="alert">${this.shownError}</div>`
          : this.hint
            ? html`<div class="hint">${this.hint}</div>`
            : nothing}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-field': Field
  }
}
