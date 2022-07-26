import { LitElement, css, html } from 'lit'

export default class Link extends LitElement {
  static properties = {
    href: {
      type: String
    }
  }

  static styles = css`
    :host a {
      color: var(--color-links);
      text-decoration: none;
    }

    :host a:hover {
      text-decoration: underline;
    }
`

  constructor () {
    super()
    this.href = ''
  }

  render () {
    return html`
      <a href="${this.href}"><slot></slot></a>
    `
  }
}

customElements.define('film-link', Link)
