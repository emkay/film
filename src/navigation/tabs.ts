import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import type { Tab } from './tab.js'
import type { TabPanel } from './tab-panel.js'

/**
 * Tabs — a tabbed interface. Place `film-tab` elements in the `nav` slot and
 * matching `film-tab-panel` elements in the default slot, linked by
 * `panel`/`name`. Supports arrow-key navigation.
 *
 * @slot nav - The `film-tab` elements.
 * @slot - The `film-tab-panel` elements.
 * @fires film-tab-change - When the active tab changes. `detail.name` is the active panel.
 */
@customElement('film-tabs')
export class Tabs extends FilmElement {
  /** The `name` of the active panel. */
  @property({ type: String }) active = ''

  static styles = css`
    :host {
      display: block;
    }

    .tablist {
      display: flex;
      flex-wrap: wrap;
      gap: var(--s-1);
      border-block-end: var(--border-thin) solid var(--film-color-border);
    }
  `

  private get tabs (): Tab[] {
    return Array.from(this.querySelectorAll('film-tab'))
  }

  private get panels (): TabPanel[] {
    return Array.from(this.querySelectorAll('film-tab-panel'))
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', this.onKeydown)
  }

  firstUpdated (): void {
    if (!this.active) this.active = this.tabs[0]?.panel ?? ''
    this.sync()
  }

  private readonly onClick = (event: MouseEvent): void => {
    const tab = (event.target as Element).closest('film-tab') as Tab | null
    if (tab && !tab.disabled) this.activate(tab.panel, tab)
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(event.key)) return
    const enabled = this.tabs.filter((tab) => !tab.disabled)
    if (enabled.length === 0) return
    event.preventDefault()

    const current = enabled.findIndex((tab) => tab.panel === this.active)
    let index = current
    if (event.key === 'ArrowRight') index = (current + 1) % enabled.length
    else if (event.key === 'ArrowLeft') index = (current - 1 + enabled.length) % enabled.length
    else if (event.key === 'Home') index = 0
    else index = enabled.length - 1

    const tab = enabled[index]
    if (tab) this.activate(tab.panel, tab)
  }

  private activate (name: string, focus?: Tab): void {
    this.active = name
    this.sync()
    focus?.focus()
    this.dispatchEvent(new CustomEvent('film-tab-change', { detail: { name }, bubbles: true }))
  }

  private sync (): void {
    this.tabs.forEach((tab) => {
      tab.active = tab.panel === this.active
      tab.tabIndex = tab.active && !tab.disabled ? 0 : -1
    })
    this.panels.forEach((panel) => {
      panel.active = panel.name === this.active
    })
  }

  render () {
    return html`
      <div class="tablist" role="tablist">
        <slot name="nav" @slotchange=${this.sync}></slot>
      </div>
      <slot @slotchange=${this.sync}></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-tabs': Tabs
  }
}
