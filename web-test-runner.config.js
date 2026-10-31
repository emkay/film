import { esbuildPlugin } from '@web/dev-server-esbuild'
import { a11ySnapshotPlugin } from '@web/test-runner-commands/plugins'
import { fileURLToPath } from 'node:url'

// The whole accessibility tree. The stock a11ySnapshot prunes nodes Puppeteer
// deems uninteresting, which includes every container role that isn't
// focusable (dialog, grid, row, tabpanel), so those could never be asserted.
const fullA11ySnapshotPlugin = {
  name: 'a11y-snapshot-full',
  async executeCommand ({ command, session }) {
    if (command !== 'a11y-snapshot-full') return undefined
    return session.browser.getPage(session.id).accessibility.snapshot({ interestingOnly: false })
  }
}

export default {
  files: 'src/**/*.test.ts',
  // One page at a time. Chrome throttles backgrounded pages: requestAnimationFrame
  // stalls (so fixture() on a plain element never resolves) and a native
  // <dialog>'s close event is held back, so concurrent runs fail at random.
  concurrency: 1,
  nodeResolve: true,
  plugins: [
    // Chrome's accessibility tree: what screen readers actually get.
    a11ySnapshotPlugin(),
    fullA11ySnapshotPlugin,
    esbuildPlugin({
      ts: true,
      target: 'es2022',
      // Pick up experimentalDecorators / useDefineForClassFields for Lit.
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url))
    })
  ]
}
