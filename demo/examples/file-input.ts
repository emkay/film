import { html, type TemplateResult } from 'lit'

export const fileInputExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-file-input">File Input</h3>
    <film-field label="Attachments" hint="Drag files in, or click to browse.">
      <film-file-input name="files" multiple></film-file-input>
    </film-field>
  </film-box>
`
