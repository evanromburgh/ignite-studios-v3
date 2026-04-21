/**
 * Nitro's generated `.output/server/package.json` omits `imports`, so Node cannot
 * resolve `#internal/nuxt/paths` when running `node .output/server/index.mjs`.
 * @see https://github.com/nuxt/nuxt/issues/26731
 */
import { copyFile, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const serverDir = join(root, '.output', 'server')
const pkgPath = join(serverDir, 'package.json')

const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'))
pkg.imports = {
  '#internal/nuxt/paths': './nuxt-internal-paths-stub.mjs',
  '#app-manifest': './nuxt-app-manifest-stub.mjs',
}
await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
await copyFile(join(root, 'nuxt-internal-paths-stub.mjs'), join(serverDir, 'nuxt-internal-paths-stub.mjs'))
await copyFile(join(root, 'nuxt-app-manifest-stub.mjs'), join(serverDir, 'nuxt-app-manifest-stub.mjs'))
console.log('[patch-output-imports] patched .output/server/package.json and stub files')
