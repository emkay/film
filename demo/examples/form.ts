import { html, type TemplateResult } from 'lit'
import { toast } from '../../src/index.js'

interface SubmitDetail {
  values: Record<string, unknown>
}

const onSubmit = (event: Event): void => {
  const { values } = (event as CustomEvent<SubmitDetail>).detail
  toast(`Signed up as ${String(values.email)}`, { variant: 'success' })
}

const onInvalid = (): void => {
  toast('Please fix the highlighted fields.', { variant: 'danger' })
}

export const formExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-form">Form</h3>
    <p>Submit with empty required fields to see validation + a toast.</p>
    <film-form @film-submit=${onSubmit} @film-invalid=${onInvalid}>
      <film-stack space="var(--s0)">
        <film-field label="Email" hint="Required.">
          <film-input type="email" name="email" required></film-input>
        </film-field>
        <film-field label="Password">
          <film-input type="password" name="password" required></film-input>
        </film-field>
        <film-cluster>
          <film-button data-film-submit>Sign up</film-button>
          <film-button data-film-reset>Reset</film-button>
        </film-cluster>
      </film-stack>
    </film-form>
  </film-box>
`
