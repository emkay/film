# Film

The Film Design Language — an opinionated, modern web component library built
with [Lit](https://lit.dev/). Its layout components follow the
[Every Layout](https://every-layout.dev/) primitives, and every size is a step
on a single [modular scale](https://every-layout.dev/rudiments/modular-scale/)
so the whole UI stays in proportion.

## Install

```sh
npm i @mk/film lit
```

## Usage

```js
import '@mk/film'          // registers every <film-*> element
import '@mk/film/css/themes/default/index.css'
```

```html
<film-stack>
  <film-box>
    <p>A box in a stack.</p>
  </film-box>
  <film-button>Click me</film-button>
</film-stack>
```

## Components

**Layout** (`src/layout`)

| Element          | Purpose                                                     |
| ---------------- | ----------------------------------------------------------- |
| `film-stack`     | Even, scale-based vertical spacing between children.        |
| `film-box`       | Padded, bordered box (`invert`).                            |
| `film-center`    | Horizontally centres content within `--measure`.            |
| `film-cluster`   | Wrapping row of items with an even gap.                     |
| `film-sidebar`   | Two-part sidebar/content layout that collapses when tight. `scroll="start\|end\|both"` gives a pane its own scrollbar (needs a bounded host height). |
| `film-grid`      | Auto-fit responsive grid (`min`, `space`).                  |
| `film-switcher`  | Row that flips to a stack below a `threshold` (or `limit`). |
| `film-cover`     | Fills a min height and centres content, with top/bottom.    |
| `film-frame`     | Crops slotted media to a fixed `ratio`.                     |
| `film-reel`      | Horizontally scrolling, snap-aligned strip.                 |
| `film-imposter`  | Overlays content centred on a positioned ancestor.          |
| `film-icon`      | Sizes a slotted SVG to the adjacent text.                   |
| `film-split-panel` | Two panes with a draggable, keyboard-operable divider.    |

**Actions** (`src/actions`) — `film-button`, `film-link`, `film-copy-button`.

**Typography** (`src/typography`) — `film-divider`, `film-visually-hidden`.

**Forms** (`src/forms`) — form-associated controls (participate in a native `<form>` via `ElementInternals`): `film-input`, `film-checkbox`, `film-radio` / `film-radio-group`, `film-switch`, `film-range`, `film-color-picker`.

**Navigation** (`src/navigation`) — `film-breadcrumb` / `film-breadcrumb-item`, `film-menu` / `film-menu-item`, `film-tabs` / `film-tab` / `film-tab-panel`, `film-tree` / `film-tree-item`.

**Overlays** (`src/overlays`) — `film-dialog` and `film-drawer` (native `<dialog>` top layer), `film-dropdown` and `film-tooltip` (Popover API + a hand-rolled positioning helper).

**Data** (`src/data`) — `film-card` (with `media` / `footer` slots), `film-avatar`, `film-details`, `film-table` (data-driven via `columns` / `rows`).

**Feedback** (`src/feedback`) — `film-alert`, `film-badge`, `film-tag` (`variant`, `removable`), `film-progress-bar`.

## Modular scale

Sizes come from CSS custom properties `--s-5` … `--s5`, generated from a single
`--ratio`. The scale uses the CSS `pow()` function where supported and falls
back to a `calc()` chain everywhere else. Override the whole system by setting
`--ratio` and `--s0` on `:root`.

## Theming

Film is themed entirely through CSS custom properties — because custom
properties inherit through the shadow DOM, anything you set on `:root` (or any
subtree) reaches every component. All colours are authored in **oklch**.

There are three layers:

1. **Palette** (`--film-palette-*`) — raw oklch primitives. Internal; don't
   reference these directly.
2. **Semantic tokens** (`--film-*`) — the theming API. Components only ever read
   from this layer.
3. **Components** — consume the semantic tokens.

To retheme, override the semantic tokens:

```css
:root {
  --film-color-primary: oklch(0.72 0.15 250);
  --film-color-link: oklch(0.55 0.16 250);
  --film-color-danger: oklch(0.9 0.06 25);
  --film-radius: 0.25rem;      /* squarer corners everywhere */
  --film-font-sans: "Inter", system-ui, sans-serif;
}
```

The main tokens:

| Token | Purpose |
|---|---|
| `--film-color-text` / `--film-color-text-muted` | Body text / secondary text |
| `--film-color-background` / `--film-color-surface` | Page / component surfaces |
| `--film-color-border` | Borders and dividers |
| `--film-color-primary` (`-hover` / `-active` / `-text`) | Buttons / accents |
| `--film-color-inverted-surface` / `--film-color-inverted-text` | Dark-on-light pairs (inverted Box, tooltips, badges…) |
| `--film-color-link` / `--film-color-focus` | Links / focus rings |
| `--film-color-info` / `-success` / `-warning` / `-danger` | Status surfaces |
| `--film-radius-sm` / `--film-radius` / `--film-radius-lg` / `--film-radius-pill` | Corner radii |
| `--film-overlay-scrim` | Modal/drawer backdrop |
| `--film-disabled-opacity` | Disabled-state opacity |
| `--film-font-sans` / `-serif` / `-mono` | Font families |

### Dark mode

The theme ships light and dark values via the CSS `light-dark()` function, so it
**follows the OS preference automatically**. Force a scheme on any subtree with
a data attribute:

```html
<html data-theme="dark">   <!-- or "light" -->
```

## Development

```sh
npm install
npm run dev        # start the Vite dev server (demo site)
npm run typecheck  # type-check with tsc
npm run build      # build the demo site into dist/
npm run build:lib  # build the publishable library into dist/
```

Written in TypeScript with Lit decorators. The library source lives in `src/`
(grouped into `layout`, `actions`, `typography`, `forms`, `navigation`,
`overlays`, `data`, `feedback`, with shared internals in `internal`), the demo
site in `demo/`, and the theme/scale CSS in `css/` (palette in
`definitions/colors.css`, semantic tokens in `application/theme.css`). Every
component extends `FilmElement`; form controls extend `FilmFormControl`.
