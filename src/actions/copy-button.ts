import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * CopyButton — copies `value` to the clipboard and briefly confirms.
 *
 * @slot - The button label (overrides `label`).
 * @fires film-copy - After a successful copy. `detail.value` is the copied text.
 * @fires film-error - When copying fails.
 */
@customElement('film-copy-button')
export class CopyButton extends FilmElement {
  /** The text to copy. */
  @property({ type: String }) value = ''

  /** The idle label. */
  @property({ type: String }) label = 'Copy'

  /** The label shown briefly after copying. */
  @property({ type: String, attribute: 'copied-label' }) copiedLabel = 'Copied'

  @state() private copied = false

  private timer?: ReturnType<typeof setTimeout>

  static styles = css`
    button {
      font: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: var(--s-2);
      padding: 0.4em 0.9em;
      color: var(--font-color-primary);
      background-color: var(--button-primary-color);
      border: none;
      border-radius: var(--s-2);
    }

    button:hover {
      background-color: var(--button-primary-color-hover);
    }

    button:focus-visible {
      outline: var(--border-thin) solid var(--color-links);
      outline-offset: 2px;
    }
  `

  disconnectedCallback (): void {
    if (this.timer) clearTimeout(this.timer)
    super.disconnectedCallback()
  }

  private async onClick (): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.value)
      this.copied = true
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.copied = false
      }, 2000)
      this.dispatchEvent(new CustomEvent('film-copy', { detail: { value: this.value }, bubbles: true }))
    } catch (error) {
      this.dispatchEvent(new CustomEvent('film-error', { detail: { error }, bubbles: true }))
    }
  }

  render () {
    return html`
      <button type="button" @click=${this.onClick} aria-live="polite">
        ${this.copied ? this.copiedLabel : html`<slot>${this.label}</slot>`}
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-copy-button': CopyButton
  }
}
