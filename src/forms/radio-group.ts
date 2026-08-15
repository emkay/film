import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmFormControl } from '../internal/form-control.js'
import type { Radio } from './radio.js'

/**
 * RadioGroup — a form-associated group of {@link Radio} options. Manages
 * selection, roving tab focus and arrow-key navigation.
 *
 * @slot - The `film-radio` options.
 * @fires change - When the selected value changes.
 */
@customElement('film-radio-group')
export class RadioGroup extends FilmFormControl {
  /** The value of the selected option. */
  @property({ type: String }) value = ''

  /** An accessible label for the group. */
  @property({ type: String }) label = ''

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--s-1);
    }
  `

  private get radios (): Radio[] {
    return Array.from(this.querySelectorAll('film-radio'))
  }

  private get enabledRadios (): Radio[] {
    return this.radios.filter((radio) => !radio.disabled)
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'radiogroup')
    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', this.onKeydown)
  }

  protected getFormValue (): string | null {
    return this.value || null
  }

  formResetCallback (): void {
    this.value = this.getAttribute('value') ?? ''
    this.syncSelection()
    this.syncForm()
  }

  firstUpdated (): void {
    if (this.label) this.setAttribute('aria-label', this.label)
    this.syncSelection()
    this.syncForm()
  }

  updated (changed: PropertyValues<this>): void {
    // Keep selection + form value in sync with programmatic `value` changes.
    if (changed.has('value')) {
      this.syncSelection()
      this.syncForm()
    }
  }

  private readonly onClick = (event: MouseEvent): void => {
    if (this.disabled) return
    const radio = (event.target as Element).closest('film-radio') as Radio | null
    if (radio && !radio.disabled) this.select(radio, false)
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft']
    if (!keys.includes(event.key) || this.disabled) return
    event.preventDefault()

    const options = this.enabledRadios
    if (options.length === 0) return
    const current = options.findIndex((radio) => radio.checked)
    const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight'
    const next = current === -1
      ? (forward ? 0 : options.length - 1)
      : (current + (forward ? 1 : -1) + options.length) % options.length
    const target = options[next]
    if (target) this.select(target, true)
  }

  private select (radio: Radio, focus: boolean): void {
    this.value = radio.value
    this.syncSelection()
    this.syncForm()
    if (focus) radio.focus()
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }

  private syncSelection (): void {
    const radios = this.radios
    const hasSelection = radios.some((radio) => radio.value === this.value)
    radios.forEach((radio, index) => {
      radio.checked = radio.value === this.value
      const focusable = radio.checked || (!hasSelection && index === 0)
      radio.tabIndex = radio.disabled ? -1 : focusable ? 0 : -1
    })
  }

  render () {
    return html`<slot @slotchange=${() => this.syncSelection()}></slot>${nothing}`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-radio-group': RadioGroup
  }
}
