import { LitElement, css, html } from 'lit'

export default class Center extends LitElement {
  static properties = {
  }

  static styles = css`
    :host {
      box-sizing: content-box;
      margin-inline: auto;
      max-inline-size: var(--measure);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `

  constructor () {
    super()
  }

  render () {
    return html`
      <slot></slot>
    `
  }
}

customElements.define('film-center', Center)
