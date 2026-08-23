/**
 * Drop `private` members from the manifest so it advertises only the public API
 * surface. Internal fields/methods/handlers stay in the source (and are still
 * marked `private` there) — they just don't clutter what editors complete from.
 */
/** Framework-config statics that aren't part of a component's public API. */
const CONFIG_MEMBERS = new Set(['shadowRootOptions', 'styleProps', 'formAssociated'])

const dropPrivateMembers = {
  name: 'drop-private-members',
  packageLinkPhase ({ customElementsManifest }) {
    for (const mod of customElementsManifest.modules ?? []) {
      for (const decl of mod.declarations ?? []) {
        if (Array.isArray(decl.members)) {
          decl.members = decl.members.filter(
            (member) => member.privacy !== 'private' && !CONFIG_MEMBERS.has(member.name)
          )
        }
      }
    }
  }
}

export default {
  globs: ['src/**/*.ts'],
  exclude: ['src/**/*.test.ts', 'src/internal/**'],
  outdir: '.',
  litelement: true,
  plugins: [dropPrivateMembers]
}
