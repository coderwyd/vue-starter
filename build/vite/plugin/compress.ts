/**
 * Used to package and output gzip. Note that this does not work properly in Vite, the specific reason is still being investigated
 * @see https://github.com/anncwb/vite-plugin-compression
 */
import compressPlugin from 'vite-plugin-compression'
import { isArray } from '../../../src/utils/type-checks'
import type { PluginOption } from 'vite'

export function configCompressPlugin(compress: ViteCompression): PluginOption | PluginOption[] {
  if (compress === 'none')
    return null

  const gz = {
    ext: '.gz',
    threshold: 0,
    filter: () => true,
    deleteOriginFile: false,
  }
  const br = {
    ext: '.br',
    algorithm: 'brotliCompress',
    threshold: 0,
    filter: () => true,
    deleteOriginFile: false,
  }

  const codeList = [
    { k: 'gzip', v: gz },
    { k: 'brotli', v: br },
    { k: 'both', v: [gz, br] },
  ]

  const plugins: PluginOption[] = []

  codeList.forEach((item) => {
    if (compress.includes(item.k)) {
      if (compress.includes('clear')) {
        if (isArray(item.v)) {
          item.v.forEach((vItem) => {
            plugins.push(compressPlugin(Object.assign(vItem, { deleteOriginFile: true })))
          })
        }
        else {
          plugins.push(compressPlugin(Object.assign(item.v, { deleteOriginFile: true })))
        }
      }
      else {
        if (isArray(item.v)) {
          item.v.forEach((vItem) => {
            plugins.push(compressPlugin(vItem))
          })
        }
        else {
          plugins.push(compressPlugin(item.v))
        }
      }
    }
  })

  return plugins
}
