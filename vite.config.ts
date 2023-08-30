import { defineConfig, loadEnv } from 'vite'
import { createVitePlugins, getRootPath, getSrcPath } from './build'
import type { ConfigEnv, UserConfig } from 'vite'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = getRootPath()
  const srcPath = getSrcPath()
  const { VITE_ENABLE_ANALYZE, VITE_BUILD_COMPRESS } = loadEnv(mode, root)
  const isBuild = command === 'build'
  return {
    resolve: {
      alias: {
        '~': root,
        '@': srcPath,
        '#': getSrcPath('types'),
      },
    },
    server: {
      host: true,
    },
    esbuild: {
      drop: isBuild ? ['console', 'debugger'] : [],
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,
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
    plugins: createVitePlugins({
      isBuild,
      enableAnalyze: VITE_ENABLE_ANALYZE === 'true',
      compress: VITE_BUILD_COMPRESS,
    }),
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
