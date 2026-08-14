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

| Element        | Purpose                                                    |
| -------------- | ---------------------------------------------------------- |
| `film-stack`   | Even, scale-based vertical spacing between children.       |
| `film-box`     | Padded, bordered box (`invert` for reversed colours).      |
| `film-center`  | Horizontally centres content within `--measure`.           |
| `film-cluster` | Wrapping row of items with an even gap.                    |
| `film-sidebar` | Two-part sidebar/content layout that collapses when tight. |
| `film-link`    | A themed anchor (`href`).                                  |
| `film-button`  | A themed button (`invert`, `disabled`).                    |

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

Written in TypeScript with Lit decorators. The library source lives in `src/`,
the demo site in `demo/`, and the theme/scale CSS in `css/`.
