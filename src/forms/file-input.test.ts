import { fixture, html, expect } from '@open-wc/testing'
import './file-input.js'
import type { FileInput } from './file-input.js'

const dropzone = (el: FileInput): HTMLElement => el.shadowRoot?.querySelector('.dropzone') as HTMLElement

function drop (el: FileInput, ...names: string[]): void {
  const data = new DataTransfer()
  for (const name of names) data.items.add(new File(['x'], name, { type: 'text/plain' }))
  dropzone(el).dispatchEvent(new DragEvent('drop', { dataTransfer: data, bubbles: true, cancelable: true }))
}

async function inForm (markup: string): Promise<{ form: HTMLFormElement, el: FileInput }> {
  const form = document.createElement('form')
  form.innerHTML = markup
  document.body.append(form)
  const el = form.querySelector('film-file-input') as FileInput
  await el.updateComplete
  return { form, el }
}

describe('film-file-input', () => {
  it('submits nothing until a file is chosen', async () => {
    const { form } = await inForm('<film-file-input name="doc"></film-file-input>')
    expect(new FormData(form).get('doc')).to.equal(null)
    form.remove()
  })

  it('takes a dropped file, lists it and submits it', async () => {
    const { form, el } = await inForm('<film-file-input name="doc"></film-file-input>')
    let changes = 0
    el.addEventListener('change', () => { changes += 1 })
    drop(el, 'report.txt')
    await el.updateComplete
    expect(changes).to.equal(1)
    expect((new FormData(form).get('doc') as File).name).to.equal('report.txt')
    expect(el.shadowRoot?.querySelector('film-tag')?.textContent).to.equal('report.txt')
    form.remove()
  })

  it('submits every file when multiple', async () => {
    const { form, el } = await inForm('<film-file-input name="doc" multiple></film-file-input>')
    drop(el, 'a.txt', 'b.txt')
    await el.updateComplete
    expect(new FormData(form).getAll('doc').map((f) => (f as File).name)).to.deep.equal(['a.txt', 'b.txt'])
    form.remove()
  })

  it('ignores drops while disabled', async () => {
    const { form, el } = await inForm('<film-file-input name="doc" disabled></film-file-input>')
    drop(el, 'a.txt')
    await el.updateComplete
    expect(new FormData(form).get('doc')).to.equal(null)
    form.remove()
  })

  it('fails `required` until a file is chosen', async () => {
    const { form, el } = await inForm('<film-file-input name="doc" required></film-file-input>')
    expect(el.checkValidity()).to.equal(false)
    drop(el, 'a.txt')
    await el.updateComplete
    expect(el.checkValidity()).to.equal(true)
    form.remove()
  })

  it('clears on form reset', async () => {
    const { form, el } = await inForm('<film-file-input name="doc"></film-file-input>')
    drop(el, 'a.txt')
    await el.updateComplete
    form.reset()
    await el.updateComplete
    expect(new FormData(form).get('doc')).to.equal(null)
    expect(el.shadowRoot?.querySelector('film-tag')).to.equal(null)
    form.remove()
  })

  it('opens the file dialog from the keyboard', async () => {
    const el = await fixture<FileInput>(html`<film-file-input></film-file-input>`)
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    let opened = 0
    input.click = () => { opened += 1 }
    dropzone(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    dropzone(el).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    expect(opened).to.equal(2)
  })
})
