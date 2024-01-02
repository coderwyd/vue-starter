import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { configCompressPlugin } from './compress'
import { configHtmlPlugin } from './html'
import { viteBuildInfo } from './info'
import unplugin from './unplugin'
import { configVisualizerConfig } from './visualizer'
import type { PluginOption } from 'vite'

interface Options {
  isBuild: boolean
  compress: string
  enableAnalyze?: boolean
}

export function createVitePlugins({
  isBuild,
  compress,
  enableAnalyze,
}: Options) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    vue(),
    vueJsx(),
    vueDevTools(),
    unocss(),
    ...unplugin,
  ]

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin({ isBuild }))

  // The following plugins only work in the production environment
  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(configCompressPlugin({ compress }))
  }
  // rollup-plugin-visualizer
  if (enableAnalyze) vitePlugins.push(configVisualizerConfig())

  // build info
  vitePlugins.push(viteBuildInfo())

  return vitePlugins
}
