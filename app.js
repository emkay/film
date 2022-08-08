import { LitElement, css, html } from 'lit'
import {Stack, Box, Center, Cluster, Sidebar, Button, Link} from './components'
import { stackExample, boxExample, centerExample, clusterExample, sidebarExample, buttonExample, linkExample} from './examples'

import { createBrowserHistory } from 'history'
const history = createBrowserHistory()

export class App extends LitElement {
  static properties = {}

  static styles = css`
    * {
      font-family: "Fira Sans", sans-serif;
      color: var(--font-color-primary)
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
      text-decoration: none;
    }

    img.logo {
      width: 15%;
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
        href: '/stack',
        text: 'Stack'
      },
      {
        href: '/box',
        text: 'Box'
      },
      {
        href: '/center',
        text: 'Center'
      },
      {
        href: '/cluster',
        text: 'Cluster'
      },
      {
        href: '/sidebar',
        text: 'Sidebar'
      },
      {
        href: '/button',
        text: 'Button'
      },
      {
        href: '/link',
        text: 'Link'
      }
    ]
    console.log(`constructor:history.location`, history.location)
    let unlisten = history.listen(({ location, action }) => {
      console.log(action, location.pathname, location.state);
    })
  }

  componentRouter () {
    const pathname = history.location.pathname
    switch (pathname) {
      case '/stack': return stackExample()
      case '/box': return boxExample()
      case '/center': return centerExample()
      case '/cluster': return clusterExample()
      case '/sidebar': return sidebarExample()
      case '/button': return buttonExample()
      case '/link': return linkExample()
      default: return html`
        <p>Hello! This is the Film Design Language. These are opinionated and basic web components.</p>
      `
    }
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
            <film-link href="https://github.com/emkay/film"><img class="logo" src="www/github.svg" /></film-link>
            ${this.componentRouter()}
          </film-stack>
        </film-box>
      </film-sidebar>
    </main>
    `
  }
}

customElements.define('film-app', App)
