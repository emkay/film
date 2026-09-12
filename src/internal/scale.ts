/** A bare modular-scale step: `s0`, `s1`…`s5`, `s-1`…`s-5`. */
const STEP = /^s-?\d+$/

/**
 * Resolve a spacing/size value that may be written either way.
 *
 * Film's typography properties take a bare scale *step* (`size="s1"`) while its
 * layout properties take a CSS *length* (`space="var(--s1)"`). Both readings are
 * plausible from the outside, and the wrong one used to fail silently — `gap: s0`
 * is invalid CSS, so the declaration was dropped and the default gap survived,
 * which reads as a styling bug rather than a typo.
 *
 * Accepting both closes that trap: a bare step becomes `var(--s1)`, and anything
 * else (a length, a `var()`, `auto`, `0`) is passed through untouched.
 */
export function resolveScale (value: string): string {
  return STEP.test(value) ? `var(--${value})` : value
}
