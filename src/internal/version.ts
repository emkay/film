/**
 * The version of this copy of Film. Kept in step with package.json by
 * release-please (the annotation below), and checked against it by a test.
 */
export const version = '1.4.0' // x-release-please-version

declare global {
  /** Every copy of Film loaded on the page, by version. See the README's Troubleshooting. */
  var filmVersions: string[] | undefined
}

// Record this copy, as Lit does with `litElementVersions` — quietly, since Film
// has no separate dev build and a console banner would reach production. It
// answers "which Film is this page running?" when a dev server's dependency
// cache serves a stale copy after an upgrade, and shows two copies loaded.
;(globalThis.filmVersions ??= []).push(version)
