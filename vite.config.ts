import { resolve } from 'node:path'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import { OUTPUT_DIR } from './build/constant'
import { wrapperEnv } from './build/utils'
import { createVitePlugins } from './build/vite/plugin'
import type { ConfigEnv, UserConfig } from 'vite'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()

  const env = loadEnv(mode, root)
  const viteEnv = wrapperEnv(env)
  const { CG_CI_WEBAPP_PUBLIC_PATH } = process.env
  const { VITE_PORT, VITE_DROP_CONSOLE } = viteEnv
  const isBuild = command === 'build'
  return {
    base: CG_CI_WEBAPP_PUBLIC_PATH ?? '/',
    root,
    resolve: {
      alias: {
        '@': `${pathResolve('src')}/`,
        '#': `${pathResolve('types')}/`,
      },
    },
    server: {
      // https: true,
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
    },
    esbuild: {
      drop: VITE_DROP_CONSOLE ? ['console', 'debugger'] : [],
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      outDir: OUTPUT_DIR,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
        },
      },
    },
  }
})
