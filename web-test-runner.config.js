import { esbuildPlugin } from '@web/dev-server-esbuild'
import { fileURLToPath } from 'node:url'

export default {
  files: 'src/**/*.test.ts',
  // One page at a time. Chrome throttles backgrounded pages: requestAnimationFrame
  // stalls (so fixture() on a plain element never resolves) and a native
  // <dialog>'s close event is held back, so concurrent runs fail at random.
  concurrency: 1,
  nodeResolve: true,
  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'es2022',
      // Pick up experimentalDecorators / useDefineForClassFields for Lit.
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url))
    })
  ]
}
