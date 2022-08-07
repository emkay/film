import { LitElement, css, html } from 'lit'
import {Stack, Box, Center, Cluster, Sidebar, Button, Link} from './components'

export class App extends LitElement {
  static properties = {}

  static styles = css`
    * {
      font-family: "Fira Sans", sans-serif;
      max-inline-size: var(--measure);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    /* no default margin */
    body,
    h1,
    h2,
    h3,
    h4,
    p,
    figure,
    blockquote,
    dl,
    dd {
      margin: 0;
    }

    /* remove default list style */
    ul[role='list'],
    ol[role='list'] {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    html:focus-within {
      scroll-behavior: smooth;
    }

    body {
      min-height: 100vh;
      text-rendering: optimizeSpeed;
      line-height: 1.5;
    }

    a:not([class]) {
      text-decoration-skip-ink: auto;
    }

    img,
    picture {
      max-width: 100%;
      display: block;
    }

    input,
    button,
    textarea,
    select {
      font: inherit;
    }

    /* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
    @media (prefers-reduced-motion: reduce) {
      html:focus-within {
       scroll-behavior: auto;
      }

      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }

    html,
    body,
    div,
    section,
    header,
    nav,
    main,
    footer {
      max-inline-size: none;
    }

    main * {
      margin: var(--s-3);
    }

    /* use the ratio */
    h1 {
      font-size: var(--s4);
    }

    h2 {
      font-size: var(--s3);
    }

    h3 {
      font-size: var(--s2);
    }

    h4 {
      font-size: var(--s1);
    }

    nav a {
      color: var(--color-links);
    }

    nav h1 {
      font-size: var(--s3);
    }

    nav h2 {
      font-size: var(--s2);
    }

    nav h3 {
      font-size: var(--s1);
    }

    nav h1.title a {
      color: var(--color-dark);
    }

    img.logo {
      width: 100px;
    }

    /* hacks:
     * If we wrap the Stack component and add this in there would that work? */
    film-stack > * {
      margin-block: 0;
    }

    film-stack > * + * {
      margin-block-start: var(--s1);
    }
  `

  // film-stack > * + * is here because I couldn't figure out how to do compound selectors using ::slotted().
  // need to figure out a place for all this css.

  constructor () {
    super()
    this.componentNavLinks = [
      {
        href: '#film-components-stack',
        text: 'Stack'
      },
      {
        href: '#film-components-box',
        text: 'Box'
      },
      {
        href: '#film-components-center',
        text: 'Center'
      },
      {
        href: '#film-components-cluster',
        text: 'Cluster'
      },
      {
        href: '#film-components-sidebar',
        text: 'Sidebar'
      },
      {
        href: '#film-components-button',
        text: 'Button'
      },
      {
        href: '#film-components-link',
        text: 'Link'
      }
    ]
  }

  render () {
    return html`
    <main>
      <film-sidebar>
        <film-box>
          <nav>
            <h1 class="title"><a href="/">Film</a></h1>
            <film-box>
              <h2>Components</h2>
              <ul role="list">
                ${this.componentNavLinks.map(link =>
                html`<li><film-box><film-center><film-link href=${link.href}>${link.text}</film-link></film-center></film-box></li>`
                )}
              </ul>
            </film-box>
          </nav>
        </film-box>

        <film-box>
          <film-stack>
            <h1><span>Film Design</span></h1>
            <img class="logo" src="www/film.svg" />

            <h2 id="film-components">Components</h2>
            <film-box>
              <h3 id="film-components-stack">Stack</h3>
              <film-stack>
                <p>Hello! This is the Film Design Language. These are opinionated and basic web components. This is an example of a paragraph in a Stack.</p>
                <p>This is the second paragraph. This should stack and have some space between it and the first paragraph.</p>
                <p>This is the third paragraph. This should stack and have some space between it and the second paragraph.</p>
              </film-stack>
            </film-box>

            <film-box>
              <h3 id="film-components-box">Box</h3>
              <film-stack>
                <h4>Simple Box</h4>
                <film-box>
                  <p>This is a box.</p>
                </film-box>
                <film-box>
                  <p>This is another box.</p>
                </film-box>
                <film-box>
                  <p>A box with multiple children and some longer text.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </film-box>

                <h4>Inverted Box</h4>
                <film-box ?invert=${true}>
                  <p>This is an inverted box.</p>
                </film-box>

                <h4>Nested Box</h4>
                <film-box>
                  <p>A Box</p>
                  <film-box>
                    <p>within a Box</p>
                    <film-box>
                      <p>within a Box.</p>
                    </film-box>
                  </film-box>
                </film-box>
              </film-stack>
            </film-box>

            <film-box>
              <h3 id="film-components-center">Center</h3>
              <film-stack>
                <film-center>
                  <film-box>
                    <p>This is a box that is centered.</p>
                  </film-box>
                </film-center>

                <film-box>
                  <film-center>
                    <p>Content is centered.</p>
                  </film-center>
                </film-box>
              </film-stack>
            </film-box>

            <film-box>
              <h3 id="film-components-cluster">Cluster</h3>
              <film-cluster>
                <p>This is a paragraph inside a cluster.</p>
                <p>This is another paragraph inside a cluster.</p>
                <p>Below are two boxes in a cluster.</p>
                <film-box>Hello</film-box>
                <film-box>World</film-box>
              </film-cluster>
            </film-box>

            <film-box>
              <h3 id="film-components-sidebar">Sidebar</h3>
              <film-stack>
                <film-sidebar>
                  <input type="text"/>
                  <film-button>Search</flim-button>
                </film-sidebar>
              </film-stack>
            </film-box>

            <film-box>
              <h3 id="film-components-button">Button</h3>
              <film-button>Button</film-button>
              <film-button ?invert=${true}>Invert Button</film-button>
            </film-box>

            <film-box>
              <h3 id="film-components-link">Link</h3>
              <film-link href="#">This is a link example</film-link>
            </film-box>
          </film-stack>
        </film-box>
      </film-sidebar>
    </main>
    `
  }
}

customElements.define('film-app', App)
