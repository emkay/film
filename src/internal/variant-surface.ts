export type StatusVariant = 'accent' | 'success' | 'warning' | 'danger'

const STATUS: Record<StatusVariant, string> = {
  accent: 'var(--film-color-info)',
  success: 'var(--film-color-success)',
  warning: 'var(--film-color-warning)',
  danger: 'var(--film-color-danger)'
}

/**
 * Resolve a status-variant name to its surface token, falling back to the
 * component's own default surface (e.g. `neutral` / `info`).
 */
export function variantSurface (variant: string, fallback: string): string {
  return STATUS[variant as StatusVariant] ?? fallback
}
