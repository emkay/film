import { css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Slider — a two-thumb range slider producing a `[valueMin, valueMax]` range.
 *
 * @fires film-change - When either thumb moves. `detail` is `{ min, max }`.
 */
@customElement('film-slider')
export class Slider extends FilmElement {
  @property({ type: Number }) min = 0
  @property({ type: Number }) max = 100
  @property({ type: Number }) step = 1
  @property({ type: Number, attribute: 'value-min' }) valueMin = 20
  @property({ type: Number, attribute: 'value-max' }) valueMax = 80
  @property({ type: String }) label = ''

  /** Show the current range beside the label. */
  @property({ type: Boolean, attribute: 'show-values' }) showValues = false

  static styles = css`
    :host {
      display: block;
    }

    .row {
      display: flex;
      justify-content: space-between;
      font-size: var(--s-1);
    }

    .slider {
      position: relative;
      block-size: 1.5em;
      display: flex;
      align-items: center;
    }

    .track,
    .fill {
      position: absolute;
      block-size: var(--border-thick);
      border-radius: var(--film-radius-pill);
    }

    .track {
      inset-inline: 0;
      background-color: var(--film-color-border);
    }

    .fill {
      background-color: var(--film-color-inverted-surface);
    }

    input[type='range'] {
      position: absolute;
      inset-inline: 0;
      inline-size: 100%;
      block-size: 100%;
      margin: 0;
      background: none;
      pointer-events: none;
      -webkit-appearance: none;
      appearance: none;
    }

    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      pointer-events: auto;
      inline-size: 1.1em;
      block-size: 1.1em;
      border-radius: 50%;
      background-color: var(--film-color-surface);
      border: var(--border-thick) solid var(--film-color-inverted-surface);
      cursor: grab;
    }

    input[type='range']::-moz-range-thumb {
      pointer-events: auto;
      inline-size: 1.1em;
      block-size: 1.1em;
      border-radius: 50%;
      background-color: var(--film-color-surface);
      border: var(--border-thick) solid var(--film-color-inverted-surface);
      cursor: grab;
    }

    input[type='range']:focus-visible::-webkit-slider-thumb {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: 2px;
    }

    input[type='range']:focus-visible::-moz-range-thumb {
      outline: var(--border-thin) solid var(--film-color-focus);
    }
  `

  private percent (value: number): number {
    return ((value - this.min) / (this.max - this.min)) * 100
  }

  private emit (): void {
    this.dispatchEvent(
      new CustomEvent('film-change', {
        detail: { min: this.valueMin, max: this.valueMax },
        bubbles: true
      })
    )
  }

  private onMinInput (event: Event): void {
    this.valueMin = Math.min(Number((event.target as HTMLInputElement).value), this.valueMax)
    this.emit()
  }

  private onMaxInput (event: Event): void {
    this.valueMax = Math.max(Number((event.target as HTMLInputElement).value), this.valueMin)
    this.emit()
  }

  render () {
    const left = this.percent(this.valueMin)
    const right = this.percent(this.valueMax)
    return html`
      ${this.label || this.showValues
        ? html`<div class="row">
            <span>${this.label}</span>
            ${this.showValues ? html`<span>${this.valueMin} – ${this.valueMax}</span>` : nothing}
          </div>`
        : nothing}
      <div class="slider">
        <div class="track"></div>
        <div class="fill" style="inset-inline-start:${left}%; inset-inline-end:${100 - right}%"></div>
        <input
          type="range"
          min=${this.min}
          max=${this.max}
          step=${this.step}
          .value=${String(this.valueMin)}
          aria-label=${this.label ? `${this.label} minimum` : 'Minimum'}
          @input=${this.onMinInput}
        />
        <input
          type="range"
          min=${this.min}
          max=${this.max}
          step=${this.step}
          .value=${String(this.valueMax)}
          aria-label=${this.label ? `${this.label} maximum` : 'Maximum'}
          @input=${this.onMaxInput}
        />
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-slider': Slider
  }
}
