import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'

/**
 * Range — a form-associated slider.
 *
 * @fires input - While dragging.
 * @fires change - When the value is committed.
 */
@customElement('film-range')
export class Range extends FilmFormControl {
  @property({ type: Number }) min = 0
  @property({ type: Number }) max = 100
  @property({ type: Number }) step = 1
  @property({ type: Number }) value = 50
  @property({ type: String }) label = ''

  /** Show the current value beside the label. */
  @property({ type: Boolean, attribute: 'show-value' }) showValue = false

  @query('input') private input!: HTMLInputElement

  static styles = css`
    :host {
      display: block;
    }

    .row {
      display: flex;
      justify-content: space-between;
      font-size: var(--s-1);
    }

    input {
      inline-size: 100%;
      accent-color: var(--color-dark);
    }

    :host([disabled]) {
      opacity: 0.6;
    }
  `

  protected getFormValue (): string {
    return String(this.value)
  }

  protected override get validationAnchor (): HTMLElement | undefined {
    return this.input
  }

  formResetCallback (): void {
    this.value = Number(this.getAttribute('value') ?? 50)
    this.syncForm()
  }

  firstUpdated (): void {
    this.syncForm()
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('value')) this.syncForm()
  }

  private onInput (event: Event): void {
    this.value = Number((event.target as HTMLInputElement).value)
  }

  render () {
    return html`
      ${this.label || this.showValue
        ? html`<div class="row"><span>${this.label}</span>${this.showValue ? html`<span>${this.value}</span>` : nothing}</div>`
        : nothing}
      <input
        type="range"
        min=${this.min}
        max=${this.max}
        step=${this.step}
        .value=${String(this.value)}
        ?disabled=${this.disabled}
        aria-label=${this.label || nothing}
        @input=${this.onInput}
      />
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-range': Range
  }
}
