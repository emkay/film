import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { anchorPosition, type AnchorOptions } from './anchor-position.js'

export interface PopoverConfig {
  /** The element the panel is positioned against. */
  anchor: () => HTMLElement | null | undefined
  /** The `popover` element to show and position. */
  panel: () => HTMLElement | null | undefined
  /** Placement options, read on each open so they can follow properties. */
  options?: () => AnchorOptions
}

/**
 * PopoverController — the shared lifecycle for a top-layer panel anchored to
 * another element (select, combobox, date picker, dropdown, popover, tooltip):
 * show it via the Popover API, keep it positioned with {@link anchorPosition},
 * and tear the scroll/resize listeners down on close or disconnect.
 *
 * Opening twice is harmless — the previous positioning is released first — so
 * a redundant open can't strand a pair of window listeners.
 */
export class PopoverController implements ReactiveController {
  private readonly config: PopoverConfig
  private release?: () => void

  constructor (host: ReactiveControllerHost, config: PopoverConfig) {
    host.addController(this)
    this.config = config
  }

  hostDisconnected (): void {
    this.unposition()
  }

  /** Whether the panel is currently shown. */
  get isOpen (): boolean {
    return this.config.panel()?.matches(':popover-open') ?? false
  }

  /** Show and position the panel. Returns false if it isn't rendered yet. */
  show (): boolean {
    const anchor = this.config.anchor()
    const panel = this.config.panel()
    if (!anchor || !panel) return false
    this.unposition()
    if (!panel.matches(':popover-open')) panel.showPopover()
    this.release = anchorPosition(anchor, panel, this.config.options?.())
    return true
  }

  /** Hide the panel and stop positioning it. */
  hide (): void {
    this.unposition()
    const panel = this.config.panel()
    if (panel?.matches(':popover-open')) panel.hidePopover()
  }

  private unposition (): void {
    this.release?.()
    this.release = undefined
  }
}
