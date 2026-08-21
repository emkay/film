import { LitElement, css, html, type TemplateResult } from 'lit'
import { customElement, state } from 'lit/decorators.js'

// Registers every <film-*> element as a side effect.
import '../src/index.js'
import type { RadioGroup, Switch } from '../src/index.js'

import {
  alertExample,
  avatarExample,
  badgeExample,
  boxExample,
  breadcrumbExample,
  buttonExample,
  buttonGroupExample,
  cardExample,
  centerExample,
  checkboxExample,
  clusterExample,
  colorPickerExample,
  copyButtonExample,
  coverExample,
  detailsExample,
  dialogExample,
  dividerExample,
  drawerExample,
  dropdownExample,
  fieldExample,
  formExample,
  frameExample,
  gridExample,
  iconExample,
  iconButtonExample,
  imposterExample,
  inputExample,
  linkExample,
  menuExample,
  paginationExample,
  progressBarExample,
  radioExample,
  rangeExample,
  reelExample,
  selectExample,
  sidebarExample,
  skeletonExample,
  spinnerExample,
  splitPanelExample,
  stackExample,
  switchExample,
  switcherExample,
  tableExample,
  tabsExample,
  tagExample,
  textareaExample,
  toastExample,
  tooltipExample,
  treeExample
} from './examples/index.js'

interface NavLink {
  slug: string
  text: string
  render: () => TemplateResult
}

interface NavSection {
  title: string
  links: NavLink[]
}

const sections: NavSection[] = [
  {
    title: 'Layout',
    links: [
      { slug: 'stack', text: 'Stack', render: stackExample },
      { slug: 'box', text: 'Box', render: boxExample },
      { slug: 'center', text: 'Center', render: centerExample },
      { slug: 'cluster', text: 'Cluster', render: clusterExample },
      { slug: 'sidebar', text: 'Sidebar', render: sidebarExample },
      { slug: 'grid', text: 'Grid', render: gridExample },
      { slug: 'switcher', text: 'Switcher', render: switcherExample },
      { slug: 'cover', text: 'Cover', render: coverExample },
      { slug: 'frame', text: 'Frame', render: frameExample },
      { slug: 'reel', text: 'Reel', render: reelExample },
      { slug: 'imposter', text: 'Imposter', render: imposterExample },
      { slug: 'icon', text: 'Icon', render: iconExample },
      { slug: 'split-panel', text: 'Split Panel', render: splitPanelExample }
    ]
  },
  {
    title: 'Actions',
    links: [
      { slug: 'button', text: 'Button', render: buttonExample },
      { slug: 'button-group', text: 'Button Group', render: buttonGroupExample },
      { slug: 'icon-button', text: 'Icon Button', render: iconButtonExample },
      { slug: 'link', text: 'Link', render: linkExample },
      { slug: 'copy-button', text: 'Copy Button', render: copyButtonExample }
    ]
  },
  {
    title: 'Forms',
    links: [
      { slug: 'input', text: 'Input', render: inputExample },
      { slug: 'textarea', text: 'Textarea', render: textareaExample },
      { slug: 'select', text: 'Select', render: selectExample },
      { slug: 'checkbox', text: 'Checkbox', render: checkboxExample },
      { slug: 'radio', text: 'Radio', render: radioExample },
      { slug: 'switch', text: 'Switch', render: switchExample },
      { slug: 'range', text: 'Range', render: rangeExample },
      { slug: 'color-picker', text: 'Color Picker', render: colorPickerExample },
      { slug: 'field', text: 'Field', render: fieldExample },
      { slug: 'form', text: 'Form', render: formExample }
    ]
  },
  {
    title: 'Navigation',
    links: [
      { slug: 'breadcrumb', text: 'Breadcrumb', render: breadcrumbExample },
      { slug: 'menu', text: 'Menu', render: menuExample },
      { slug: 'tabs', text: 'Tabs', render: tabsExample },
      { slug: 'tree', text: 'Tree', render: treeExample },
      { slug: 'pagination', text: 'Pagination', render: paginationExample }
    ]
  },
  {
    title: 'Overlays',
    links: [
      { slug: 'dialog', text: 'Dialog', render: dialogExample },
      { slug: 'drawer', text: 'Drawer', render: drawerExample },
      { slug: 'dropdown', text: 'Dropdown', render: dropdownExample },
      { slug: 'tooltip', text: 'Tooltip', render: tooltipExample }
    ]
  },
  {
    title: 'Typography',
    links: [{ slug: 'divider', text: 'Divider', render: dividerExample }]
  },
  {
    title: 'Data',
    links: [
      { slug: 'card', text: 'Card', render: cardExample },
      { slug: 'avatar', text: 'Avatar', render: avatarExample },
      { slug: 'details', text: 'Details', render: detailsExample },
      { slug: 'table', text: 'Table', render: tableExample }
    ]
  },
  {
    title: 'Feedback',
    links: [
      { slug: 'alert', text: 'Alert', render: alertExample },
      { slug: 'badge', text: 'Badge', render: badgeExample },
      { slug: 'tag', text: 'Tag', render: tagExample },
      { slug: 'progress-bar', text: 'Progress Bar', render: progressBarExample },
      { slug: 'spinner', text: 'Spinner', render: spinnerExample },
      { slug: 'skeleton', text: 'Skeleton', render: skeletonExample },
      { slug: 'toast', text: 'Toast', render: toastExample }
    ]
  }
]

const routes: Record<string, () => TemplateResult> = Object.fromEntries(
  sections.flatMap((section) =>
    section.links.map((link) => [`#/${link.slug}`, link.render])
  )
)

const base = import.meta.env.BASE_URL
const asset = (name: string): string => `${base}${name}`

interface ThemeOption {
  id: string
  label: string
}

// Mirrors the palettes in css/themes/default/application/palettes.css.
const themes: ThemeOption[] = [
  { id: 'paper', label: 'Paper' },
  { id: 'classic', label: 'Classic' },
  { id: 'kodachrome', label: "Kodachrome · '60s" },
  { id: 'polaroid', label: "Polaroid · '70s" },
  { id: 'ektachrome', label: "Ektachrome · '80s" },
  { id: 'velvia', label: "Velvia · '90s" }
]

@customElement('film-app')
export class App extends LitElement {
  private readonly onHashChange = () => this.requestUpdate()

  /** When on, the nav and content panes each scroll independently. */
  @state() private independentScroll = true

  private readonly onToggleScroll = (event: Event): void => {
    this.independentScroll = (event.target as Switch).checked
  }

  /** Reflects/forces the colour scheme via <html data-theme>. */
  @state() private darkMode = false

  private readonly onToggleTheme = (event: Event): void => {
    this.darkMode = (event.target as Switch).checked
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light')
  }

  /** The active colour palette (data-film-theme). */
  @state() private theme = 'paper'

  private readonly onSelectTheme = (event: Event): void => {
    this.theme = (event.target as RadioGroup).value
    document.documentElement.setAttribute('data-film-theme', this.theme)
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--film-font-sans);
      color: var(--film-color-text);
    }

    /* App-shell height context so the Sidebar's panes have something to scroll
       within. Only above the wrap breakpoint — narrow screens stack and flow. */
    @media (min-width: 48rem) {
      main.app-shell {
        block-size: 100dvh;
        overflow: hidden;
      }

      main.app-shell film-sidebar {
        block-size: 100%;
      }
    }

    .controls {
      font-size: var(--s-1);
    }

    .picker-label {
      display: block;
      font-weight: 600;
      margin-block-end: var(--s-2);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    ul[role='list'] {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    /* Let the layout primitives (Stack gap, Box padding) own spacing —
       slotted content stays margin-free (every-layout composition). */
    :where(h1, h2, h3, h4, h5, h6, p, pre, figure, blockquote) {
      margin: 0;
    }

    img,
    picture {
      max-width: 100%;
      display: block;
    }

    input,
    button {
      font: inherit;
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }

    /* headings ride the modular scale */
    h1 { font-size: var(--s3); }
    h2 { font-size: var(--s3); }
    h3 { font-size: var(--s2); }
    h4 { font-size: var(--s1); }

    nav h2 { font-size: var(--s1); }

    nav a {
      color: var(--film-color-link);
    }

    /* brand + social icons, sized on the modular scale */
    img.brand {
      inline-size: var(--s5);
    }

    img.social {
      inline-size: var(--s3);
    }
  `

  connectedCallback () {
    super.connectedCallback()
    window.addEventListener('hashchange', this.onHashChange)
    // Reflect the current scheme: an already-forced data-theme, else the OS.
    const forced = document.documentElement.getAttribute('data-theme')
    this.darkMode = forced
      ? forced === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
    this.theme = document.documentElement.getAttribute('data-film-theme') ?? 'paper'
  }

  disconnectedCallback () {
    window.removeEventListener('hashchange', this.onHashChange)
    super.disconnectedCallback()
  }

  private componentRouter (): TemplateResult {
    const example = routes[window.location.hash]
    if (example) return example()
    return html`
      <p>Hello! This is the Film Design Language. These are opinionated and basic web components built on Every Layout primitives and a modular scale.</p>
    `
  }

  render () {
    return html`
      <main class=${this.independentScroll ? 'app-shell' : ''}>
        <film-sidebar scroll=${this.independentScroll ? 'both' : 'none'}>
          <film-box>
            <nav>
              <film-stack space="var(--s1)">
                <film-stack space="var(--s-1)">
                  <a href="#/" aria-label="Film home">
                    <img class="brand" src=${asset('film.svg')} alt="Film" />
                  </a>
                  <film-link href="https://github.com/emkay/film">
                    <img class="social" src=${asset('github.svg')} alt="GitHub" />
                  </film-link>
                </film-stack>
                <film-stack class="controls" space="var(--s-1)">
                  <div class="picker">
                    <span class="picker-label">Theme</span>
                    <film-radio-group
                      label="Theme"
                      value=${this.theme}
                      @change=${this.onSelectTheme}
                    >
                      ${themes.map(
                        (t) => html`<film-radio value=${t.id}>${t.label}</film-radio>`
                      )}
                    </film-radio-group>
                  </div>
                  <film-switch
                    ?checked=${this.darkMode}
                    @change=${this.onToggleTheme}
                  >Dark mode</film-switch>
                  <film-switch
                    ?checked=${this.independentScroll}
                    @change=${this.onToggleScroll}
                  >Independent scroll</film-switch>
                </film-stack>
                ${sections.map(
                  (section) => html`
                    <div>
                      <h2>${section.title}</h2>
                      <film-stack space="var(--s-1)">
                        <ul role="list">
                          ${section.links.map(
                            (link) => html`
                              <li>
                                <film-link href="#/${link.slug}">${link.text}</film-link>
                              </li>
                            `
                          )}
                        </ul>
                      </film-stack>
                    </div>
                  `
                )}
              </film-stack>
            </nav>
          </film-box>

          <film-box>
            <film-stack>
              <h1>Film Design</h1>
              ${this.componentRouter()}
            </film-stack>
          </film-box>
        </film-sidebar>
      </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-app': App
  }
}
