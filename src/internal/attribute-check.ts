/** A value an enumerated property accepts: a fixed list, or a pattern. */
export type AllowedValues = readonly string[] | RegExp

/**
 * Plain-word global HTML attributes. Anything with punctuation — `aria-*`,
 * `data-*`, and framework artefacts such as `_ngcontent-x`, `data-v-x`,
 * `x-data` or `:class` — is never checked, so it needs no entry here.
 */
const GLOBAL_ATTRIBUTES = new Set([
  'accesskey', 'anchor', 'autocapitalize', 'autocorrect', 'autofocus', 'class',
  'contenteditable', 'dir', 'draggable', 'enterkeyhint', 'exportparts', 'hidden',
  'id', 'inert', 'inputmode', 'is', 'itemid', 'itemprop', 'itemref', 'itemscope',
  'itemtype', 'lang', 'nonce', 'part', 'popover', 'role', 'slot', 'spellcheck',
  'style', 'tabindex', 'title', 'translate', 'writingsuggestions'
])

const warned = new Set<string>()
let enabled = true

/**
 * Turn Film's attribute warnings on or off (they're on by default). They flag
 * real mistakes, so they're useful in production too, but can be silenced.
 */
export function setFilmWarnings (on: boolean): void {
  enabled = on
}

export function warningsEnabled (): boolean {
  return enabled
}

/** Log `message` the first time `key` is seen, and never again for this page. */
export function warnOnce (key: string, message: string): void {
  if (warned.has(key)) return
  warned.add(key)
  console.warn(message)
}

export function isAllowed (value: string, allowed: AllowedValues): boolean {
  return allowed instanceof RegExp ? allowed.test(value) : allowed.includes(value)
}

export function describeAllowed (allowed: AllowedValues): string {
  return allowed instanceof RegExp ? `a value matching ${String(allowed)}` : `one of: ${allowed.join(', ')}`
}

/**
 * Whether an attribute on a Film element looks like a mistake: a plain word the
 * element doesn't observe and HTML doesn't define. Deliberately conservative —
 * a missed typo costs less than a false alarm on markup a framework generated.
 */
export function isUnknownAttribute (name: string, observed: ReadonlySet<string>): boolean {
  return /^[a-z]+$/.test(name) &&
    !name.startsWith('on') &&
    !observed.has(name) &&
    !GLOBAL_ATTRIBUTES.has(name)
}

/**
 * Declare the values an enumerated property accepts, checked against its type
 * at compile time in both directions: a value outside `T` is rejected, and so
 * is a list missing any member of `T`. The property keeps its plain union type,
 * which is what editors read from the manifest to offer completions.
 *
 *     static allowedValues = { shape: oneOf<Avatar['shape']>()('circle', 'square') }
 */
export function oneOf<T extends string> () {
  return <const V extends readonly T[]>(
    ...values: V & ([T] extends [V[number]] ? unknown : ['missing a value of the type'])
  ): readonly T[] => values
}
