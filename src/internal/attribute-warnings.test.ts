import { fixture, html, expect } from '@open-wc/testing'
import '../actions/button.js'
import '../layout/cluster.js'
import '../layout/sidebar.js'
import '../typography/text.js'
import '../typography/heading.js'
import { setFilmWarnings } from '../index.js'

// Captures console.warn for the duration of each test.
let warnings: string[] = []
const originalWarn = console.warn
beforeEach(() => {
  warnings = []
  console.warn = (...args: unknown[]) => { warnings.push(args.map(String).join(' ')) }
})
afterEach(() => {
  console.warn = originalWarn
  setFilmWarnings(true)
})

// Warnings are deduplicated for the page's lifetime, so every test uses a
// value no other test uses.
describe('attribute warnings', () => {
  it('warns about an unrecognised value for an enumerated attribute', async () => {
    await fixture(html`<film-button variant="primray">x</film-button>`)
    expect(warnings).to.have.length(1)
    expect(warnings[0]).to.contain('film-button')
    expect(warnings[0]).to.contain('"primray"')
    expect(warnings[0]).to.contain('variant')
    expect(warnings[0]).to.contain('primary')
  })

  it('warns when the value is set as a property too', async () => {
    const el = await fixture<HTMLElement & { justify: string }>(html`<film-cluster></film-cluster>`)
    el.justify = 'space-betwen'
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete
    expect(warnings.join('\n')).to.contain('"space-betwen"')
  })

  it('names the attribute, not the property, when they differ', async () => {
    await fixture(html`<film-sidebar scroll="sideways"></film-sidebar>`)
    expect(warnings.join('\n')).to.contain('scroll')
    expect(warnings.join('\n')).to.not.contain('scrollPane')
  })

  it('stays quiet for valid values', async () => {
    await fixture(html`<film-button variant="danger" size="small" type="submit">x</film-button>`)
    await fixture(html`<film-cluster justify="space-between" align="baseline"></film-cluster>`)
    expect(warnings).to.deep.equal([])
  })

  it('checks scale-step sizes on typography', async () => {
    await fixture(html`<film-text size="s1">ok</film-text>`)
    await fixture(html`<film-heading level="2">ok</film-heading>`)
    expect(warnings, 'valid steps and the empty heading default').to.deep.equal([])
    await fixture(html`<film-text size="1.5rem">x</film-text>`)
    expect(warnings.join('\n')).to.contain('"1.5rem"')
  })

  it('warns once per distinct mistake', async () => {
    await fixture(html`<film-button variant="dupe-once">a</film-button>`)
    await fixture(html`<film-button variant="dupe-once">b</film-button>`)
    expect(warnings).to.have.length(1)
  })

  it('warns about an attribute the component does not have', async () => {
    await fixture(html`<film-cluster variant="primary"></film-cluster>`)
    expect(warnings).to.have.length(1)
    expect(warnings[0]).to.contain('film-cluster')
    expect(warnings[0]).to.contain('variant')
  })

  it('ignores global, aria, data and framework attributes', async () => {
    await fixture(html`<film-cluster
      id="a" class="b" style="color: red" slot="c" role="group" title="t" hidden lang="en" tabindex="0"
      aria-label="l" data-test="x" data-v-7ba5bd90 _ngcontent-ng-c1 x-data="{}" onclick="void 0"
    ></film-cluster>`)
    expect(warnings).to.deep.equal([])
  })

  it('can be switched off', async () => {
    setFilmWarnings(false)
    await fixture(html`<film-button variant="silenced">x</film-button>`)
    await fixture(html`<film-cluster gap="1rem"></film-cluster>`)
    expect(warnings).to.deep.equal([])
  })
})
