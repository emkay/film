import { LitElement, type PropertyValues } from 'lit'

/**
 * Base class for every Film element. Provides a small helper for reflecting
 * values onto host-level CSS custom properties, plus a declarative
 * {@link styleProps} map so simple layout components don't each need their own
 * `updated()` boilerplate. It's also the single seam for shared behaviour
 * (theming, parts, etc.) later.
 */
export class FilmElement extends LitElement {
  /**
   * Declarative map of CSS custom property → reactive property name. The base
   * `updated()` reflects each onto the host whenever its backing property
   * changes. Subclasses that need transforms or extra work can still override
   * `updated()` (and call `super.updated(changed)` to keep this behaviour).
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

  updated (changed: PropertyValues): void {
    const map = (this.constructor as typeof FilmElement).styleProps
    const self = this as unknown as Record<string, unknown>
    for (const cssVar in map) {
      const prop = map[cssVar]
      if (changed.has(prop)) this.style.setProperty(cssVar, String(self[prop]))
    }
  }
}
