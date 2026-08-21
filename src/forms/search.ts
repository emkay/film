import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'

/**
 * Search — a form-associated search field with a clear button.
 *
 * @fires change - When the value is committed.
 * @fires film-search - On Enter or clear. `detail.value` is the query.
 */
@customElement('film-search')
export class Search extends FilmFormControl {
  @property({ type: String }) value = ''
  @property({ type: String }) placeholder = 'Search…'
  @property({ type: String }) label = ''

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
      align-items: center;
      gap: var(--s-2);
      color: var(--film-color-text);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius);
      padding: 0.3em 0.5em;
    }

    .control:focus-within {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: 1px;
    }

    .icon {
      inline-size: 1em;
      block-size: 1em;
      flex: 0 0 auto;
      opacity: 0.7;
    }

    input {
      flex: 1;
      min-inline-size: 0;
      font: inherit;
      color: inherit;
      background: none;
      border: none;
      outline: none;
    }

    .clear {
      border: none;
      background: none;
      color: inherit;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      opacity: 0.7;
    }

    .clear:hover {
      opacity: 1;
    }

    :host([disabled]) .control {
      opacity: var(--film-disabled-opacity);
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

  private onChange (): void {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  private emitSearch (): void {
    this.dispatchEvent(
      new CustomEvent('film-search', { detail: { value: this.value }, bubbles: true, composed: true })
    )
  }

  private onKeydown (event: KeyboardEvent): void {
    if (event.key === 'Enter') this.emitSearch()
  }

  private clear (): void {
    this.value = ''
    this.input?.focus()
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.emitSearch()
  }

  render () {
    return html`
      <div class="field">
        ${this.label ? html`<label for="control">${this.label}</label>` : nothing}
        <div class="control">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="M21 21l-4.3-4.3" stroke-linecap="round"></path>
          </svg>
          <input
            id="control"
            type="text"
            role="searchbox"
            .value=${this.value}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            aria-label=${this.label || 'Search'}
            @input=${this.onInput}
            @change=${this.onChange}
            @keydown=${this.onKeydown}
          />
          ${this.value
            ? html`<button class="clear" type="button" aria-label="Clear" @click=${this.clear}>✕</button>`
            : nothing}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-search': Search
  }
}
