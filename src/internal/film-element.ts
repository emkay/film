import { LitElement, type PropertyValues } from 'lit'
import './version.js'
import { resolveScale } from './scale.js'
import {
  describeAllowed,
  isAllowed,
  isUnknownAttribute,
  warnOnce,
  warningsEnabled,
  type AllowedValues
} from './attribute-check.js'

/**
 * Base class for every Film element. Provides a small helper for reflecting
 * values onto host-level CSS custom properties, plus a declarative
 * {@link styleProps} map so simple layout components don't each need their own
 * `updated()` boilerplate. It's also the single seam for shared behaviour
 * (theming, parts, etc.) later.
 *
 * It warns, once per distinct mistake, about the two errors that otherwise fail
 * silently and read as a styling problem: an attribute the element doesn't have
 * (`variant` on `film-cluster`), and a value an enumerated property doesn't
 * accept (`variant="primray"`). `setFilmWarnings(false)` silences them.
 */
export class FilmElement extends LitElement {
  /**
   * The values each enumerated property accepts, keyed by property name. A
   * value outside them is warned about; the property still takes it.
   */
  static allowedValues: Record<string, AllowedValues> = {}

  /**
   * Declarative map of CSS custom property → reactive property name. The base
   * `updated()` reflects each onto the host whenever its backing property
   * changes, resolving a bare modular-scale step (`s1`) to `var(--s1)` on the
   * way through. Subclasses that need transforms or extra work can still
   * override `updated()` (and call `super.updated(changed)` to keep this
   * behaviour).
   */
  static styleProps: Record<string, string> = {}

  /**
   * Mirror a set of CSS custom properties onto the host element's inline style.
   * A `null` value removes the property.
   */
  protected reflectStyleProps (props: Record<string, string | null>): void {
    for (const [name, value] of Object.entries(props)) {
      if (value === null) this.style.removeProperty(name)
      else this.style.setProperty(name, value)
    }
  }

  connectedCallback (): void {
    super.connectedCallback()
    if (warningsEnabled()) this.checkAttributes()
  }

  // Checked here rather than in willUpdate()/updated(), which subclasses
  // override (not always calling super); nothing in Film overrides update().
  protected update (changed: PropertyValues): void {
    if (warningsEnabled()) this.checkValues(changed)
    super.update(changed)
  }

  private checkAttributes (): void {
    const ctor = this.constructor as typeof FilmElement
    const observed = new Set(ctor.observedAttributes)
    for (const { name } of Array.from(this.attributes)) {
      if (!isUnknownAttribute(name, observed)) continue
      warnOnce(
        `${this.localName} @${name}`,
        `${this.localName} has no "${name}" attribute, so it is ignored.`
      )
    }
  }

  private checkValues (changed: PropertyValues): void {
    const ctor = this.constructor as typeof FilmElement
    const self = this as unknown as Record<string, unknown>
    for (const [prop, allowed] of Object.entries(ctor.allowedValues)) {
      if (!changed.has(prop)) continue
      const value = self[prop]
      if (typeof value !== 'string' || isAllowed(value, allowed)) continue
      const attribute = ctor.elementProperties.get(prop)?.attribute
      const name = typeof attribute === 'string' ? attribute : prop.toLowerCase()
      warnOnce(
        `${this.localName} ${name}=${value}`,
        `${this.localName}: "${value}" is not a valid ${name}; expected ${describeAllowed(allowed)}.`
      )
    }
  }

  updated (changed: PropertyValues): void {
    const map = (this.constructor as typeof FilmElement).styleProps
    const self = this as unknown as Record<string, unknown>
    for (const cssVar in map) {
      const prop = map[cssVar]
      if (changed.has(prop)) this.style.setProperty(cssVar, resolveScale(String(self[prop])))
    }
  }
}
