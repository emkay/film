import { html, type TemplateResult } from 'lit'

export const textareaExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-textarea">Textarea</h3>
    <film-stack space="var(--s0)">
      <film-textarea label="Message" placeholder="Write something…" rows="4"></film-textarea>
      <film-textarea label="Auto-growing" auto-grow placeholder="This grows as you type…"></film-textarea>
    </film-stack>
  </film-box>
`
