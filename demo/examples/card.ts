import { html, type TemplateResult } from 'lit'

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23052528'/%3E%3Ccircle cx='200' cy='100' r='70' fill='%23D7FAEB'/%3E%3C/svg%3E"

export const cardExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-card">Card</h3>
    <film-grid min="16rem">
      <film-card>
        <img slot="media" src=${placeholder} alt="" />
        <film-stack space="var(--s0)">
          <h4>Card with media</h4>
          <p>A card composes a media region, a body, and a footer.</p>
        </film-stack>
        <film-cluster slot="footer">
          <film-button>Action</film-button>
          <film-badge variant="accent">New</film-badge>
        </film-cluster>
      </film-card>

      <film-card>
        <film-stack space="var(--s0)">
          <h4>Body only</h4>
          <p>The media and footer regions collapse when empty.</p>
        </film-stack>
      </film-card>
    </film-grid>
  </film-box>
`
