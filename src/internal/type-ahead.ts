/**
 * Type-ahead for lists of items (menus, listboxes, trees), per the ARIA
 * Authoring Practices: typing a character moves to the next item whose label
 * starts with it; characters typed in quick succession build a prefix; and
 * repeating one character cycles through the items that start with it.
 */
export class TypeAhead {
  private buffer = ''
  private lastKeyAt = 0

  constructor (private readonly timeout = 500) {}

  /**
   * The index to move to for this key, or -1 to leave focus where it is. Only
   * printable characters count, and never with a modifier held — those are
   * shortcuts. Space counts only mid-word, since it activates items otherwise.
   */
  find (event: KeyboardEvent, labels: string[], current: number): number {
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return -1
    const now = event.timeStamp || Date.now()
    if (now - this.lastKeyAt > this.timeout) this.buffer = ''
    if (event.key === ' ' && this.buffer === '') return -1
    this.lastKeyAt = now
    this.buffer += event.key.toLowerCase()

    const repeating = [...this.buffer].every((c) => c === this.buffer[0])
    const needle = repeating ? this.buffer[0] : this.buffer
    // A new or repeated letter looks past the current item; a longer prefix
    // may still match it.
    const start = repeating ? current + 1 : Math.max(current, 0)
    for (let i = 0; i < labels.length; i++) {
      const index = (start + i) % labels.length
      if (labels[index].trim().toLowerCase().startsWith(needle)) return index
    }
    return -1
  }
}
