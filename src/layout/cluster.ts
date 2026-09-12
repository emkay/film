import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

export type ClusterJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'

export type ClusterAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch'

/**
 * Cluster — lays children out in a row that wraps, with even gaps in both axes.
 * Good for button groups, tag lists, navigation, and other "bag of things".
 *
 * @slot - The items to cluster.
 */
@customElement('film-cluster')
export class Cluster extends FilmElement {
  /** The gap between clustered items. A scale step (`s1`) or any CSS length. */
  @property({ type: String })
  space = 'var(--s0)'

  /** How items are distributed along the row. */
  @property({ type: String })
  justify: ClusterJustify = 'start'

  /** How items are aligned across the row. */
  @property({ type: String })
  align: ClusterAlign = 'center'

  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: var(--cluster-space, var(--s0));
      justify-content: var(--cluster-justify, flex-start);
      align-items: var(--cluster-align, center);
    }
  `

  static styleProps: Record<string, string> = {
    '--cluster-space': 'space',
    '--cluster-justify': 'justify',
    '--cluster-align': 'align'
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-cluster': Cluster
  }
}
