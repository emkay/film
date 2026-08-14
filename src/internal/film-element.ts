import { LitElement } from 'lit'

/**
 * Base class for every Film element. Today it just provides a small helper for
 * reflecting reactive properties onto host-level CSS custom properties, but it
 * gives us a single seam for shared behaviour (theming, parts, etc.) later.
 */
export class FilmElement extends LitElement {
  /**
   * Mirror a set of CSS custom properties onto the host element's inline style.
   * A `null` value removes the property. Call from `updated()` so the values
   * track their backing reactive properties.
   */
  protected reflectStyleProps (props: Record<string, string | null>): void {
    for (const [name, value] of Object.entries(props)) {
      if (value === null) this.style.removeProperty(name)
      else this.style.setProperty(name, value)
    }
  }
}
