import { html, type TemplateResult } from 'lit'

export const menuExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-menu">Menu</h3>
    <p>Nest a <code>film-menu</code> in an item's <code>submenu</code> slot for a flyout.</p>
    <film-menu style="max-inline-size: 16rem;">
      <film-menu-item value="new">New file</film-menu-item>
      <film-menu-item value="open">Open…</film-menu-item>
      <film-menu-item value="share">
        Share
        <film-menu slot="submenu">
          <film-menu-item value="share-email">Email</film-menu-item>
          <film-menu-item value="share-link">Copy link</film-menu-item>
          <film-menu-item value="share-more">
            More…
            <film-menu slot="submenu">
              <film-menu-item value="share-slack">Slack</film-menu-item>
              <film-menu-item value="share-x">X</film-menu-item>
            </film-menu>
          </film-menu-item>
        </film-menu>
      </film-menu-item>
      <film-menu-item value="save">Save</film-menu-item>
      <film-menu-item value="export" disabled>Export (Pro)</film-menu-item>
    </film-menu>

    <h4>Menu bar</h4>
    <p>Arrow keys move between menus; once one is open, moving or hovering opens the next.</p>
    <film-menu-bar>
      <film-menu-bar-item label="File">
        <film-menu>
          <film-menu-item value="file-new">New</film-menu-item>
          <film-menu-item value="file-open">Open…</film-menu-item>
          <film-menu-item value="file-recent">
            Open recent
            <film-menu slot="submenu">
              <film-menu-item value="recent-1">project.txt</film-menu-item>
              <film-menu-item value="recent-2">notes.md</film-menu-item>
            </film-menu>
          </film-menu-item>
          <film-menu-item value="file-save">Save</film-menu-item>
        </film-menu>
      </film-menu-bar-item>
      <film-menu-bar-item label="Edit">
        <film-menu>
          <film-menu-item value="edit-undo">Undo</film-menu-item>
          <film-menu-item value="edit-redo">Redo</film-menu-item>
          <film-menu-item value="edit-cut">Cut</film-menu-item>
          <film-menu-item value="edit-copy">Copy</film-menu-item>
        </film-menu>
      </film-menu-bar-item>
      <film-menu-bar-item label="View">
        <film-menu>
          <film-menu-item value="view-zoom-in">Zoom in</film-menu-item>
          <film-menu-item value="view-zoom-out">Zoom out</film-menu-item>
          <film-menu-item value="view-full">Full screen</film-menu-item>
        </film-menu>
      </film-menu-bar-item>
    </film-menu-bar>
  </film-box>
`
