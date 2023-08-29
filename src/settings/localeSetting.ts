import type { LocalePickerItem, LocaleSetting, LocaleType } from '#/config'

export const LOCALE: { [key: string]: LocaleType } = {
  CG_PL: 'cg_PL',
  EN_US: 'en_US',
  PT_BR: 'pt_BR',
}

export const localeSetting: LocaleSetting = {
  locale: LOCALE.EN_US, // current
  fallback: LOCALE.EN_US, // default
  availableLocales: [LOCALE.CG_PL, LOCALE.EN_US, LOCALE.PT_BR], // 支持的语言
}

// 提供给用户选择的语言
export const localeList: LocalePickerItem[] = [
  {
    text: 'English',
    locale: LOCALE.EN_US,
  },
  {
    text: 'Português',
    locale: LOCALE.PT_BR,
  },
]
