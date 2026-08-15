import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Card — a bordered surface with an optional media region on top and an
 * optional footer. The media and footer regions collapse when their slots are
 * empty.
 *
 * @slot - The card body.
 * @slot media - Media pinned to the top of the card (e.g. an image or Frame).
 * @slot footer - Footer content, separated by a rule.
 * @csspart card - The card container.
 * @csspart body - The padded body region.
 */
@customElement('film-card')
export class Card extends FilmElement {
  /** Swap foreground and background colours. */
  @property({ type: Boolean, reflect: true })
  invert = false

  @state() private hasMedia = false
  @state() private hasFooter = false

  static styles = css`
    :host {
      display: block;
    }

    .card {
      display: flex;
      flex-direction: column;
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius-lg);
      background-color: var(--film-color-surface);
      color: var(--film-color-text);
      overflow: hidden;
    }

    :host([invert]) .card {
      background-color: var(--film-color-inverted-surface);
      color: var(--film-color-inverted-text);
    }

    .media ::slotted(*) {
      display: block;
      inline-size: 100%;
    }

    .body {
      padding: var(--s1);
    }

    .footer {
      padding: var(--s1);
      border-block-start: var(--border-thin) solid;
    }

    .media[hidden],
    .footer[hidden] {
      display: none;
    }
  `

  private onMediaChange (event: Event) {
    this.hasMedia = (event.target as HTMLSlotElement).assignedElements().length > 0
  }

  private onFooterChange (event: Event) {
    this.hasFooter = (event.target as HTMLSlotElement).assignedElements().length > 0
  }

  render () {
    return html`
      <div class="card" part="card">
        <div class="media" ?hidden=${!this.hasMedia}>
          <slot name="media" @slotchange=${this.onMediaChange}></slot>
        </div>
        <div class="body" part="body">
          <slot></slot>
        </div>
        <div class="footer" ?hidden=${!this.hasFooter}>
          <slot name="footer" @slotchange=${this.onFooterChange}></slot>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-card': Card
  }
}
