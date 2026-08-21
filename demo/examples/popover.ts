import { html, type TemplateResult } from 'lit'

export const popoverExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-popover">Popover</h3>
    <film-cluster>
      <film-popover>
        <film-button slot="trigger">Click me</film-button>
        <film-stack space="var(--s-1)">
          <strong>Popover</strong>
          <span>Anchored content, dismissed on outside click or Escape.</span>
        </film-stack>
      </film-popover>

      <film-popover trigger="hover" placement="top">
        <film-button slot="trigger">Hover me</film-button>
        <span>Shown while hovering.</span>
      </film-popover>
    </film-cluster>
  </film-box>
`
