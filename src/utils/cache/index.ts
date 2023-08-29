import { DEFAULT_CACHE_TIME } from '@/settings/encryptionSetting'
import { getStorageShortName } from '@/utils/env'
import { createStorage as create } from './storage-cache'
import type { CreateStorageParams } from './storage-cache'

export type Options = Partial<CreateStorageParams>

function createOptions(storage: Storage, options: Options = {}): Options {
  return {
    storage,
    prefixKey: getStorageShortName(import.meta.env),
    ...options,
  }
}

export const WebStorage = create(createOptions(sessionStorage))

export function createStorage(storage: Storage = sessionStorage, options: Options = {}) {
  return create(createOptions(storage, options))
}

export function createSessionStorage(options: Options = {}) {
  return createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}

export function createLocalStorage(options: Options = {}) {
  return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
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
