import { html } from 'lit'

export default () => {
  return html`
  <film-box>
    <h3 id="film-components-button">Button</h3>
    <h4>Types</h4>
    <h5>Primary</h5>
    <film-button type="primary">Primary Button</film-button>
    <h5>Secondary</h5>
    <film-button type="secondary">Secondary Button</film-button>
    <h5>Icon</h5>
    <film-button type="icon">Icon Button</film-button>
    <h5>Fab</h5>
    <film-button type="fab">Fab Button</film-button>
    <h4>States</h4>
    <h5>Default</h5>
    <film-button>Default Button</film-button>
    <h5>Inverted</h5>
    <film-button ?invert=${true}>Invert Button</film-button>
    <h5>Disabled</h5>
    <film-button ?disabled=${true}>Disabled Button</film-button>
    <h5>Loading</h5>
    <film-button loading=${true}>Loading...</film-button>
  </film-box>`
}
