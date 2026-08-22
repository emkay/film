import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function parseISO (value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(date.getTime()) ? null : date
}

function formatISO (date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function sameDay (a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function sameMonth (a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function addDays (date: Date, n: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + n)
  return next
}

function addMonths (date: Date, n: number): Date {
  const next = new Date(date)
  next.setDate(1)
  next.setMonth(next.getMonth() + n)
  return next
}

function startOfDay (date: Date): Date {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

/**
 * Calendar — a month grid for choosing a date. Keyboard: arrows move by day,
 * Home/End jump to the week edges, PageUp/PageDown change month, Enter selects.
 *
 * @fires film-change - When a date is chosen. `detail.value` is `YYYY-MM-DD`.
 */
@customElement('film-calendar')
export class Calendar extends FilmElement {
  /** The selected date, as `YYYY-MM-DD`. */
  @property({ type: String }) value = ''

  /** Earliest selectable date, as `YYYY-MM-DD`. */
  @property({ type: String }) min = ''

  /** Latest selectable date, as `YYYY-MM-DD`. */
  @property({ type: String }) max = ''

  @state() private cursor: Date = new Date()

  private pendingFocus = false

  static styles = css`
    :host {
      display: inline-block;
      padding: var(--s-1);
      color: var(--film-color-text);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--s-2) var(--s-2);
    }

    .month {
      font-weight: 600;
    }

    .nav {
      border: none;
      background: none;
      color: inherit;
      cursor: pointer;
      padding: var(--s-3) var(--s-2);
      border-radius: var(--film-radius-sm);
    }

    .nav:hover {
      background-color: var(--film-color-info);
    }

    .weekdays,
    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }

    .weekday {
      text-align: center;
      font-size: var(--s-1);
      color: var(--film-color-text-muted);
      padding-block: var(--s-3);
    }

    .day {
      border: none;
      background: none;
      color: inherit;
      cursor: pointer;
      aspect-ratio: 1;
      border-radius: var(--film-radius-sm);
    }

    .day:hover:not([disabled]) {
      background-color: var(--film-color-info);
    }

    .day.outside {
      opacity: 0.4;
    }

    .day.today {
      outline: var(--border-thin) solid var(--film-color-border);
    }

    .day.selected {
      background-color: var(--film-color-inverted-surface);
      color: var(--film-color-inverted-text);
    }

    .day[disabled] {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }

    .day:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
    }
  `

  /** The currently selected date, if valid. */
  get selectedDate (): Date | null {
    return parseISO(this.value)
  }

  connectedCallback (): void {
    super.connectedCallback()
    const selected = this.selectedDate
    if (selected) this.cursor = selected
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('value')) {
      const selected = this.selectedDate
      if (selected && !sameMonth(selected, this.cursor)) this.cursor = selected
    }
    if (this.pendingFocus) {
      this.pendingFocus = false
      ;(this.shadowRoot?.querySelector('.day.focused') as HTMLElement | null)?.focus()
    }
  }

  private isDisabled (date: Date): boolean {
    const lo = parseISO(this.min)
    const hi = parseISO(this.max)
    if (lo && startOfDay(date) < startOfDay(lo)) return true
    if (hi && startOfDay(date) > startOfDay(hi)) return true
    return false
  }

  private moveCursor (days: number): void {
    this.cursor = addDays(this.cursor, days)
    this.pendingFocus = true
  }

  private moveMonth (months: number): void {
    this.cursor = addMonths(this.cursor, months)
  }

  private selectDate (date: Date): void {
    if (this.isDisabled(date)) return
    this.value = formatISO(date)
    this.cursor = date
    this.dispatchEvent(new CustomEvent('film-change', { detail: { value: this.value }, bubbles: true }))
  }

  private readonly onGridKeydown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case 'ArrowLeft': event.preventDefault(); this.moveCursor(-1); break
      case 'ArrowRight': event.preventDefault(); this.moveCursor(1); break
      case 'ArrowUp': event.preventDefault(); this.moveCursor(-7); break
      case 'ArrowDown': event.preventDefault(); this.moveCursor(7); break
      case 'Home': event.preventDefault(); this.moveCursor(-this.cursor.getDay()); break
      case 'End': event.preventDefault(); this.moveCursor(6 - this.cursor.getDay()); break
      case 'PageUp': event.preventDefault(); this.moveMonth(-1); this.pendingFocus = true; break
      case 'PageDown': event.preventDefault(); this.moveMonth(1); this.pendingFocus = true; break
      case 'Enter':
      case ' ': event.preventDefault(); this.selectDate(this.cursor); break
    }
  }

  private get grid (): Date[] {
    const first = new Date(this.cursor.getFullYear(), this.cursor.getMonth(), 1)
    const start = addDays(first, -first.getDay())
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
  }

  render () {
    const today = new Date()
    const selected = this.selectedDate
    return html`
      <div class="header">
        <button class="nav" @click=${() => this.moveMonth(-1)} aria-label="Previous month">‹</button>
        <span class="month" aria-live="polite">${MONTHS[this.cursor.getMonth()]} ${this.cursor.getFullYear()}</span>
        <button class="nav" @click=${() => this.moveMonth(1)} aria-label="Next month">›</button>
      </div>
      <div class="grid" role="grid" @keydown=${this.onGridKeydown}>
        <div class="weekdays" role="row">
          ${WEEKDAYS.map((w) => html`<span class="weekday" role="columnheader">${w}</span>`)}
        </div>
        <div class="days">
          ${this.grid.map((date) => {
            const outside = date.getMonth() !== this.cursor.getMonth()
            const focused = sameDay(date, this.cursor)
            const isSelected = selected ? sameDay(date, selected) : false
            const isToday = sameDay(date, today)
            const classes = [
              'day',
              outside ? 'outside' : '',
              focused ? 'focused' : '',
              isSelected ? 'selected' : '',
              isToday ? 'today' : ''
            ]
              .filter(Boolean)
              .join(' ')
            return html`<button
              class=${classes}
              role="gridcell"
              tabindex=${focused ? '0' : '-1'}
              aria-selected=${isSelected ? 'true' : 'false'}
              aria-current=${isToday ? 'date' : nothing}
              aria-label=${formatISO(date)}
              ?disabled=${this.isDisabled(date)}
              @click=${() => this.selectDate(date)}
            >${date.getDate()}</button>`
          })}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-calendar': Calendar
  }
}
