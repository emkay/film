import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'

/**
 * ColorPicker — a form-associated colour input pairing the native colour picker
 * with an editable hex field.
 *
 * @fires change - When the colour changes.
 */
@customElement('film-color-picker')
export class ColorPicker extends FilmFormControl {
  @property({ type: String }) value = '#000000'
  @property({ type: String }) label = ''

  @query('input[type="color"]') private colorInput!: HTMLInputElement

  static styles = css`
    :host {
      display: inline-flex;
      flex-direction: column;
      gap: var(--s-2);
    }

    label {
      font-size: var(--s-1);
    }

    .controls {
      display: inline-flex;
      align-items: center;
      gap: var(--s-1);
      border: var(--border-thin) solid var(--color-dark);
      border-radius: var(--s-2);
      padding: 0.2em;
      background-color: var(--color-light);
    }

    input[type='color'] {
      inline-size: 2em;
      block-size: 2em;
      padding: 0;
      border: none;
      border-radius: var(--s-3);
      background: none;
      cursor: pointer;
    }

    input[type='text'] {
      inline-size: 7ch;
      font: inherit;
      font-variant-numeric: tabular-nums;
      text-transform: uppercase;
      border: none;
      background: none;
      color: var(--color-dark);
    }

    input:focus-visible {
      outline: var(--border-thin) solid var(--color-links);
    }

    :host([disabled]) {
      opacity: 0.6;
    }
  `

  protected getFormValue (): string {
    return this.value
  }

  protected override get validationAnchor (): HTMLElement | undefined {
    return this.colorInput
  }

  formResetCallback (): void {
    this.value = this.getAttribute('value') ?? '#000000'
    this.syncForm()
  }

  firstUpdated (): void {
    this.syncForm()
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('value')) this.syncForm()
  }

  private onColorInput (event: Event): void {
    this.commit((event.target as HTMLInputElement).value)
  }

  private onHexInput (event: Event): void {
    const next = (event.target as HTMLInputElement).value
    if (/^#[0-9a-fA-F]{6}$/.test(next)) this.commit(next)
  }

  private commit (value: string): void {
    this.value = value
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }

  render () {
    return html`
      ${this.label ? html`<label for="hex">${this.label}</label>` : nothing}
      <div class="controls">
        <input
          type="color"
          .value=${this.value}
          ?disabled=${this.disabled}
          aria-label=${this.label || 'Colour'}
          @input=${this.onColorInput}
        />
        <input
          id="hex"
          type="text"
          .value=${this.value}
          ?disabled=${this.disabled}
          spellcheck="false"
          aria-label="Hex value"
          @change=${this.onHexInput}
        />
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-color-picker': ColorPicker
  }
}
