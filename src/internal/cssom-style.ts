import { nothing } from 'lit'
import { Directive, directive, PartType, type ElementPart, type PartInfo } from 'lit/directive.js'

type Styles = Record<string, string | number | null | undefined>

/**
 * cssomStyle({ 'inline-size': '40%' }) — dynamic inline styles that work under
 * a strict Content-Security-Policy. A `style="…"` binding (and Lit's own
 * styleMap, which writes the attribute on first render) sets a style attribute
 * at runtime, which `style-src` without 'unsafe-inline' blocks; this writes
 * through element.style instead, which the policy allows. Used as an element
 * binding: `<div ${cssomStyle({...})}>`. Property names are CSS names; a null
 * or undefined value removes the property.
 */
class CssomStyle extends Directive {
  private applied = new Set<string>()

  constructor (info: PartInfo) {
    super(info)
    if (info.type !== PartType.ELEMENT) throw new Error('cssomStyle() must be used as an element binding')
  }

  render (_styles: Styles): typeof nothing {
    return nothing
  }

  override update (part: ElementPart, [styles]: [Styles]): typeof nothing {
    const { style } = part.element as HTMLElement
    const next = new Set<string>()
    for (const [name, value] of Object.entries(styles)) {
      if (value === null || value === undefined) continue
      style.setProperty(name, String(value))
      next.add(name)
    }
    for (const name of this.applied) if (!next.has(name)) style.removeProperty(name)
    this.applied = next
    return nothing
  }
}

export const cssomStyle = directive(CssomStyle)
