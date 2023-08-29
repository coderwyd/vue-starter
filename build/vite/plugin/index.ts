import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import VueDevTools from 'vite-plugin-vue-devtools'

import { configCompressPlugin } from './compress'
import { configHtmlPlugin } from './html'
import { viteBuildInfo } from './info'

import unplugin from './unplugin'
import type { PluginOption } from 'vite'

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    VITE_BUILD_COMPRESS,
  } = viteEnv

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    VueDevTools(),
    vue(),
    vueJsx(),
    UnoCSS(),
    ...unplugin,
  ]

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))

  // The following plugins only work in the production environment
  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(configCompressPlugin(VITE_BUILD_COMPRESS))
  }

  // build info
  vitePlugins.push(viteBuildInfo())

  return vitePlugins
}
