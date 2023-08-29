import { warn } from '@/utils/log'
import pkg from '../../package.json'
import type { GlobConfig, GlobEnvConfig } from '#/config'

export function getCommonStoragePrefix(env: Recordable<any>) {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppConfig(env)
  return `${VITE_GLOB_APP_SHORT_NAME}_${env.MODE}`.toUpperCase()
}

export function getStorageShortName(env: Recordable<any>) {
  return `${getCommonStoragePrefix(env)}${`_${pkg.version}`}_`.toUpperCase()
}

export function getGlobalConfig(env: Recordable<any>): Readonly<GlobConfig> {
  const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_APP_SHORT_NAME } = getAppConfig(env)

  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
  }
  return glob as Readonly<GlobConfig>
}

function getAppConfig(env: Recordable<any>) {
  const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_APP_SHORT_NAME, VITE_GLOB_UPLOAD_URL }
    = env
  const PROD_ENV = {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_UPLOAD_URL,
  }
  const ENV = (env.DEV ? env : PROD_ENV) as GlobEnvConfig

  if (!/^[A-Z_a-z]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      'VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.',
    )
  }

  return ENV
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
