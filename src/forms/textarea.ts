import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'

/**
 * Textarea — a form-associated multi-line text control.
 *
 * @fires change - When the value is committed.
 */
@customElement('film-textarea')
export class Textarea extends FilmFormControl {
  @property({ type: String }) value = ''
  @property({ type: String }) placeholder = ''
  @property({ type: String }) label = ''
  @property({ type: Number }) rows = 3
  @property({ type: Boolean }) readonly = false

  /** Grow to fit content instead of scrolling. */
  @property({ type: Boolean, attribute: 'auto-grow' }) autoGrow = false

  @query('textarea') private textarea!: HTMLTextAreaElement

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

    textarea {
      inline-size: 100%;
      font: inherit;
      color: var(--film-color-text);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius);
      padding: 0.4em 0.6em;
      resize: vertical;
    }

    :host([auto-grow]) textarea {
      resize: none;
      overflow: hidden;
    }

    textarea:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: 1px;
    }

    :host([disabled]) textarea {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }
  `

  protected getFormValue (): string {
    return this.value
  }

  protected override get validationAnchor (): HTMLElement | undefined {
    return this.textarea
  }

  formResetCallback (): void {
    this.value = this.getAttribute('value') ?? ''
    this.syncForm()
  }

  firstUpdated (): void {
    this.syncForm()
    this.grow()
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('value')) {
      this.syncForm()
      this.grow()
    }
  }

  private onInput (event: Event): void {
    this.value = (event.target as HTMLTextAreaElement).value
    this.grow()
  }

  // The inner textarea's native `change` isn't composed; re-emit a composed one.
  private onChange (): void {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  private grow (): void {
    if (!this.autoGrow || !this.textarea) return
    this.textarea.style.height = 'auto'
    this.textarea.style.height = `${this.textarea.scrollHeight}px`
  }

  render () {
    return html`
      <div class="field">
        ${this.label ? html`<label for="control">${this.label}</label>` : nothing}
        <textarea
          id="control"
          .value=${this.value}
          rows=${this.rows}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          aria-label=${this.label || nothing}
          @input=${this.onInput}
          @change=${this.onChange}
        ></textarea>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-textarea': Textarea
  }
}
