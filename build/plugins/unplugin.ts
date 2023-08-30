import path from 'node:path'
import process from 'node:process'
import AutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'

export default [
  AutoImport({
    imports: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
    dts: 'types/auto-imports.d.ts',
    vueTemplate: true,
    dirs: ['src/store/modules', 'src/composables', 'src/hooks'],
  }),
  Icons({
    customCollections: {
      custom: FileSystemIconLoader(path.resolve(process.cwd(), 'src/assets/icons'), svg =>
        svg.replace(/^<svg /, '<svg fill="currentColor" '),
      ),
    },
  }),
  Components({
    resolvers: [
      IconsResolver({
        customCollections: ['custom'],
      }),
    ],
    dts: 'types/components.d.ts',
  }),
]
