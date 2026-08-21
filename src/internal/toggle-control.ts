import type { PropertyValues } from 'lit'
import { property } from 'lit/decorators.js'
import { FilmFormControl } from './form-control.js'

/**
 * Base for form-associated toggle controls (checkbox, switch). The host element
 * *is* the control, so it owns the ARIA role, roving tabindex, keyboard
 * handling, checked state and form participation. Subclasses supply
 * {@link toggleRole}, their styles and their render.
 */
export abstract class FilmToggleControl extends FilmFormControl {
  /** Whether the control is checked / on. */
  @property({ type: Boolean, reflect: true }) checked = false

  /** The value submitted when checked. */
  @property({ type: String }) value = 'on'

  /** The ARIA role for the control, e.g. `checkbox` or `switch`. */
  protected abstract readonly toggleRole: string

  constructor () {
    super()
    this.addEventListener('click', () => this.toggle())
    this.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        this.toggle()
      }
    })
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', this.getAttribute('role') ?? this.toggleRole)
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0
  }

  protected getFormValue (): string | null {
    return this.checked ? this.value : null
  }

  formResetCallback (): void {
    this.checked = this.hasAttribute('checked')
    this.syncForm()
  }

  firstUpdated (): void {
    this.syncForm()
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('checked')) {
      this.setAttribute('aria-checked', String(this.checked))
      this.syncForm()
    }
    if (changed.has('disabled')) {
      this.setAttribute('aria-disabled', String(this.disabled))
      this.tabIndex = this.disabled ? -1 : 0
    }
  }

  protected toggle (): void {
    if (this.disabled) return
    this.checked = !this.checked
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }
}
