import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/** Which pane(s) get their own scrollbar when the Sidebar has a bounded height. */
export type SidebarScroll = 'none' | 'start' | 'end' | 'both'

/**
 * Sidebar — a two-element layout where one element (the sidebar) keeps its
 * content-based width while the other (the main content) takes up the rest,
 * collapsing to a stack when there isn't room for both.
 *
 * Set `scroll` to give a pane its own scrollbar. Scrolling only happens when the
 * Sidebar itself has a bounded height (e.g. the consumer sets `height: 100dvh`);
 * when the panes wrap to a stack, they return to normal document flow.
 *
 * @slot - Exactly two children: the sidebar and the main content.
 */
@customElement('film-sidebar')
export class Sidebar extends FilmElement {
  /** The gap between the sidebar and the main content. */
  @property({ type: String })
  space = 'var(--s3)'

  /** The minimum width of the main content before the layout wraps. */
  @property({ type: String, attribute: 'content-min' })
  contentMin = '50%'

  /**
   * Which pane(s) scroll independently: the `start` pane, the `end` pane, or
   * `both`. Exposed as the `scroll` attribute (`scroll="both"`); the property is
   * named `scrollPane` because `scroll` is a reserved DOM method.
   */
  @property({ type: String, attribute: 'scroll', reflect: true })
  scrollPane: SidebarScroll = 'none'

  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sidebar-space, var(--s3));
    }

    ::slotted(:first-child) {
      flex-grow: 1;
    }

    ::slotted(:last-child) {
      flex-basis: 0;
      flex-grow: 999;
      min-inline-size: var(--sidebar-content-min, 50%);
    }

    /* Independently scrollable panes. min-block-size: 0 lets a flex item shrink
       below its content so overflow can take effect; the pane fills the (bounded)
       host height via the default align-items: stretch. */
    :host([scroll='start']) ::slotted(:first-child),
    :host([scroll='both']) ::slotted(:first-child),
    :host([scroll='end']) ::slotted(:last-child),
    :host([scroll='both']) ::slotted(:last-child) {
      overflow: auto;
      min-block-size: 0;
      max-block-size: 100%;
    }
  `

  static styleProps: Record<string, string> = {
    '--sidebar-space': 'space',
    '--sidebar-content-min': 'contentMin'
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-sidebar': Sidebar
  }
}
