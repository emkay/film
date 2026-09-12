import { fixture, html, expect } from '@open-wc/testing'
import './button.js'
import type { Button } from './button.js'

describe('film-button', () => {
  it('renders slotted content in a button', async () => {
    const el = await fixture<Button>(html`<film-button>Click</film-button>`)
    expect(el.shadowRoot?.querySelector('button')).to.exist
    expect(el.textContent).to.equal('Click')
  })

  it('applies the invert class when inverted', async () => {
    const el = await fixture<Button>(html`<film-button invert>x</film-button>`)
    expect(el.invert).to.equal(true)
    expect(el.shadowRoot?.querySelector('button')?.classList.contains('invert')).to.equal(true)
  })

  it('disables the inner button', async () => {
    const el = await fixture<Button>(html`<film-button disabled>x</film-button>`)
    expect(el.shadowRoot?.querySelector('button')?.disabled).to.equal(true)
  })

  it('defaults to medium size and reflects the size attribute', async () => {
    const el = await fixture<Button>(html`<film-button>x</film-button>`)
    expect(el.size).to.equal('medium')
    el.size = 'small'
    await el.updateComplete
    expect(el.getAttribute('size')).to.equal('small')
  })

  it('defaults to the primary variant and reflects it', async () => {
    const el = await fixture<Button>(html`<film-button>x</film-button>`)
    expect(el.variant).to.equal('primary')
    // primary keeps the plain token, so no override is written.
    expect(el.style.getPropertyValue('--button-surface')).to.equal('')
    el.variant = 'danger'
    await el.updateComplete
    expect(el.getAttribute('variant')).to.equal('danger')
    expect(el.style.getPropertyValue('--button-surface')).to.contain('--film-color-danger')
  })

  it('clears the variant override when returning to primary', async () => {
    const el = await fixture<Button>(html`<film-button variant="success">x</film-button>`)
    expect(el.style.getPropertyValue('--button-surface')).to.contain('--film-color-success')
    el.variant = 'primary'
    await el.updateComplete
    expect(el.style.getPropertyValue('--button-surface')).to.equal('')
  })

  // These build the <form> by hand rather than through `fixture()`. A fixture
  // whose root is not a custom element resolves on requestAnimationFrame, and
  // Chrome throttles rAF in backgrounded pages — so any such test times out as
  // soon as the runner has more than one file in flight.
  const forms: HTMLFormElement[] = []

  function formFixture (build: (form: HTMLFormElement) => void): HTMLFormElement {
    const form = document.createElement('form')
    build(form)
    document.body.append(form)
    forms.push(form)
    return form
  }

  afterEach(() => {
    for (const form of forms.splice(0)) form.remove()
  })

  function buttonIn (form: HTMLFormElement, type?: string, disabled = false): Button {
    const button = document.createElement('film-button')
    if (type) button.setAttribute('type', type)
    if (disabled) button.toggleAttribute('disabled', true)
    button.textContent = 'x'
    form.append(button)
    return button
  }

  it('submits a native form via type="submit"', async () => {
    let button!: Button
    const form = formFixture((f) => {
      button = buttonIn(f, 'submit')
    })
    await button.updateComplete
    expect(button.form).to.equal(form)

    let submitted = 0
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      submitted += 1
    })
    button.click()
    expect(submitted).to.equal(1)
  })

  it('resets a native form via type="reset"', async () => {
    let button!: Button
    let input!: HTMLInputElement
    formFixture((f) => {
      input = document.createElement('input')
      input.name = 'q'
      input.setAttribute('value', 'start')
      f.append(input)
      button = buttonIn(f, 'reset')
    })
    await button.updateComplete

    input.value = 'changed'
    button.click()
    expect(input.value).to.equal('start')
  })

  it('does not submit when type is button or when disabled', async () => {
    let plain!: Button
    let off!: Button
    const form = formFixture((f) => {
      plain = buttonIn(f)
      off = buttonIn(f, 'submit', true)
    })
    await Promise.all([plain.updateComplete, off.updateComplete])

    let submitted = 0
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      submitted += 1
    })
    plain.click()
    off.click()
    expect(submitted).to.equal(0)
  })
})
