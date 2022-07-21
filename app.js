import {LitElement, css, html} from 'lit'
import Stack from './components/stack/index.js'
import Box from './components/box/index.js'
import Center from './components/center/index.js'
import Cluster from './components/cluster/index.js'
import Sidebar from './components/sidebar/index.js'
import Button from './components/button/index.js'

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

    /* hacks */
    film-stack > * {
      margin-block: 0;
    }

    film-stack > * + * {
      margin-block-start: var(--s1);
    }
  `

  // film-stack > * + * is here because I couldn't figure out how to do compound selectors using ::slotted().
  // need to figure out a place for all this css.

  constructor() {
    super()
  }

  render() {
    return html`
      <film-sidebar>
        <section>
          <nav>
            <h5>Components</h5>
            <ul role="list">
              <li><a href="#film-components-stack">Stack</a></li>
              <li><a href="#film-components-box">Box</a></li>
              <li><a href="#film-components-center">Center</a></li>
              <li><a href="#film-components-cluster">Cluster</a></li>
              <li><a href="#film-component-sidebar">Sidebar</a></li>
              <li><a href="#film-component-button">Button</a></li>
            </ul>
          </nav>
        </section>

        <section>
          <h1>The Film Design Language</h1>
          <h2 id="film-components">Components</h2>
          <h3 id="film-components-stack">Stack</h3>
          <film-stack>
            <p>Hello! This is the Film Design Language. These are opinionated and basic web components. This is an example of a paragraph in a Stack.</p></film-box>
            <p>This is the second paragraph. This should stack and have some space between it and the first paragraph.</p>
            <p>This is the third paragraph. This should stack and have some space between it and the second paragraph.</p>
          </film-stack>

          <h3 id="film-components-box">Box</h3>

          <film-stack>
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
          </film-stack>

          <h3 id="film-components-center">Center</h3>

          <film-stack>
            <film-center>
              <film-box>
                <p>This is a box that is centered.</p>
              </film-box>
            </film-center>

            <film-box>
              <film-center>
                <p>This is a box where the content is centered.</p>
              </film-center>
            </film-box>
          </film-stack>

          <h3 id="film-components-cluster">Cluster</h3>
          <film-cluster>
            <p>This is a paragraph inside a cluster.</p>
            <p>This is another paragraph inside a cluster.</p>
            <p>Below are two boxes in a cluster.</p>
            <film-box>Hello</film-box>
            <film-box>World</film-box>
          </film-cluster>

          <h3 id="film-components-sidebar">Sidebar</h3>
          <film-stack>
            <film-sidebar>
              <input type="text"/>
              <film-button>Search</flim-button>
            </film-sidebar>
          </film-stack>

          <h3 id="film-components-button">Button</h3>
          <film-button>Button</film-button>
          <film-button ?invert=${true}>Invert Button</film-button>
        </section>
      </film-sidebar>
    `
  }
}

customElements.define('film-app', App)
