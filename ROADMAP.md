# Film Roadmap

Planned components and features. Priority: **P1** fills a conspicuous hole /
high value · **P2** rounds out the set · **P3** advanced / nice-to-have.
Checked items are implemented (component + demo example + build passing).

## Components

### Forms
- [x] `film-field` — label + hint + error + required marker wrapper, wired to validity (P1)
- [x] `film-form` — aggregates validity, submit/reset (P1)
- [x] `film-textarea` — multi-line, auto-grow, form-associated (P1)
- [x] `film-select` — form-associated select (trigger + listbox) (P1)
- [x] `film-combobox` — filterable / autocomplete select (P2)
- [x] `film-search` — input with clear button (P2)
- [x] `film-number-input` — with steppers (P2)
- [x] `film-slider` — two-thumb range (P2)
- [x] `film-file-input` — file / dropzone (P2)
- [x] `film-date-picker` + `film-calendar` (P2)
- [ ] `film-time-picker` (P3)
- [ ] `film-rating` — stars (P3)
- [ ] `film-pin-input` — OTP (P3)
- [ ] `film-tags-input` (P3)

### Actions
- [x] `film-icon-button` — square, requires `aria-label` (P1)
- [x] `film-button-group` — grouped / segmented (P2)
- [ ] `film-toggle-button` (P3)
- [ ] `film-split-button` — button + dropdown (P3)

### Feedback
- [x] `film-toast` + `toast()` controller — transient, stacked, auto-dismiss (P1)
- [x] `film-spinner` — indeterminate loader (P1)
- [x] `film-skeleton` — loading placeholder (P2)
- [ ] `film-empty-state` (P3)

### Overlays
- [x] `film-popover` — generic anchored container (generalize dropdown/tooltip) (P2)
- [x] `film-popconfirm` (P3)
- [ ] `film-context-menu` (P3)

### Navigation
- [x] `film-pagination` (P1)
- [x] `film-steps` — stepper (P2)
- [x] `film-nav` — nav list with active state (P2)
- [x] submenus for `film-menu` (P3)
- [ ] `film-command-palette` — ⌘K (P3)

### Data display
- [x] `film-accordion` + `-item` — grouped disclosure (P2)
- [x] `film-list` + `-item` (P2)
- [x] data-grid upgrade to `table` — sorting, selection, sticky header (P2)
- [x] `film-code` — code block with copy (P2)
- [ ] `film-stat` (P3)
- [ ] `film-timeline` (P3)
- [ ] `film-carousel` — build on `reel` (P3)
- [x] `film-kbd` (P3)
- [ ] `film-description-list` (P3)

### Typography & media
- [x] `film-heading` / `film-text` / `film-prose` (P2)
- [ ] `film-image` — lazy / fallback (P2)
- [ ] an icon set for `film-icon` (P2)

## Infrastructure & features
- [x] Tests — `@web/test-runner` + `@open-wc/testing` (P1) — harness + starter suite (11 tests)
- [x] Linting/formatting — ESLint (flat) + Prettier (P1)
- [x] Custom Elements Manifest — `custom-elements.json` (P1)
- [x] CI — typecheck + lint + manifest + build + test (P1)
- [x] Framework wrappers — `@lit/react` (generated from the CEM); Vue/Angular consume the elements directly (P2)
- [ ] SSR / Declarative Shadow DOM — `@lit-labs/ssr` (P2)
- [ ] Docs site generated from the CEM (P2)
- [x] Per-component subpath exports (tree-shaking) (P2)
- [x] Token expansion — elevation/shadow, z-index, motion tokens (P2)
- [ ] Accessibility hardening — full keyboard nav for tree/table/menu (P2)
- [ ] RTL story (P3)
- [ ] Overlay enter/exit transitions honoring reduced-motion (P3)

## Requested (film-os)

From feedback building [film-os](https://github.com/emkay/film-os). Ordered by
the recommended sequence.

- [x] Fix `sideEffects` to cover `dist/**/*.js` (blocking — bundlers dropped registration)
- [x] CI bundle smoke-test — assert a bundled consumer still registers an element
- [x] `film-button` size — `small` / `medium` / `large`
- [x] `film-tree` lazy children — `hasChildren` / `loading` / error + `film-tree-expand` event
- [x] `DragController` — reusable pointer/keyboard drag mechanics (controller)
- [x] `film-window` — non-modal, stackable, draggable/resizable positioned panel
- [x] `film-workspace` — window container: z-order, focus, floating + grid-tiled layout, layout event
- [x] `film-workspace` drag-to-snap + recursive tiling (follow-up)
- [x] `film-table` virtualisation — opt-in `virtualized` for large row counts
- [x] `film-menu-bar` — horizontal app menu with roving focus (builds on `film-menu` submenus)
