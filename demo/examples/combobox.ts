import { html, type TemplateResult } from 'lit'

const fruits = ['Apple', 'Apricot', 'Banana', 'Blackberry', 'Cherry', 'Grape', 'Mango', 'Orange', 'Peach', 'Pear']

export const comboboxExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-combobox">Combobox</h3>
    <film-field label="Fruit" hint="Type to filter the options.">
      <film-combobox name="fruit" placeholder="Search fruit…">
        ${fruits.map((f) => html`<film-select-option value=${f.toLowerCase()}>${f}</film-select-option>`)}
      </film-combobox>
    </film-field>
  </film-box>
`
