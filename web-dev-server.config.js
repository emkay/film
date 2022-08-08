import rollupReplace from '@rollup/plugin-replace'
import { fromRollup } from '@web/dev-server-rollup'

const replace = fromRollup(rollupReplace)

export default {
  open: true,
  watch: true,
  appIndex: 'index.html',
  nodeResolve: {
    exportConditions: ['development']
    // dedupe: true,
  },
  esbuildTarget: 'auto',
  plugins: [replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  })]
}
