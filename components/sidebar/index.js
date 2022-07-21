import {LitElement, css, html} from 'lit'

export default class Sidebar extends LitElement {
  static properties = {
  }

  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: var(--s5);
    }

    :host > ::slotted(:first-child) {
      flex-grow: 1;
    }

    :host > ::slotted(:last-child) {
      flex-basis: 0;
      flex-grow: 999;
      min-inline-size: 50%;
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

customElements.define('film-sidebar', Sidebar)
