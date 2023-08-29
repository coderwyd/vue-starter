import fs from 'node:fs'
import process from 'node:process'

// import { formatBytes } from '../src/utils'

// Read all environment variable configuration files to process.env
export function wrapperEnv(envConf: Recordable): ViteEnv {
  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName = realName === 'true' ? true : realName === 'false' ? false : realName

    if (envName === 'VITE_PORT')
      realName = Number(realName)

    ret[envName] = realName
    if (typeof realName === 'string')
      process.env[envName] = realName
    else if (typeof realName === 'object')
      process.env[envName] = JSON.stringify(realName)
  }
  return ret
}
interface FileInfo {
  size: number
  name: string
  path: string
}

interface packageOpt {
  folder?: string
  format?: boolean
  callback: CallableFunction
}

export function getPackageSize({ folder = 'dist', callback, format = true }: packageOpt): string {
  const filesList: FileInfo[] = []
  readFile(folder, filesList)
  let totalSize = 0
  for (let i = 0; i < filesList.length; i++)
    totalSize += filesList[i].size

  callback?.(format ? formatBytes(totalSize) : `${totalSize}`)
  return format ? formatBytes(totalSize) : `${totalSize}`
}

function readFile(path: string, filesList: FileInfo[]) {
  const files = fs.readdirSync(path) // 需要用到同步读取
  files.forEach(walk)
  function walk(file) {
    const states = fs.statSync(`${path}/${file}`)
    if (states.isDirectory()) {
      readFile(`${path}/${file}`, filesList)
    }
    else {
      const obj: FileInfo = Object.create(null)
      obj.size = states.size
      obj.name = file
      obj.path = `${path}/${file}`
      filesList.push(obj)
    }
  }
}

function formatBytes(bytes, decimals = 2) {
  if (!+bytes)
    return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}
