import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import { createVitePlugins, getRootPath, getSrcPath, wrapperEnv } from './build'
import type { ConfigEnv, UserConfig } from 'vite'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const rootPath = getRootPath()
  const srcPath = getSrcPath()
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
        '~': rootPath,
        '@': srcPath,
        '#': getSrcPath('types'),
      },
    },
    server: {
      host: true,
      port: VITE_PORT,
    },
    esbuild: {
      drop: VITE_DROP_CONSOLE ? ['console', 'debugger'] : [],
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          // 入口文件名
          entryFileNames: 'assets/[name].js',
          manualChunks: {
            vue: ['vue', 'pinia', 'vue-router'],
          },
        },
      },
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
