import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'
import { PopoverController } from '../internal/popover-controller.js'
import type { SelectOption } from './select-option.js'
import { activeElementOf } from '../internal/dom.js'

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

  /** The highlighted option, which the field names as its active descendant. */
  private active: SelectOption | null = null

  @query('input') private input!: HTMLInputElement
  @query('.listbox') private listbox!: HTMLElement

  private readonly floating = new PopoverController(this, {
    anchor: () => this.input,
    panel: () => this.listbox,
    options: () => ({ placement: 'bottom', align: 'start' })
  })

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
      border: var(--border-thin) solid var(--film-color-control-border);
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
      box-shadow: var(--film-shadow-2);
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

  protected override restoreDefault (): void {
    super.restoreDefault()
    this.showSelected()
  }

  // However `value` was set — first render, a choice, code or a parent
  // re-render — show its label. In willUpdate, so the new text renders in this
  // pass rather than scheduling another. Typing changes `text`, not `value`, so
  // it's never overwritten.
  willUpdate (changed: PropertyValues<this>): void {
    super.willUpdate(changed)
    if (changed.has('value')) this.showSelected()
  }

  /** Show the selected option's label in the field, with the list matching it. */
  private showSelected (): void {
    this.text = this.selectedOption?.label ?? ''
    this.filter()
    this.syncOptions()
  }

  updated (changed: PropertyValues<this>): void {
    super.updated(changed)
    if (changed.has('open')) {
      if (this.open) this.openListbox()
      else this.floating.hide()
    }
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
    if (this.active?.hidden) this.setActive(null)
  }

  /**
   * Highlight an option without moving focus: the text field keeps it, so
   * typing keeps filtering, and points assistive tech at the option through
   * aria-activedescendant. The option is light DOM and the field is in this
   * shadow root, which an ID can't cross — element reflection can, since it
   * points out to the host's own tree.
   */
  private setActive (option: SelectOption | null): void {
    if (this.active) this.active.highlighted = false
    this.active = option
    if (option) {
      option.highlighted = true
      option.scrollIntoView({ block: 'nearest' })
    }
    ;(this.input as HTMLInputElement & { ariaActiveDescendantElement: Element | null })
      .ariaActiveDescendantElement = option
  }

  private openListbox (): void {
    this.listbox.style.minInlineSize = `${this.input.offsetWidth}px`
    this.floating.show()
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
    this.setActive(null)
    this.value = option.value
    this.text = option.label
    this.filter()
    this.syncOptions()
    this.syncForm()
    this.dispatchEvent(new Event('change', { bubbles: true }))
    this.returnFocusAndClose()
  }

  // Focus first: the input's focus handler opens the listbox, so closing before
  // focusing would have it reopen straight after a choice or Escape.
  private returnFocusAndClose (): void {
    this.input.focus()
    this.open = false
    this.setActive(null)
  }

  private readonly onListboxClick = (event: MouseEvent): void => {
    const option = (event.target as Element).closest('film-select-option') as SelectOption | null
    if (option) this.select(option)
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    const options = this.visibleOptions
    // Focus normally stays in the field; an option can still hold it if
    // something focused one directly.
    const focused = activeElementOf(this) as SelectOption
    const current = options.indexOf(options.includes(focused) ? focused : (this.active as SelectOption))
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.open = true
        this.setActive(options[current + 1] ?? options[0] ?? null)
        break
      case 'ArrowUp':
        event.preventDefault()
        this.open = true
        this.setActive(options[current - 1] ?? options[options.length - 1] ?? null)
        break
      case 'Enter': {
        const choice = options[current]
        if (choice) {
          event.preventDefault()
          this.select(choice)
        }
        break
      }
      case 'Escape':
        this.returnFocusAndClose()
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
          aria-label=${this.label ? nothing : this.accessibleName(this.placeholder)}
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
          @mousedown=${(e: MouseEvent) => e.preventDefault() /* clicks don't take focus from the field */}
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
