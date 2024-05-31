import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import pico from 'picocolors'
import { getPackageSize } from '../utils'
import type { Plugin } from 'vite'
import type { Dayjs } from 'dayjs'

dayjs.extend(duration)

export function viteBuildInfo(): Plugin {
  let startTime: Dayjs
  let endTime: Dayjs
  let outDir: string
  let config: { command: string }
  return {
    name: 'vite:buildInfo',
    configResolved(resolvedConfig) {
      config = resolvedConfig
      outDir = resolvedConfig.build?.outDir ?? 'dist'
    },
    buildStart() {
      if (config.command === 'build')
        startTime = dayjs(new Date())
    },
    closeBundle() {
      if (config.command === 'build') {
        endTime = dayjs(new Date())
        getPackageSize(outDir, (size: string) => {
          console.log(
            pico.bold(
              pico.green(
                `🎉恭喜打包完成（总用时${dayjs
                  .duration(endTime.diff(startTime))
                  .format('mm分ss秒')}，打包后的大小为${size}）`,
              ),
            ),
          )
        })
      }
    },
  }
}
