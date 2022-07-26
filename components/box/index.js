import { LitElement, css, html } from 'lit'

export default class Box extends LitElement {
  static properties = {
    invert: { type: Boolean }
  }

  static styles = css`
    :host div {
      border: var(--border-thin) solid;
      color: var(--color-dark);
      background-color: var(--color-light);
      padding: var(--s1);
    }

    :host div ::slotted(*) {
      color: inherit;
    }

    :host div.invert {
      background-color: var(--color-dark);
      color: var(--color-light);
    }
  `

  constructor () {
    super()
    this.invert = false
  }

  render () {
    const classes = this.invert ? 'invert' : ''
    return html`
      <div class=${classes}>
        <slot></slot>
      </div>
    `
  }
}

customElements.define('film-box', Box)
