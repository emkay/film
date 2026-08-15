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

/**
 * Input — a themed, form-associated text input.
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

  formResetCallback (): void {
    this.value = this.getAttribute('value') ?? ''
    this.syncForm()
  }

  firstUpdated (): void {
    this.syncForm()
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('value')) this.syncForm()
  }

  private onInput (event: Event): void {
    this.value = (event.target as HTMLInputElement).value
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
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          aria-label=${this.label || nothing}
          @input=${this.onInput}
          @change=${this.onChange}
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
