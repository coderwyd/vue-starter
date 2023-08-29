import { ACCESS_TOKEN_KEY, CacheTypeEnum, REFRESH_TOKEN_KEY } from '@/enums/cacheEnum'
import projectSetting from '@/settings/projectSetting'
import { ls, ss } from '@/utils/cache'
import type { USER_INFO_KEY, USER_UUID_KEY } from '@/enums/cacheEnum'
import type { UserInfo } from '#/store'

const { permissionCacheType } = projectSetting
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL

interface BasicStore {
  [ACCESS_TOKEN_KEY]: string | number | null | undefined
  [REFRESH_TOKEN_KEY]: string | number | null | undefined
  [USER_UUID_KEY]: string | number | null | undefined
  [USER_INFO_KEY]: UserInfo
}

export type BasicKeys = keyof BasicStore

export function getAccessToken() {
  return getAuthCache(ACCESS_TOKEN_KEY)
}

export function setAccessToken(value: string) {
  return setAuthCache(ACCESS_TOKEN_KEY, value)
}

export function getRefreshToken() {
  return getAuthCache(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(value: string) {
  return setAuthCache(REFRESH_TOKEN_KEY, value)
}

export function getAuthCache<T>(key: BasicKeys) {
  return (isLocal ? ls.get(key) : ss.get(key)) as T
}

export function setAuthCache(key: BasicKeys, value: unknown) {
  return isLocal ? ls.set(key, value) : ss.set(key, value)
}

export function clearAuthCache() {
  return isLocal ? ls.clear() : ss.clear()
}
