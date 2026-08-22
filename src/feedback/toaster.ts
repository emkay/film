import './toast.js'
import type { Toast } from './toast.js'
import type { AlertVariant } from './alert.js'

export interface ToastOptions {
  /** The colour treatment. */
  variant?: AlertVariant
  /** Auto-dismiss delay in ms (0 = stay until dismissed). */
  duration?: number
}

let container: HTMLElement | undefined

function ensureContainer (): HTMLElement {
  if (container?.isConnected) return container
  const region = document.createElement('div')
  region.className = 'film-toaster'
  region.setAttribute('role', 'region')
  region.setAttribute('aria-label', 'Notifications')
  region.setAttribute('aria-live', 'polite')
  Object.assign(region.style, {
    position: 'fixed',
    insetBlockEnd: '1rem',
    insetInlineEnd: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    pointerEvents: 'none'
  })
  // Uses the theme token when present, with a sensible fallback.
  region.style.setProperty('z-index', 'var(--film-z-toast, 1100)')
  document.body.appendChild(region)
  container = region
  return region
}

/**
 * Show a toast notification. Lazily creates a single fixed-position live region
 * appended to `document.body` and stacks toasts within it. Returns the created
 * `film-toast` element.
 */
export function toast (message: string, options: ToastOptions = {}): Toast {
  const region = ensureContainer()
  const element = document.createElement('film-toast')
  element.variant = options.variant ?? 'info'
  element.duration = options.duration ?? 4000
  element.textContent = message
  element.style.pointerEvents = 'auto'
  element.addEventListener('film-close', () => element.remove())
  region.appendChild(element)
  requestAnimationFrame(() => element.show())
  return element
}
