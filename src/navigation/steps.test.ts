import { fixture, html, expect } from '@open-wc/testing'
import './steps.js'
import './step.js'
import type { Steps } from './steps.js'
import type { Step } from './step.js'

describe('film-steps', () => {
  it('marks steps complete / active / upcoming from `current`', async () => {
    const el = await fixture<Steps>(html`
      <film-steps current="1">
        <film-step label="A"></film-step>
        <film-step label="B"></film-step>
        <film-step label="C"></film-step>
      </film-steps>
    `)
    await el.updateComplete
    const steps = Array.from(el.querySelectorAll('film-step')) as Step[]
    expect(steps[0].state).to.equal('complete')
    expect(steps[1].state).to.equal('active')
    expect(steps[2].state).to.equal('upcoming')
    expect(steps[1].getAttribute('aria-current')).to.equal('step')
  })
})
