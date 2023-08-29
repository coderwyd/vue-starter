import { readdir, stat } from 'node:fs'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { bold, green } from 'picocolors'
import type { Plugin } from 'vite'
import type { Dayjs } from 'dayjs'

dayjs.extend(duration)

const fileListTotal: number[] = []

// eslint-disable-next-line @typescript-eslint/ban-types
function recursiveDirectory(folder: string, callback: Function): void {
  readdir(folder, (err, files: string[]) => {
    console.log(err, 'err')
    console.log(files, 'files')
    if (err)
      throw err
    let count = 0
    const checkEnd = () => {
      ++count === files.length && callback()
    }
    files.forEach((item: string) => {
      stat(`${folder}/${item}`, async (err, stats) => {
        if (err)
          throw err
        if (stats.isFile()) {
          fileListTotal.push(stats.size)
          checkEnd()
        }
        else if (stats.isDirectory()) {
          recursiveDirectory(`${folder}/${item}/`, checkEnd)
        }
      })
    })
    files.length === 0 && callback()
  })
}

function sum(arr: number[]) {
  return arr.reduce((t: number, c: number) => {
    return t + c
  }
  , 0)
}
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes)
    return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

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
        recursiveDirectory(outDir, () => {
          console.log(
            bold(
              green(
                `🎉恭喜打包完成（总用时${dayjs
                  .duration(endTime.diff(startTime))
                  .format('mm分ss秒')}，打包后的大小为${formatBytes(
                    sum(fileListTotal),
                  )}）`,
              ),
            ),
          )
        })
      }
    },
  }
}
