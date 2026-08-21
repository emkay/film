import { esbuildPlugin } from '@web/dev-server-esbuild'
import { fileURLToPath } from 'node:url'

export default {
  files: 'src/**/*.test.ts',
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
