import { html, type TemplateResult } from 'lit'

export const buttonGroupExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-button-group">Button Group</h3>
    <film-stack space="var(--s0)">
      <film-button-group label="Actions">
        <film-button>Save</film-button>
        <film-button>Duplicate</film-button>
        <film-button>Delete</film-button>
      </film-button-group>

      <film-button-group attached label="Alignment">
        <film-button>Left</film-button>
        <film-button>Center</film-button>
        <film-button>Right</film-button>
      </film-button-group>
    </film-stack>
  </film-box>
`
