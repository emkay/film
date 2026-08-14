import { html, type TemplateResult } from 'lit'

const star = html`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path
      d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"
    />
  </svg>
`

export const iconExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-icon">Icon</h3>
    <p>An icon scales with the text beside it and stays aligned.</p>
    <film-stack>
      <p><film-icon>${star}</film-icon> inline with text</p>
      <h4><film-icon>${star}</film-icon> and with a heading</h4>
      <film-icon label="Favourite">${star}</film-icon>
    </film-stack>
  </film-box>
`
