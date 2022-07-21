import {LitElement, css, html} from 'lit'

export default class Cluster extends LitElement {
  static properties = {
  }

  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space, 1rem);
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

customElements.define('film-cluster', Cluster)
