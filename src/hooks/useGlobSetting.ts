import { getAppEnvConfig } from '@/utils/env'
import type { GlobConfig } from '#/config'

export function useGlobSetting(): Readonly<GlobConfig> {
  const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_UPLOAD_URL }
    = getAppEnvConfig()

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_TITLE.replaceAll(/\s/g, '_').replaceAll('-', '_'),
    uploadUrl: VITE_GLOB_UPLOAD_URL,
  }
  return glob as Readonly<GlobConfig>
}
