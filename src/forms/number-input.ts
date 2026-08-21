import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'

/**
 * NumberInput — a form-associated number field with stepper buttons.
 *
 * @fires change - When the value changes.
 */
@customElement('film-number-input')
export class NumberInput extends FilmFormControl {
  @property({ type: Number }) value = 0
  @property({ type: Number }) min = -Infinity
  @property({ type: Number }) max = Infinity
  @property({ type: Number }) step = 1
  @property({ type: String }) label = ''
  @property({ type: String }) placeholder = ''

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

    .control {
      display: flex;
      align-items: stretch;
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius);
      background-color: var(--film-color-surface);
      overflow: hidden;
    }

    .control:focus-within {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: 1px;
    }

    button {
      font: inherit;
      inline-size: 2em;
      border: none;
      background: none;
      color: var(--film-color-text);
      cursor: pointer;
    }

    button:hover:not([disabled]) {
      background-color: var(--film-color-info);
    }

    button[disabled] {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }

    input {
      flex: 1;
      min-inline-size: 0;
      inline-size: 100%;
      font: inherit;
      text-align: center;
      color: var(--film-color-text);
      background: none;
      border: none;
      outline: none;
      -moz-appearance: textfield;
    }

    input::-webkit-inner-spin-button,
    input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    :host([disabled]) .control {
      opacity: var(--film-disabled-opacity);
    }
  `

  protected getFormValue (): string {
    return String(this.value)
  }

  protected override get validationAnchor (): HTMLElement | undefined {
    return this.input
  }

  formResetCallback (): void {
    this.value = Number(this.getAttribute('value') ?? 0)
    this.syncForm()
  }

  firstUpdated (): void {
    this.syncForm()
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('value')) this.syncForm()
  }

  private clamp (n: number): number {
    return Math.min(this.max, Math.max(this.min, n))
  }

  private stepBy (direction: number): void {
    if (this.disabled) return
    this.value = this.clamp(this.value + direction * this.step)
    this.input?.focus()
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  private onInput (event: Event): void {
    const n = Number((event.target as HTMLInputElement).value)
    if (!Number.isNaN(n)) this.value = n
  }

  private onChange (): void {
    this.value = this.clamp(this.value)
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  render () {
    return html`
      <div class="field">
        ${this.label ? html`<label for="control">${this.label}</label>` : nothing}
        <div class="control">
          <button
            type="button"
            aria-label="Decrease"
            ?disabled=${this.disabled || this.value <= this.min}
            @click=${() => this.stepBy(-1)}
          >−</button>
          <input
            id="control"
            type="number"
            .value=${String(this.value)}
            min=${Number.isFinite(this.min) ? this.min : nothing}
            max=${Number.isFinite(this.max) ? this.max : nothing}
            step=${this.step}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-label=${this.label || nothing}
            @input=${this.onInput}
            @change=${this.onChange}
          />
          <button
            type="button"
            aria-label="Increase"
            ?disabled=${this.disabled || this.value >= this.max}
            @click=${() => this.stepBy(1)}
          >+</button>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-number-input': NumberInput
  }
}
