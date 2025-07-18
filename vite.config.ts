import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import vueDevTools from 'vite-plugin-vue-devtools'
import type { ConfigEnv, UserConfig } from 'vite'

export default defineConfig(({ command }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build'
  return {
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url)),
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
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      unocss(),
      AutoImport({
        imports: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
        dts: 'types/auto-imports.d.ts',
        vueTemplate: true,
        dirs: ['src/store/modules', 'src/composables', 'src/hooks'],
      }),
      Components({
        dts: 'types/components.d.ts',
      }),
      createHtmlPlugin({
        minify: isBuild,
      }),
    ],
    css: {
      devSourcemap: true,
    },
  }
})
