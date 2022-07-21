import {LitElement, css, html} from 'lit'

export default class Stack extends LitElement {
  // TODO: figure out if this is the API we want to support and how to do it. We have some limitations because of the
  // shadow DOM.
  static properties = {
    space: {type: String},
    recursive: {type: Boolean},
    splitAfter: {type: Number}
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
  `

  constructor() {
    super()
    this.space = `var(--s1)`
    this.recursive = false
    this.splitAfter = null
  }

  render() {
    console.debug(this.space, this.recursive, this.splitAfter)
    return html`<slot></slot>`
  }
}

customElements.define('film-stack', Stack)
