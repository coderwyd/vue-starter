type ViteCompression =
  | 'none'
  | 'gzip'
  | 'brotli'
  | 'both'
  | 'gzip-clear'
  | 'brotli-clear'
  | 'both-clear'

declare interface ViteEnv {
  VITE_PORT: number
  VITE_PUBLIC_PATH: string
  VITE_GLOB_APP_TITLE: string
  VITE_GLOB_APP_SHORT_NAME: string
  VITE_DROP_CONSOLE: boolean
  VITE_BUILD_COMPRESS: ViteCompression
  // CG_CI_WEBAPP_PUBLIC_PATH : string
}
