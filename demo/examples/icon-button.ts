import { html, type TemplateResult } from 'lit'

const gear = html`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4a7 7 0 00-.1-1.1l2-1.6-2-3.4-2.4 1a7 7 0 00-1.9-1.1L15.4 2h-4l-.3 2.7a7 7 0 00-1.9 1.1l-2.4-1-2 3.4 2 1.6A7 7 0 003 12c0 .4 0 .7.1 1.1l-2 1.6 2 3.4 2.4-1c.6.5 1.2.8 1.9 1.1l.3 2.7h4l.3-2.7c.7-.3 1.3-.6 1.9-1.1l2.4 1 2-3.4-2-1.6c.1-.4.1-.7.1-1.1z" />
  </svg>
`

const trash = html`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 7h12l-1 14H7L6 7zm3-3h6l1 2H8l1-2z" />
  </svg>
`

export const iconButtonExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-icon-button">Icon Button</h3>
    <film-cluster>
      <film-icon-button label="Settings">${gear}</film-icon-button>
      <film-icon-button label="Delete">${trash}</film-icon-button>
      <film-icon-button label="Settings" disabled>${gear}</film-icon-button>
    </film-cluster>
  </film-box>
`
