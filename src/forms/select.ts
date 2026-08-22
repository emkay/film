import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'
import { anchorPosition } from '../internal/anchor-position.js'
import type { SelectOption } from './select-option.js'

/**
 * Select — a form-associated select: a trigger showing the current choice and a
 * listbox of {@link SelectOption}s promoted to the top layer via the Popover
 * API. Keyboard: arrows move, Enter/Space choose, Escape closes.
 *
 * @slot - The `film-select-option` children.
 * @fires change - When the selected value changes.
 */
@customElement('film-select')
export class Select extends FilmFormControl {
  /** The value of the selected option. */
  @property({ type: String }) value = ''

  /** An accessible label. */
  @property({ type: String }) label = ''

  /** Text shown when nothing is selected. */
  @property({ type: String }) placeholder = 'Select…'

  /** Whether the listbox is open. */
  @property({ type: Boolean, reflect: true }) open = false

  @query('.trigger') private trigger!: HTMLButtonElement
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

    .trigger {
      inline-size: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--s-1);
      font: inherit;
      text-align: start;
      color: var(--film-color-text);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius);
      padding: 0.4em 0.6em;
      cursor: pointer;
    }

    .trigger:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: 1px;
    }

    .placeholder {
      color: var(--film-color-text-muted);
    }

    :host([disabled]) .trigger {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
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
      box-shadow: var(--film-shadow-2);
    }

    .listbox:popover-open {
      display: block;
    }
  `

  private get options (): SelectOption[] {
    return Array.from(this.querySelectorAll('film-select-option'))
  }

  private get enabledOptions (): SelectOption[] {
    return this.options.filter((option) => !option.disabled)
  }

  private get selectedOption (): SelectOption | undefined {
    return this.options.find((option) => option.value === this.value)
  }

  protected getFormValue (): string | null {
    return this.value || null
  }

  protected override get validationAnchor (): HTMLElement | undefined {
    return this.trigger
  }

  formResetCallback (): void {
    this.value = this.getAttribute('value') ?? ''
    this.syncOptions()
    this.syncForm()
  }

  firstUpdated (): void {
    this.syncOptions()
    this.syncForm()
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('value')) {
      this.syncOptions()
      this.syncForm()
    }
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

  private toggle (): void {
    if (!this.disabled) this.open = !this.open
  }

  private openListbox (): void {
    this.listbox.showPopover()
    this.listbox.style.minInlineSize = `${this.trigger.offsetWidth}px`
    this.cleanup = anchorPosition(this.trigger, this.listbox, { placement: 'bottom', align: 'start' })
    ;(this.selectedOption ?? this.enabledOptions[0])?.focus()
  }

  private closeListbox (): void {
    this.cleanup?.()
    this.cleanup = undefined
    if (this.listbox?.matches(':popover-open')) this.listbox.hidePopover()
  }

  private readonly onToggle = (event: Event): void => {
    this.open = (event as ToggleEvent).newState === 'open'
  }

  private select (option: SelectOption): void {
    if (option.disabled) return
    this.value = option.value
    this.syncOptions()
    this.syncForm()
    this.dispatchEvent(new Event('change', { bubbles: true }))
    this.open = false
    this.trigger.focus()
  }

  private readonly onListboxClick = (event: MouseEvent): void => {
    const option = (event.target as Element).closest('film-select-option') as SelectOption | null
    if (option) this.select(option)
  }

  private readonly onTriggerKeydown = (event: KeyboardEvent): void => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      this.open = true
    }
  }

  private readonly onListboxKeydown = (event: KeyboardEvent): void => {
    const options = this.enabledOptions
    if (options.length === 0) return
    const current = options.indexOf(document.activeElement as SelectOption)

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        options[Math.min(current + 1, options.length - 1)]?.focus()
        break
      case 'ArrowUp':
        event.preventDefault()
        options[Math.max(current - 1, 0)]?.focus()
        break
      case 'Home':
        event.preventDefault()
        options[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        options[options.length - 1]?.focus()
        break
      case 'Enter':
      case ' ': {
        event.preventDefault()
        const focused = document.activeElement as SelectOption
        if (options.includes(focused)) this.select(focused)
        break
      }
      case 'Escape':
        event.preventDefault()
        this.open = false
        this.trigger.focus()
        break
      case 'Tab':
        this.open = false
        break
    }
  }

  render () {
    const selected = this.selectedOption
    return html`
      <div class="field">
        ${this.label ? html`<label id="label">${this.label}</label>` : nothing}
        <button
          class="trigger"
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-labelledby=${this.label ? 'label' : nothing}
          aria-label=${this.label ? nothing : this.placeholder}
          ?disabled=${this.disabled}
          @click=${this.toggle}
          @keydown=${this.onTriggerKeydown}
        >
          <span class=${selected ? nothing : 'placeholder'}>${selected?.label ?? this.placeholder}</span>
          <span aria-hidden="true">▾</span>
        </button>
        <div
          class="listbox"
          popover="auto"
          role="listbox"
          @toggle=${this.onToggle}
          @click=${this.onListboxClick}
          @keydown=${this.onListboxKeydown}
        >
          <slot @slotchange=${() => this.syncOptions()}></slot>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-select': Select
  }
}
