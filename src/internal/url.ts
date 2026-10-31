import { warningsEnabled, warnOnce } from './attribute-check.js'

/**
 * Schemes a link must never carry. `javascript:` and `vbscript:` run code when
 * the link is followed; a top-level `data:` navigation is blocked by browsers
 * anyway, so it can only be a spoofed page or a script trying its luck.
 */
const BLOCKED = new Set(['javascript:', 'vbscript:', 'data:'])

/**
 * The href to render for a link, or null to render no link at all.
 *
 * Lit doesn't sanitise URLs, and @lit/react sets a Film element's `href` as a
 * property, so React's own block on javascript: URLs never sees it — this is
 * the last place to stop one. The URL is parsed the way the browser will parse
 * it, so disguised forms (" JaVaScRiPt:", "java\tscript:", a leading control
 * character) are caught too. Anything else, relative or absolute, passes
 * through unchanged.
 */
export function safeHref (href: string): string | null {
  if (!href) return null
  let protocol: string
  try {
    protocol = new URL(href, document.baseURI).protocol
  } catch {
    return href // Not a parseable URL: the browser won't navigate it as a scheme either.
  }
  if (!BLOCKED.has(protocol)) return href
  if (warningsEnabled()) {
    warnOnce(`url ${protocol}`, `Film blocked a ${protocol} link; it was rendered without an href.`)
  }
  return null
}
