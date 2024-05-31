import { readdir, stat } from 'node:fs'
import process from 'node:process'

function sum(arr: number[]) {
  return arr.reduce((t: number, c: number) => {
    return t + c
  }, 0)
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

export function getPackageSize(
  folder: string,
  callback: Function,
  fileListTotal: number[] = [],
): void {
  readdir(folder, (err, files: string[]) => {
    if (err)
      throw err
    let count = 0
    const checkEnd = () => {
      ++count === files.length && callback(formatBytes(sum(fileListTotal)))
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
          getPackageSize(`${folder}/${item}/`, checkEnd, fileListTotal)
        }
      })
    })
    files.length === 0 && callback()
  })
}

/**
 * 获取项目根路径
 * @descrition 末尾不带斜杠
 */
export function getRootPath() {
  return process.cwd()
}

/**
 * 获取项目src路径
 * @param srcName - src目录名称(默认: "src")
 * @descrition 末尾不带斜杠
 */
export function getSrcPath(srcName = 'src') {
  const rootPath = getRootPath()

  return `${rootPath}/${srcName}`
}
