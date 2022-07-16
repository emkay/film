import {LitElement, css, html} from 'lit'

export class App extends LitElement {
  static properties = {
  }

  static styles = css`
    :host {
      font-size: 32px;
      font-family: sans-serif;
    }
  `
  constructor() {
    super()
  }

  render() {
    return html`
      <section>
        <h1>Hello World!</h1>
      </section>
    `
  }
}

customElements.define('my-app', App)
