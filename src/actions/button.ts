import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { variantSurface } from '../internal/variant-surface.js'

export type ButtonSize = 'small' | 'medium' | 'large'

export type ButtonVariant =
  | 'primary'
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'

export type ButtonType = 'button' | 'submit' | 'reset'

/**
 * Button — a themed button. Sizing is expressed in `em` so it scales with the
 * surrounding font size, and its radius comes from the modular scale.
 *
 * The button is form-associated: inside a native `<form>`, `type="submit"`
 * submits it and `type="reset"` resets it, even though the real `<button>`
 * lives in the shadow root. Inside a `<film-form>` that component owns
 * submission instead, so the two never both fire.
 *
 * @slot - The button label.
 */
@customElement('film-button')
export class Button extends FilmElement {
  static formAssociated = true

  private readonly internals = this.attachInternals()

  /**
   * Use the inverted colour treatment. Shorthand for the neutral surface; it
   * takes precedence over {@link variant} when both are set.
   */
  @property({ type: Boolean, reflect: true })
  invert = false

  /** Disable the button. */
  @property({ type: Boolean, reflect: true })
  disabled = false

  /** The button size (drives `font-size` on the modular scale). */
  @property({ type: String, reflect: true })
  size: ButtonSize = 'medium'

  /** The colour treatment. `primary` is the default accent fill. */
  @property({ type: String, reflect: true })
  variant: ButtonVariant = 'primary'

  /** What activating the button does to its form. */
  @property({ type: String, reflect: true })
  type: ButtonType = 'button'

  /** The form this button belongs to, if any. */
  get form (): HTMLFormElement | null {
    return this.internals.form
  }

  static styles = css`
    button {
      background-color: var(--button-surface, var(--film-color-primary));
      border: none;
      border-radius: var(--film-radius);
      color: var(--button-ink, var(--film-color-primary-text));
      cursor: pointer;
      font-size: var(--s0);
      padding: 0.5em 1.5em 0.7em;
    }

    :host([size='small']) button {
      font-size: var(--s-1);
    }

    :host([size='large']) button {
      font-size: var(--s1);
    }

    button:focus {
      outline: solid;
      background-color: var(--button-surface-hover, var(--film-color-primary-hover));
    }

    button:hover {
      outline: solid;
      background-color: var(--button-surface-hover, var(--film-color-primary-hover));
    }

    button:active {
      background-color: var(--button-surface-active, var(--film-color-primary-active));
    }

    button[disabled] {
      cursor: not-allowed;
      opacity: var(--film-disabled-opacity);
    }

    /* Last, so invert wins over the variant custom properties above. */
    button.invert {
      background-color: var(--film-color-inverted-surface);
      color: var(--film-color-inverted-text);
    }

    button.invert:hover,
    button.invert:focus {
      background-color: color-mix(in oklch, var(--film-color-inverted-surface), var(--film-color-primary) 30%);
    }
  `

  constructor () {
    super()
    this.addEventListener('click', this.onClick)
  }

  updated (changed: PropertyValues<this>): void {
    super.updated(changed)
    if (changed.has('variant')) this.applyVariant()
  }

  formDisabledCallback (disabled: boolean): void {
    this.disabled = disabled
  }

  /**
   * `primary` keeps the plain `--film-color-primary-*` tokens via the CSS
   * fallbacks, so clearing the custom properties is how it goes back to the
   * default rather than a second set of declarations.
   */
  private applyVariant (): void {
    if (this.variant === 'primary') {
      this.reflectStyleProps({
        '--button-surface': null,
        '--button-ink': null,
        '--button-surface-hover': null,
        '--button-surface-active': null
      })
      return
    }
    const surface = variantSurface(this.variant, 'var(--film-color-inverted-surface)')
    const ink =
      this.variant === 'neutral' ? 'var(--film-color-inverted-text)' : 'var(--film-color-text)'
    this.reflectStyleProps({
      '--button-surface': surface,
      '--button-ink': ink,
      '--button-surface-hover': `color-mix(in oklch, ${surface}, ${ink} 12%)`,
      '--button-surface-active': `color-mix(in oklch, ${surface}, ${ink} 22%)`
    })
  }

  // A shadow-root <button> is never associated with a light-DOM <form>, so the
  // browser won't submit for us — drive the form through ElementInternals
  // instead. A `film-form` already handles `type="submit"` on its slotted
  // children, so defer to it rather than submitting twice when one is nested
  // inside a native <form>.
  private readonly onClick = (): void => {
    if (this.disabled || this.type === 'button') return
    if (this.closest('film-form')) return
    const form = this.internals.form
    if (!form) return
    if (this.type === 'submit') form.requestSubmit()
    else form.reset()
  }

  render () {
    return html`
      <button
        type="button"
        class=${this.invert ? 'invert' : nothing}
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-button': Button
  }
}
