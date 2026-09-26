/**
 * The focused element in the tree `node` belongs to. `document.activeElement`
 * stops at the outermost shadow host, so a component rendered inside an app's
 * shadow root would see the app's host rather than its own focused child.
 * Film's composite widgets keep their items as light-DOM children, so the items
 * share the host's root and this finds them.
 */
export function activeElementOf (node: Node): Element | null {
  return (node.getRootNode() as Document | ShadowRoot).activeElement
}

/**
 * Descendants of `host` matching `selector` that belong to it rather than to a
 * nested instance of the same component — a film-tabs inside a tab panel, an
 * accordion inside an accordion item.
 */
export function ownDescendants<T extends Element> (host: Element, selector: string): T[] {
  return Array.from(host.querySelectorAll<T>(selector)).filter(
    (el) => el.closest(host.localName) === host
  )
}

/**
 * The element matching `selector` that an event came from, provided it belongs
 * to `host`. Host-level listeners use it to ignore events bubbling up from
 * slotted content they don't own.
 */
export function ownTarget<T extends Element> (host: Element, event: Event, selector: string): T | null {
  const match = (event.target as Element | null)?.closest?.(selector) as T | null
  return match && match.closest(host.localName) === host ? match : null
}
