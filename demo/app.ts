import { LitElement, css, html, type TemplateResult } from 'lit'
import { customElement } from 'lit/decorators.js'

// Registers every <film-*> element as a side effect.
import '../src/index.js'

import {
  boxExample,
  buttonExample,
  centerExample,
  clusterExample,
  linkExample,
  sidebarExample,
  stackExample
} from './examples/index.js'

interface NavLink {
  href: string
  text: string
}

const base = import.meta.env.BASE_URL
const asset = (name: string): string => `${base}${name}`

const routes: Record<string, () => TemplateResult> = {
  '#/stack': stackExample,
  '#/box': boxExample,
  '#/center': centerExample,
  '#/cluster': clusterExample,
  '#/sidebar': sidebarExample,
  '#/button': buttonExample,
  '#/link': linkExample
}

@customElement('film-app')
export class App extends LitElement {
  private readonly componentNavLinks: NavLink[] = [
    { href: '#/stack', text: 'Stack' },
    { href: '#/box', text: 'Box' },
    { href: '#/center', text: 'Center' },
    { href: '#/cluster', text: 'Cluster' },
    { href: '#/sidebar', text: 'Sidebar' },
    { href: '#/button', text: 'Button' },
    { href: '#/link', text: 'Link' }
  ]

  private readonly onHashChange = () => this.requestUpdate()

  static styles = css`
    :host {
      font-family: "Fira Sans", sans-serif;
      color: var(--font-color-primary);
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
    h1 { font-size: var(--s4); }
    h2 { font-size: var(--s3); }
    h3 { font-size: var(--s2); }
    h4 { font-size: var(--s1); }

    nav h1 { font-size: var(--s3); }
    nav h2 { font-size: var(--s2); }
    nav h3 { font-size: var(--s1); }

    nav a {
      color: var(--color-links);
    }

    nav h1.title a {
      color: var(--color-dark);
      text-decoration: none;
    }

    img.logo {
      width: 15%;
    }
  `

  connectedCallback () {
    super.connectedCallback()
    window.addEventListener('hashchange', this.onHashChange)
  }

  disconnectedCallback () {
    window.removeEventListener('hashchange', this.onHashChange)
    super.disconnectedCallback()
  }

  private componentRouter (): TemplateResult {
    const example = routes[window.location.hash]
    if (example) return example()
    return html`
      <p>Hello! This is the Film Design Language. These are opinionated and basic web components.</p>
    `
  }

  render () {
    return html`
      <main>
        <film-sidebar>
          <film-box>
            <nav>
              <h1 class="title"><a href="#/">Film</a></h1>
              <film-box>
                <h2>Components</h2>
                <film-stack space="var(--s0)">
                  <ul role="list">
                    ${this.componentNavLinks.map(
                      (link) => html`
                        <li>
                          <film-link href=${link.href}>${link.text}</film-link>
                        </li>
                      `
                    )}
                  </ul>
                </film-stack>
              </film-box>
            </nav>
          </film-box>

          <film-box>
            <film-stack>
              <h1><span>Film Design</span></h1>
              <img class="logo" src=${asset('film.svg')} alt="Film logo" />
              <film-link href="https://github.com/emkay/film">
                <img class="logo" src=${asset('github.svg')} alt="GitHub" />
              </film-link>
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
