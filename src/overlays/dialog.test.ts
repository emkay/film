import { fixture, html, expect } from '@open-wc/testing'
import './dialog.js'
import './drawer.js'
import type { FilmModal } from '../internal/modal.js'

/** Resolves true if `name` fires on `el` within `ms`, false otherwise. */
function firesWithin (el: EventTarget, name: string, ms = 1500): Promise<boolean> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), ms)
    el.addEventListener(name, () => {
      clearTimeout(timer)
      resolve(true)
    }, { once: true })
  })
}

async function opened (el: FilmModal): Promise<HTMLDialogElement> {
  el.show()
  await el.updateComplete
  return el.shadowRoot?.querySelector('dialog') as HTMLDialogElement
}

for (const tag of ['film-dialog', 'film-drawer']) {
  describe(`${tag} film-close`, () => {
    const make = (): Promise<FilmModal> =>
      tag === 'film-dialog'
        ? fixture<FilmModal>(html`<film-dialog label="L">x</film-dialog>`)
        : fixture<FilmModal>(html`<film-drawer label="L">x</film-drawer>`)

    it('fires when closed from code', async () => {
      const el = await make()
      await opened(el)
      const fired = firesWithin(el, 'film-close')
      el.close()
      expect(await fired).to.equal(true)
    })

    it('fires when the close button is clicked', async () => {
      const el = await make()
      await opened(el)
      const fired = firesWithin(el, 'film-close')
      ;(el.shadowRoot?.querySelector('.close') as HTMLButtonElement).click()
      expect(await fired).to.equal(true)
      expect(el.open).to.equal(false)
    })

    it('fires when the dialog is dismissed natively (Escape)', async () => {
      const el = await make()
      const dialog = await opened(el)
      const fired = firesWithin(el, 'film-close')
      dialog.close()
      expect(await fired).to.equal(true)
      expect(el.open).to.equal(false)
    })

    it('fires exactly once per close', async () => {
      const el = await make()
      await opened(el)
      let count = 0
      el.addEventListener('film-close', () => { count += 1 })
      el.close()
      await new Promise((resolve) => setTimeout(resolve, 500))
      expect(count).to.equal(1)
    })
  })
}
