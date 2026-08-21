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
- [ ] `film-combobox` — filterable / autocomplete select (P2)
- [ ] `film-search` — input with clear button (P2)
- [ ] `film-number-input` — with steppers (P2)
- [ ] `film-slider` — two-thumb range (extend `range`) (P2)
- [ ] `film-file-input` — file / dropzone (P2)
- [ ] `film-date-picker` + `film-calendar` (P2)
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
- [ ] `film-popover` — generic anchored container (generalize dropdown/tooltip) (P2)
- [ ] `film-popconfirm` (P3)
- [ ] `film-context-menu` (P3)

### Navigation
- [x] `film-pagination` (P1)
- [ ] `film-steps` — stepper (P2)
- [ ] `film-nav` — nav list with active state (P2)
- [ ] submenus for `film-menu` (P3)
- [ ] `film-command-palette` — ⌘K (P3)

### Data display
- [ ] `film-accordion` + `-item` — grouped disclosure (P2)
- [ ] `film-list` + `-item` (P2)
- [ ] data-grid upgrade to `table` — sorting, selection, sticky header (P2)
- [ ] `film-code` — code block with copy (P2)
- [ ] `film-stat` (P3)
- [ ] `film-timeline` (P3)
- [ ] `film-carousel` — build on `reel` (P3)
- [ ] `film-kbd` (P3)
- [ ] `film-description-list` (P3)

### Typography & media
- [ ] `film-heading` / `film-text` / `film-prose` (P2)
- [ ] `film-image` — lazy / fallback (P2)
- [ ] an icon set for `film-icon` (P2)

## Infrastructure & features
- [x] Tests — `@web/test-runner` + `@open-wc/testing` (P1) — harness + starter suite (11 tests)
- [x] Linting/formatting — ESLint (flat) + Prettier (P1)
- [x] Custom Elements Manifest — `custom-elements.json` (P1)
- [x] CI — typecheck + lint + manifest + build + test (P1)
- [ ] Framework wrappers — `@lit/react`, Vue/Angular types (P2)
- [ ] SSR / Declarative Shadow DOM — `@lit-labs/ssr` (P2)
- [ ] Docs site generated from the CEM (P2)
- [ ] Per-component subpath exports (tree-shaking) (P2)
- [ ] Token expansion — elevation/shadow, z-index, motion tokens (P2)
- [ ] Accessibility hardening — full keyboard nav for tree/table/menu (P2)
- [ ] RTL story (P3)
- [ ] Overlay enter/exit transitions honoring reduced-motion (P3)
