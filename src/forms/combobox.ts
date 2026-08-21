import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'
import { anchorPosition } from '../internal/anchor-position.js'
import type { SelectOption } from './select-option.js'

/**
 * Combobox — a form-associated select with type-to-filter autocomplete. Options
 * are {@link SelectOption} children (shared with `film-select`); typing filters
 * them and choosing one sets the value.
 *
 * @slot - The `film-select-option` children.
 * @fires change - When the selected value changes.
 */
@customElement('film-combobox')
export class Combobox extends FilmFormControl {
  /** The value of the selected option. */
  @property({ type: String }) value = ''

  /** An accessible label. */
  @property({ type: String }) label = ''

  @property({ type: String }) placeholder = 'Type to search…'

  /** Whether the listbox is open. */
  @property({ type: Boolean, reflect: true }) open = false

  @state() private text = ''

  @query('input') private input!: HTMLInputElement
  @query('.listbox') private listbox!: HTMLElement

  private cleanup?: () => void

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
    }

    .listbox {
      margin: 0;
      padding: var(--s-3);
      inset: unset;
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius);
      overflow: auto;
      max-block-size: 16rem;
    }

    .listbox:popover-open {
      display: block;
    }

    .empty {
      padding: var(--s-2) var(--s0);
      color: var(--film-color-text-muted);
    }
  `

  private get options (): SelectOption[] {
    return Array.from(this.querySelectorAll('film-select-option'))
  }

  private get visibleOptions (): SelectOption[] {
    return this.options.filter((option) => !option.hidden && !option.disabled)
  }

  private get selectedOption (): SelectOption | undefined {
    return this.options.find((option) => option.value === this.value)
  }

  protected getFormValue (): string | null {
    return this.value || null
  }

  protected override get validationAnchor (): HTMLElement | undefined {
    return this.input
  }

  formResetCallback (): void {
    this.value = this.getAttribute('value') ?? ''
    this.text = this.selectedOption?.label ?? ''
    this.filter()
    this.syncOptions()
    this.syncForm()
  }

  firstUpdated (): void {
    this.text = this.selectedOption?.label ?? ''
    this.filter()
    this.syncOptions()
    this.syncForm()
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('value')) this.syncForm()
    if (changed.has('open')) {
      if (this.open) this.openListbox()
      else this.closeListbox()
    }
  }

  disconnectedCallback (): void {
    this.cleanup?.()
    super.disconnectedCallback()
  }

  private syncOptions (): void {
    this.options.forEach((option) => {
      option.selected = option.value === this.value
    })
  }

  private filter (): void {
    const query = this.text.trim().toLowerCase()
    this.options.forEach((option) => {
      option.hidden = query !== '' && !option.label.toLowerCase().includes(query)
    })
  }

  private openListbox (): void {
    this.listbox.showPopover()
    this.listbox.style.minInlineSize = `${this.input.offsetWidth}px`
    this.cleanup = anchorPosition(this.input, this.listbox, { placement: 'bottom', align: 'start' })
  }

  private closeListbox (): void {
    this.cleanup?.()
    this.cleanup = undefined
    if (this.listbox?.matches(':popover-open')) this.listbox.hidePopover()
  }

  private readonly onToggle = (event: Event): void => {
    this.open = (event as ToggleEvent).newState === 'open'
  }

  private onInput (event: Event): void {
    this.text = (event.target as HTMLInputElement).value
    this.filter()
    this.open = true
  }

  private select (option: SelectOption): void {
    if (option.disabled) return
    this.value = option.value
    this.text = option.label
    this.filter()
    this.syncOptions()
    this.syncForm()
    this.dispatchEvent(new Event('change', { bubbles: true }))
    this.open = false
    this.input.focus()
  }

  private readonly onListboxClick = (event: MouseEvent): void => {
    const option = (event.target as Element).closest('film-select-option') as SelectOption | null
    if (option) this.select(option)
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    const options = this.visibleOptions
    const current = options.indexOf(document.activeElement as SelectOption)
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.open = true
        ;(options[current + 1] ?? options[0])?.focus()
        break
      case 'ArrowUp':
        event.preventDefault()
        options[Math.max(current - 1, 0)]?.focus()
        break
      case 'Enter': {
        const focused = document.activeElement as SelectOption
        if (options.includes(focused)) {
          event.preventDefault()
          this.select(focused)
        }
        break
      }
      case 'Escape':
        this.open = false
        this.input.focus()
        break
    }
  }

  render () {
    const hasMatches = this.visibleOptions.length > 0
    return html`
      <div class="field">
        ${this.label ? html`<label id="label">${this.label}</label>` : nothing}
        <input
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls="listbox"
          aria-labelledby=${this.label ? 'label' : nothing}
          aria-label=${this.label ? nothing : this.placeholder}
          .value=${this.text}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          @input=${this.onInput}
          @keydown=${this.onKeydown}
          @focus=${() => {
            if (this.visibleOptions.length) this.open = true
          }}
        />
        <div
          class="listbox"
          id="listbox"
          popover="auto"
          role="listbox"
          @toggle=${this.onToggle}
          @click=${this.onListboxClick}
          @keydown=${this.onKeydown}
        >
          <slot
            @slotchange=${() => {
              this.filter()
              this.syncOptions()
            }}
          ></slot>
          ${hasMatches ? nothing : html`<div class="empty">No matches</div>`}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-combobox': Combobox
  }
}
