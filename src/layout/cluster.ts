import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Cluster — lays children out in a row that wraps, with even gaps in both axes.
 * Good for button groups, tag lists, navigation, and other "bag of things".
 *
 * @slot - The items to cluster.
 */
@customElement('film-cluster')
export class Cluster extends FilmElement {
  /** The gap between clustered items. Defaults to a modular-scale step. */
  @property({ type: String })
  space = 'var(--s0)'

  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: var(--cluster-space, var(--s0));
      align-items: center;
    }
  `

  static styleProps: Record<string, string> = { '--cluster-space': 'space' }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-cluster': Cluster
  }
}
