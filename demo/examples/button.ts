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
      <h4>Variants</h4>
      <film-cluster>
        <film-button variant="primary">Primary</film-button>
        <film-button variant="neutral">Neutral</film-button>
        <film-button variant="accent">Accent</film-button>
        <film-button variant="success">Success</film-button>
        <film-button variant="warning">Warning</film-button>
        <film-button variant="danger">Danger</film-button>
      </film-cluster>
      <h4>In a native form</h4>
      <p>
        The button is form-associated, so <code>type="submit"</code> submits the
        surrounding <code>&lt;form&gt;</code> even though its real button lives in
        the shadow root. Enter inside the input does the same.
      </p>
      <form
        @submit=${(event: Event) => {
          event.preventDefault()
          const form = event.target as HTMLFormElement
          const output = form.querySelector('output') as HTMLOutputElement
          output.textContent = `submitted: ${String(new FormData(form).get('who') ?? '')}`
        }}
      >
        <film-cluster>
          <film-input name="who" label="Name" autocomplete="username"></film-input>
          <film-button type="submit">Submit</film-button>
          <film-button type="reset" variant="neutral">Reset</film-button>
          <output></output>
        </film-cluster>
      </form>
    </film-stack>
  </film-box>
`
