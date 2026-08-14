export type Placement = 'top' | 'bottom' | 'left' | 'right'
export type Align = 'start' | 'center' | 'end'

export interface AnchorOptions {
  placement?: Placement
  align?: Align
  /** Gap between the reference and the floating element, in pixels. */
  gap?: number
}

/**
 * Position a floating element next to a reference element. Intended for
 * elements promoted to the top layer via the Popover API (which use fixed,
 * viewport-relative coordinates). Flips to the opposite side when there isn't
 * room, and clamps within the viewport.
 *
 * Returns a cleanup function that removes the scroll/resize listeners.
 */
export function anchorPosition (
  reference: HTMLElement,
  floating: HTMLElement,
  options: AnchorOptions = {}
): () => void {
  const { placement = 'bottom', align = 'start', gap = 8 } = options

  const update = (): void => {
    const r = reference.getBoundingClientRect()
    const f = floating.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    let place = placement
    if (place === 'bottom' && vh - r.bottom < f.height + gap && r.top > vh - r.bottom) {
      place = 'top'
    } else if (place === 'top' && r.top < f.height + gap && vh - r.bottom > r.top) {
      place = 'bottom'
    }

    let top: number
    let left: number

    if (place === 'top') {
      top = r.top - f.height - gap
    } else if (place === 'bottom') {
      top = r.bottom + gap
    } else {
      top = r.top
    }

    if (place === 'left') {
      left = r.left - f.width - gap
    } else if (place === 'right') {
      left = r.right + gap
    } else if (align === 'center') {
      left = r.left + (r.width - f.width) / 2
    } else if (align === 'end') {
      left = r.right - f.width
    } else {
      left = r.left
    }

    left = Math.max(gap, Math.min(left, vw - f.width - gap))
    top = Math.max(gap, Math.min(top, vh - f.height - gap))

    floating.style.position = 'fixed'
    floating.style.margin = '0'
    floating.style.top = `${Math.round(top)}px`
    floating.style.left = `${Math.round(left)}px`
  }

  update()
  window.addEventListener('scroll', update, true)
  window.addEventListener('resize', update)

  return () => {
    window.removeEventListener('scroll', update, true)
    window.removeEventListener('resize', update)
  }
}
