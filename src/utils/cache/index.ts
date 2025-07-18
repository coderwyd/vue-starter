import { name, version } from '~/package.json'
import { createStorage as create } from './storage-cache'
import type { CreateStorageParams } from './storage-cache'

export type Options = Partial<CreateStorageParams>

function createOptions(storage: Storage, options: Options = {}): Options {
  return {
    storage,
    prefixKey: `${name}__${version}__`.toUpperCase(),
    ...options,
  }
}

export const WebStorage = create(createOptions(sessionStorage))

export function createStorage(
  storage: Storage = sessionStorage,
  options: Options = {},
) {
  return create(createOptions(storage, options))
}

export function createSessionStorage(options: Options = {}) {
  return createStorage(sessionStorage, {
    ...options,
    timeout: 7 * 24 * 60 * 60,
  })
}

export function createLocalStorage(options: Options = {}) {
  return createStorage(localStorage, {
    ...options,
    timeout: 7 * 24 * 60 * 60,
  })
}

/**
 * sessionStorage
 */
export const ss = createSessionStorage()
/**
 * localStorage
 */
export const ls = createLocalStorage()

export default WebStorage
