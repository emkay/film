import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'
import { anchorPosition } from '../internal/anchor-position.js'
import './calendar.js'

/**
 * DatePicker — a form-associated date field. Shows the selected date on a
 * trigger and opens a {@link Calendar} in a top-layer popover to choose one.
 *
 * @fires change - When the date changes.
 */
@customElement('film-date-picker')
export class DatePicker extends FilmFormControl {
  /** The selected date, as `YYYY-MM-DD`. */
  @property({ type: String }) value = ''

  @property({ type: String }) label = ''
  @property({ type: String }) placeholder = 'Select a date'
  @property({ type: String }) min = ''
  @property({ type: String }) max = ''

  /** Whether the calendar is open. */
  @property({ type: Boolean, reflect: true }) open = false

  @query('.trigger') private trigger!: HTMLButtonElement
  @query('.panel') private panel!: HTMLElement

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

    .icon {
      inline-size: 1em;
      block-size: 1em;
      opacity: 0.7;
    }

    :host([disabled]) .trigger {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }

    .panel {
      margin: 0;
      inset: unset;
      border: none;
      padding: 0;
      background: none;
      overflow: visible;
    }

    .panel:popover-open {
      display: block;
    }
  `

  protected getFormValue (): string | null {
    return this.value || null
  }

  protected override get validationAnchor (): HTMLElement | undefined {
    return this.trigger
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
    if (changed.has('open')) {
      this.trigger?.setAttribute('aria-expanded', String(this.open))
      if (this.open) this.openPanel()
      else this.closePanel()
    }
  }

  disconnectedCallback (): void {
    this.cleanup?.()
    super.disconnectedCallback()
  }

  private get display (): string {
    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(this.value)
    if (!parts) return this.placeholder
    const date = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]))
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
  }

  private openPanel (): void {
    this.panel.showPopover()
    this.cleanup = anchorPosition(this.trigger, this.panel, { placement: 'bottom', align: 'start' })
  }

  private closePanel (): void {
    this.cleanup?.()
    this.cleanup = undefined
    if (this.panel?.matches(':popover-open')) this.panel.hidePopover()
  }

  private readonly onToggle = (event: Event): void => {
    this.open = (event as ToggleEvent).newState === 'open'
  }

  private readonly onCalendarChange = (event: Event): void => {
    this.value = (event as CustomEvent<{ value: string }>).detail.value
    this.syncForm()
    this.dispatchEvent(new Event('change', { bubbles: true }))
    this.open = false
    this.trigger.focus()
  }

  render () {
    const hasValue = Boolean(/^\d{4}-\d{2}-\d{2}$/.exec(this.value))
    return html`
      <div class="field">
        ${this.label ? html`<label id="label">${this.label}</label>` : nothing}
        <button
          class="trigger"
          type="button"
          aria-haspopup="dialog"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-labelledby=${this.label ? 'label' : nothing}
          aria-label=${this.label ? nothing : 'Select a date'}
          ?disabled=${this.disabled}
          @click=${() => (this.open = !this.open)}
        >
          <span class=${hasValue ? nothing : 'placeholder'}>${this.display}</span>
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2"></rect>
            <path d="M3 10h18M8 2v4M16 2v4"></path>
          </svg>
        </button>
        <div class="panel" popover="auto" @toggle=${this.onToggle}>
          <film-calendar
            value=${this.value}
            min=${this.min}
            max=${this.max}
            @film-change=${this.onCalendarChange}
          ></film-calendar>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-date-picker': DatePicker
  }
}
