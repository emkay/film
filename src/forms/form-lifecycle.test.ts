import { expect } from '@open-wc/testing'
import type { LitElement } from 'lit'
import './input.js'
import './textarea.js'
import './search.js'
import './color-picker.js'
import './date-picker.js'
import './range.js'
import './number-input.js'
import './select.js'
import './select-option.js'
import './combobox.js'
import './radio-group.js'
import './radio.js'
import './checkbox.js'
import './switch.js'

// Every Film form control shares one lifecycle in FilmFormControl: it reports
// its value to the form on first render and on change, and a reset restores
// its default. These pin that down control by control.

interface Case {
  tag: string
  markup: string
  initial: string
  change: (el: LitElement & Record<string, unknown>) => void
  changed: string
}

const cases: Case[] = [
  { tag: 'film-input', markup: '<film-input name="f" value="a"></film-input>', initial: 'a', change: (el) => { el.value = 'b' }, changed: 'b' },
  { tag: 'film-textarea', markup: '<film-textarea name="f" value="a"></film-textarea>', initial: 'a', change: (el) => { el.value = 'b' }, changed: 'b' },
  { tag: 'film-search', markup: '<film-search name="f" value="a"></film-search>', initial: 'a', change: (el) => { el.value = 'b' }, changed: 'b' },
  { tag: 'film-color-picker', markup: '<film-color-picker name="f" value="#112233"></film-color-picker>', initial: '#112233', change: (el) => { el.value = '#445566' }, changed: '#445566' },
  { tag: 'film-date-picker', markup: '<film-date-picker name="f" value="2026-01-02"></film-date-picker>', initial: '2026-01-02', change: (el) => { el.value = '2026-03-04' }, changed: '2026-03-04' },
  { tag: 'film-range', markup: '<film-range name="f" value="30"></film-range>', initial: '30', change: (el) => { el.value = 60 }, changed: '60' },
  { tag: 'film-number-input', markup: '<film-number-input name="f" value="7"></film-number-input>', initial: '7', change: (el) => { el.value = 9 }, changed: '9' },
  {
    tag: 'film-select',
    markup: '<film-select name="f" value="a"><film-select-option value="a">A</film-select-option><film-select-option value="b">B</film-select-option></film-select>',
    initial: 'a',
    change: (el) => { el.value = 'b' },
    changed: 'b'
  },
  {
    tag: 'film-combobox',
    markup: '<film-combobox name="f" value="a"><film-select-option value="a">A</film-select-option><film-select-option value="b">B</film-select-option></film-combobox>',
    initial: 'a',
    change: (el) => { el.value = 'b' },
    changed: 'b'
  },
  {
    tag: 'film-radio-group',
    markup: '<film-radio-group name="f" value="a"><film-radio value="a">A</film-radio><film-radio value="b">B</film-radio></film-radio-group>',
    initial: 'a',
    change: (el) => { el.value = 'b' },
    changed: 'b'
  },
  { tag: 'film-checkbox', markup: '<film-checkbox name="f" checked></film-checkbox>', initial: 'on', change: (el) => { el.checked = false }, changed: '(none)' },
  { tag: 'film-switch', markup: '<film-switch name="f"></film-switch>', initial: '(none)', change: (el) => { el.checked = true }, changed: 'on' }
]

const forms: HTMLFormElement[] = []
afterEach(() => { for (const form of forms.splice(0)) form.remove() })

async function mount (markup: string, tag: string): Promise<{ form: HTMLFormElement, el: LitElement & Record<string, unknown> }> {
  const form = document.createElement('form')
  form.innerHTML = markup
  document.body.append(form)
  forms.push(form)
  const el = form.querySelector(tag) as LitElement & Record<string, unknown>
  await el.updateComplete
  return { form, el }
}

const submitted = (form: HTMLFormElement): string => {
  const value = new FormData(form).get('f')
  return value === null ? '(none)' : String(value)
}

describe('form control lifecycle', () => {
  for (const c of cases) {
    describe(c.tag, () => {
      it('reports its value to the form on first render', async () => {
        const { form } = await mount(c.markup, c.tag)
        expect(submitted(form)).to.equal(c.initial)
      })

      it('reports a changed value', async () => {
        const { form, el } = await mount(c.markup, c.tag)
        c.change(el)
        await el.updateComplete
        expect(submitted(form)).to.equal(c.changed)
      })

      it('restores its default on form reset', async () => {
        const { form, el } = await mount(c.markup, c.tag)
        c.change(el)
        await el.updateComplete
        form.reset()
        await el.updateComplete
        expect(submitted(form)).to.equal(c.initial)
      })
    })
  }

  it('resets to a starting value set as a property, not only as an attribute', async () => {
    // As a Lit `.value=` binding or a React prop sets it: before connecting,
    // with no attribute. Reset used to fall back to '' here.
    const form = document.createElement('form')
    const el = document.createElement('film-input') as LitElement & { name: string, value: string }
    el.name = 'f'
    el.value = 'start'
    form.append(el)
    document.body.append(form)
    forms.push(form)
    await el.updateComplete

    el.value = 'edited'
    await el.updateComplete
    form.reset()
    await el.updateComplete
    expect(el.value).to.equal('start')
  })
})
