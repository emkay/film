import { css, html, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'
import '../feedback/tag.js'

/**
 * FileInput — a form-associated file picker with drag-and-drop.
 *
 * @fires change - When the selected files change.
 */
@customElement('film-file-input')
export class FileInput extends FilmFormControl {
  /** Accepted file types (the native `accept` list). */
  @property({ type: String }) accept = ''

  /** Allow selecting more than one file. */
  @property({ type: Boolean }) multiple = false

  /** A label for the control. */
  @property({ type: String }) label = ''

  @state() private files: File[] = []
  @state() private dragging = false

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

    .dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--s-1);
      padding: var(--s1);
      text-align: center;
      color: var(--film-color-text-muted);
      background-color: var(--film-color-surface);
      border: var(--border-thick) dashed var(--film-color-border);
      border-radius: var(--film-radius);
      cursor: pointer;
    }

    .dropzone:focus-visible,
    .dropzone.dragging {
      outline: var(--border-thin) solid var(--film-color-focus);
      color: var(--film-color-text);
    }

    .files {
      display: flex;
      flex-wrap: wrap;
      gap: var(--s-2);
    }

    :host([disabled]) .dropzone {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }
  `

  protected getFormValue (): string | File | FormData | null {
    if (this.files.length === 0) return null
    if (!this.multiple) return this.files[0]
    const data = new FormData()
    for (const file of this.files) data.append(this.name, file)
    return data
  }

  formResetCallback (): void {
    this.files = []
    if (this.input) this.input.value = ''
    this.syncForm()
  }

  firstUpdated (): void {
    this.syncForm()
  }

  private setFiles (list: FileList | null): void {
    this.files = list ? Array.from(list) : []
    this.syncForm()
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  private browse (): void {
    if (!this.disabled) this.input?.click()
  }

  private onKeydown (event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.browse()
    }
  }

  private onDragOver (event: DragEvent): void {
    event.preventDefault()
    if (!this.disabled) this.dragging = true
  }

  private onDrop (event: DragEvent): void {
    event.preventDefault()
    this.dragging = false
    if (!this.disabled) this.setFiles(event.dataTransfer?.files ?? null)
  }

  render () {
    return html`
      <div class="field">
        ${this.label ? html`<label>${this.label}</label>` : nothing}
        <div
          class="dropzone ${this.dragging ? 'dragging' : ''}"
          role="button"
          tabindex="0"
          aria-label=${this.label || 'Choose files'}
          @click=${this.browse}
          @keydown=${this.onKeydown}
          @dragover=${this.onDragOver}
          @dragleave=${() => (this.dragging = false)}
          @drop=${this.onDrop}
        >
          <input
            type="file"
            hidden
            accept=${this.accept || nothing}
            ?multiple=${this.multiple}
            @change=${(e: Event) => this.setFiles((e.target as HTMLInputElement).files)}
          />
          ${this.files.length
            ? html`<div class="files">${this.files.map((file) => html`<film-tag>${file.name}</film-tag>`)}</div>`
            : html`<span>Drop files here or click to browse</span>`}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-file-input': FileInput
  }
}
