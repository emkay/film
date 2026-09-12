/**
 * Film's manifest is the public API surface consumers and editors read, so it
 * has to satisfy two things that pull against each other:
 *
 *   1. It must list every attribute a component actually takes, including the
 *      ones it inherits from an internal base class (`open` and `label` from
 *      FilmModal, `checked` / `disabled` from FilmToggleControl, and so on).
 *   2. It must not advertise the internal base classes themselves, or the
 *      private members of any component.
 *
 * Getting (1) means `src/internal/**` has to be analysed — CEM resolves
 * inheritance by looking the superclass up in the manifest, so excluding those
 * modules left every inherited attribute missing, and the manifest read as
 * though those attributes did not exist. So they are analysed, and then dropped
 * here, after CEM's own inheritance pass has copied the members down. User
 * plugins run after the core ones, which is what makes that ordering hold.
 */

/** Framework-config statics that aren't part of a component's public API. */
const CONFIG_MEMBERS = new Set(['shadowRootOptions', 'styleProps', 'formAssociated'])

const INTERNAL = /^(\.\/)?src\/internal\//

/**
 * Private and protected members are both internal: `protected` marks a subclass
 * hook (`getFormValue`, `syncForm`, `reflectStyleProps`), which a consumer of
 * the element never calls. Inheritance would otherwise copy every one of them
 * down from the base classes onto each component.
 */
const INTERNAL_PRIVACY = new Set(['private', 'protected'])

const dropInternalMembers = {
  name: 'drop-internal-members',
  packageLinkPhase ({ customElementsManifest }) {
    for (const mod of customElementsManifest.modules ?? []) {
      for (const decl of mod.declarations ?? []) {
        if (Array.isArray(decl.members)) {
          decl.members = decl.members.filter(
            (member) => !INTERNAL_PRIVACY.has(member.privacy) && !CONFIG_MEMBERS.has(member.name)
          )
        }
      }
    }
  }
}

const dropInternalModules = {
  name: 'drop-internal-modules',
  packageLinkPhase ({ customElementsManifest }) {
    customElementsManifest.modules = (customElementsManifest.modules ?? []).filter(
      (mod) => !INTERNAL.test(mod.path)
    )
  }
}

export default {
  globs: ['src/**/*.ts'],
  exclude: ['src/**/*.test.ts'],
  outdir: '.',
  litelement: true,
  // Order matters: inherited members are copied down by CEM's core inheritance
  // pass, then the internal ones are filtered, then the base classes go away.
  plugins: [dropInternalMembers, dropInternalModules]
}
