export type LocaleType = 'cg_PL' | 'en_US' | 'pt_BR'

export interface LocaleSetting {
  // Current language
  locale: LocaleType
  // default language
  fallback: LocaleType
  // available Locales
  availableLocales: LocaleType[]
}
export interface LocalePickerItem {
  text: string
  locale: LocaleType
}

export interface GlobConfig {
  // Site title
  title: string
  // Service interface url
  apiUrl: string
  // Upload url
  uploadUrl?: string
  // Project abbreviation
  shortName: string
}
export interface GlobEnvConfig {
  // Site title
  VITE_GLOB_APP_TITLE: string;
  // Service interface url
  VITE_GLOB_API_URL: string;
  // Upload url
  VITE_GLOB_UPLOAD_URL?: string;
}
