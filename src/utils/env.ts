import { useGlobSetting } from '@/hooks/useGlobSetting'
import pkg from '../../package.json'
import type { GlobEnvConfig } from '#/config'

function getCommonStoragePrefix() {
  const { shortName } = useGlobSetting()
  return `${shortName}_${getEnv()}`.toUpperCase()
}

export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`_${pkg.version}`}_`.toUpperCase()
}

export function getAppEnvConfig(): GlobEnvConfig {
  const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_UPLOAD_URL }
    = import.meta.env

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_UPLOAD_URL,
  }
}

/**
 * @description: Development mode
 */
export const devMode = 'development'

/**
 * @description: Production mode
 */
export const prodMode = 'production'

/**
 * @description: Get environment variables
 */
export function getEnv(): string {
  return import.meta.env.MODE
}

/**
 * @description: Is it a development mode
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV
}

/**
 * @description: Is it a production mode

 */
export function isProdMode(): boolean {
  return import.meta.env.PROD
}
