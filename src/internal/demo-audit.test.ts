import { expect } from '@open-wc/testing'
import { render, type TemplateResult } from 'lit'
import '../index.js'
import * as examples from '../../demo/examples/index.js'

// The demo exercises every component in realistic markup, so it doubles as the
// false-positive check for Film's attribute warnings: a warning here is either
// an over-eager rule or a genuine mistake in the demo.
const warningsByExample: string[] = []

describe('demo examples', () => {
  it('render without any Film attribute warnings', async () => {
    const warnings: string[] = []
    const originalWarn = console.warn
    console.warn = (...args: unknown[]) => { warnings.push(args.map(String).join(' ')) }
    const container = document.createElement('div')
    document.body.append(container)
    try {
      for (const [name, example] of Object.entries(examples)) {
        if (typeof example !== 'function') continue
        render((example as () => TemplateResult)(), container)
        await new Promise((resolve) => setTimeout(resolve, 0))
        for (const warning of warnings.splice(0)) warningsByExample.push(`${name}: ${warning}`)
      }
    } finally {
      console.warn = originalWarn
      render(null, container)
      container.remove()
    }
    // Lit's own dev-mode notices (lit.dev/msg/…) are a separate concern.
    const film = warningsByExample.filter((w) => !w.includes('lit.dev/msg'))
    expect(film).to.deep.equal([])
  })
})
