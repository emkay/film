import {LitElement, css, html} from 'lit'

export default class Button extends LitElement {
  static properties = {
    invert: {type: Boolean}
  }

  static styles = css`
    :host button {
      background-color: var(--color-dark);
      border-radius: var(--s1);
      border-width: var(--border-thin);
      box-shadow: 0.1em -0.1em 0.1em 0em #969696;
      color: var(--color-light);
      cursor: pointer;
      font-size: var(--s0);
      padding: 0.5em 1.5em 0.7em;
    }

    :host button.invert {
      background-color: var(--color-light);
      color: var(--color-dark);
    }
`

  constructor() {
    super()
    this.invert = false
  }

  render() {
    const classes = this.invert ? `invert` : ``
    return html`
      <button class=${classes}><slot></slot></button>
    `
  }
}

customElements.define('film-button', Button)
