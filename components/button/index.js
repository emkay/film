import { LitElement, css, html } from 'lit'

export default class Button extends LitElement {
  static properties = {
    invert: { type: Boolean },
    disabled: { type: Boolean }
  }

  static styles = css`
    :host button {
      background-color: var(--button-primary-color);
      border-radius: 7px;
      color: var(--font-color-primary);
      cursor: pointer;
      font-size: var(--s0);
      padding: 0.5em 1.5em 0.7em;
    }

    :host button:focus {
      outline: solid;
      background-color: var(--button-primary-color-focus);
    }

    :host button.invert:focus{
      background-color: var(--button-primary-color-focus-invert);
    }

    :host button:hover {
      outline: solid;
      background-color: var(--button-primary-color-hover);
    }

    :host button:active {
      background-color: var(--button-primary-color-active);
    }

    :host button.invert {
      background-color: var(--button-primary-color-invert);
      color: var(--button-primary-color-text-invert);
    }

    :host button.invert:hover {
      background-color: var(--button-primary-color-hover-invert);
    }
`

  constructor () {
    super()
    this.invert = false
    this.disabled = false
  }

  disabledButton(classes) {
    return html`<button class=${classes} disabled="true"><slot></slot></button>`
  }

  regularButton(classes) {
    return html`<button class=${classes}><slot></slot></button>`
  }

  render () {
    const classes = this.invert ? 'invert' : ''
    const button = this.disabled ? this.disabledButton(classes) : this.regularButton(classes)
    return button
  }
}

customElements.define('film-button', Button)
