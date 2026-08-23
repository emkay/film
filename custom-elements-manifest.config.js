/**
 * Drop `private` members from the manifest so it advertises only the public API
 * surface. Internal fields/methods/handlers stay in the source (and are still
 * marked `private` there) — they just don't clutter what editors complete from.
 */
const dropPrivateMembers = {
  name: 'drop-private-members',
  packageLinkPhase ({ customElementsManifest }) {
    for (const mod of customElementsManifest.modules ?? []) {
      for (const decl of mod.declarations ?? []) {
        if (Array.isArray(decl.members)) {
          decl.members = decl.members.filter((member) => member.privacy !== 'private')
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
