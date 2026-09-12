import { expect } from '@open-wc/testing'
import { resolveScale } from './scale.js'

describe('resolveScale', () => {
  it('wraps a bare scale step', () => {
    expect(resolveScale('s0')).to.equal('var(--s0)')
    expect(resolveScale('s3')).to.equal('var(--s3)')
    expect(resolveScale('s-2')).to.equal('var(--s-2)')
  })

  it('leaves anything else alone', () => {
    for (const value of ['var(--s1)', '1rem', '0', 'auto', '0.5em', 'clamp(1px, 2vw, 3px)', '']) {
      expect(resolveScale(value)).to.equal(value)
    }
  })

  it('does not mistake a length for a step', () => {
    expect(resolveScale('3s')).to.equal('3s')
    expect(resolveScale('span 2')).to.equal('span 2')
  })
})
