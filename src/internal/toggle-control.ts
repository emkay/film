import type { PropertyValues } from 'lit'
import { property } from 'lit/decorators.js'
import { FilmFormControl } from './form-control.js'

/**
 * Base for form-associated toggle controls (checkbox, switch). The host element
 * *is* the control, so it owns the ARIA role, roving tabindex, keyboard
 * handling, checked state and form participation. Subclasses supply
 * {@link toggleRole}, their styles and their render.
 *
 * The label can come from the default slot or from the {@link label} property,
 * so these controls take `label="…"` the same way `film-input` and
 * `film-select` do.
 */
export abstract class FilmToggleControl extends FilmFormControl {
  /** Whether the control is checked / on. */
  @property({ type: Boolean, reflect: true }) checked = false

  /** The value submitted when checked. */
  @property({ type: String }) value = 'on'

  /**
   * The control's label, for parity with the other form controls. Subclasses
   * render it as the default slot's fallback, so slotted content still wins.
   */
  @property({ type: String }) label = ''

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
    // The host carries the role, so its accessible name comes from its
    // contents. Naming it explicitly keeps `label` authoritative whichever way
    // the subclass renders the fallback.
    if (changed.has('label')) {
      if (this.label) this.setAttribute('aria-label', this.label)
      else this.removeAttribute('aria-label')
    }
  }

  protected toggle (): void {
    if (this.disabled) return
    this.checked = !this.checked
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }
}
