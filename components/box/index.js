import {LitElement, css, html} from 'lit'

export default class Box extends LitElement {
  static properties = {
  }

  static styles = css`
    :host {
      border: var(--border-thin) solid;
      color: var(--color-dark);
      background-color: var(--color-light);
      padding: var(--s1);
    }

    :host ::slotted(*) {
      color: inherit;
    }

    :host.invert {
      /* ↓ Dark becomes light, and light becomes dark */
      color: var(--color-light);
      background-color: var(--color-dark);
    }
  `

  constructor() {
    super()
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

customElements.define('film-box', Box)
