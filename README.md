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
| `film-sidebar`   | Two-part sidebar/content layout that collapses when tight.  |
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

## Development

```sh
npm install
npm run dev        # start the Vite dev server (demo site)
npm run typecheck  # type-check with tsc
npm run build      # build the demo site into dist/
npm run build:lib  # build the publishable library into dist/
```

Written in TypeScript with Lit decorators. The library source lives in `src/`
(grouped into `layout`, `actions`, `typography`, `data`, `feedback`, with shared
internals in `internal`), the demo site in `demo/`, and the theme/scale CSS in
`css/`. Every component extends `FilmElement`.
