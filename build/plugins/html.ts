import { createHtmlPlugin } from 'vite-plugin-html'
import type { PluginOption } from 'vite'

export function configHtmlPlugin({ isBuild }: { isBuild: boolean }) {
  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    minify: isBuild,
  })
  return htmlPlugin
}
