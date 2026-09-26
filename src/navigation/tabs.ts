import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { ownDescendants, ownTarget } from '../internal/dom.js'
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

  // Only this component's own tabs and panels — a film-tabs nested in a panel
  // manages its own.
  private get tabs (): Tab[] {
    return ownDescendants<Tab>(this, 'film-tab')
  }

  private get panels (): TabPanel[] {
    return ownDescendants<TabPanel>(this, 'film-tab-panel')
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', this.onKeydown)
  }

  firstUpdated (): void {
    if (!this.active) this.active = this.tabs[0]?.panel ?? ''
  }

  updated (changed: PropertyValues<this>): void {
    super.updated(changed)
    // However `active` was set — a click, the keyboard, code or a parent
    // re-render — the tabs and panels follow it.
    if (changed.has('active')) this.sync()
  }

  private readonly onClick = (event: MouseEvent): void => {
    const tab = ownTarget<Tab>(this, event, 'film-tab')
    if (tab && !tab.disabled) this.activate(tab.panel, tab)
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(event.key)) return
    // Arrow keys inside a panel belong to its content (a text field's cursor).
    if (!ownTarget(this, event, 'film-tab')) return
    const enabled = this.tabs.filter((tab) => !tab.disabled)
    if (enabled.length === 0) return
    event.preventDefault()

    const current = enabled.findIndex((tab) => tab.panel === this.active)
    let index: number
    if (event.key === 'ArrowRight') index = (current + 1) % enabled.length
    else if (event.key === 'ArrowLeft') index = (current - 1 + enabled.length) % enabled.length
    else if (event.key === 'Home') index = 0
    else index = enabled.length - 1

    const tab = enabled[index]
    if (tab) this.activate(tab.panel, tab)
  }

  private activate (name: string, focus?: Tab): void {
    this.active = name
    // Sync now rather than in updated(), so the tab is focusable before focus().
    this.sync()
    focus?.focus()
    this.dispatchEvent(new CustomEvent('film-tab-change', { detail: { name }, bubbles: true }))
  }

  private static counter = 0
  private readonly idPrefix = `film-tabs-${(Tabs.counter += 1)}`

  private sync (): void {
    this.link()
    this.tabs.forEach((tab) => {
      tab.active = tab.panel === this.active
      tab.tabIndex = tab.active && !tab.disabled ? 0 : -1
    })
    this.panels.forEach((panel) => {
      panel.active = panel.name === this.active
    })
  }

  /**
   * Tie each tab to its panel: the tab controls the panel, and the panel is
   * named by the tab. Both are this element's light-DOM children, so plain IDs
   * work; missing ones are generated, and the consumer's are kept.
   */
  private link (): void {
    const panels = this.panels
    for (const tab of this.tabs) {
      const panel = panels.find((p) => p.name === tab.panel)
      if (!panel) continue
      tab.id ||= `${this.idPrefix}-tab-${tab.panel}`
      panel.id ||= `${this.idPrefix}-panel-${panel.name}`
      tab.setAttribute('aria-controls', panel.id)
      panel.setAttribute('aria-labelledby', tab.id)
    }
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
