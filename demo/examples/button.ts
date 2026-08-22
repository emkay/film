import { html, type TemplateResult } from 'lit'

export const buttonExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-button">Button</h3>
    <film-stack>
      <h4>Default</h4>
      <film-cluster>
        <film-button>Default Button</film-button>
        <film-button invert>Invert Button</film-button>
        <film-button disabled>Disabled Button</film-button>
      </film-cluster>
      <h4>Sizes</h4>
      <film-cluster>
        <film-button size="small">Small</film-button>
        <film-button size="medium">Medium</film-button>
        <film-button size="large">Large</film-button>
      </film-cluster>
    </film-stack>
  </film-box>
`
