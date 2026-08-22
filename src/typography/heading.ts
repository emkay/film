/* eslint-disable lit/binding-positions, lit/no-invalid-html --
   These rules don't understand lit/static-html's dynamic tag (`<${tag}>`). */
import { css } from 'lit'
import { html, literal, type StaticValue } from 'lit/static-html.js'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

const TAGS: Record<number, StaticValue> = {
  1: literal`h1`,
  2: literal`h2`,
  3: literal`h3`,
  4: literal`h4`,
  5: literal`h5`,
  6: literal`h6`
}

// Default modular-scale step per heading level.
const SIZES: Record<number, string> = {
  1: '--s4',
  2: '--s3',
  3: '--s2',
  4: '--s1',
  5: '--s0',
  6: '--s-1'
}

/**
 * Heading — a semantic `h1`–`h6` sized from the modular scale.
 *
 * @slot - The heading text.
 */
@customElement('film-heading')
export class Heading extends FilmElement {
  /** The heading level (1–6), controlling both the tag and the default size. */
  @property({ type: Number }) level = 2

  /** Override the size with a scale step, e.g. `s5` or `s-1`. */
  @property({ type: String }) size = ''

  static styles = css`
    :host {
      display: block;
    }

    .heading {
      margin: 0;
      font-family: inherit;
      line-height: 1.2;
      color: var(--film-color-text);
      font-size: var(--film-heading-size, var(--s3));
    }
  `

  updated (): void {
    const step = this.size ? `--${this.size}` : SIZES[this.level] ?? '--s3'
    this.style.setProperty('--film-heading-size', `var(${step})`)
  }

  render () {
    const tag = TAGS[this.level] ?? TAGS[2]
    return html`<${tag} class="heading"><slot></slot></${tag}>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-heading': Heading
  }
}
