type ViteCompression =
  | 'none'
  | 'gzip'
  | 'brotli'
  | 'both'

declare interface ViteEnv {
  VITE_PUBLIC_PATH: string
  VITE_GLOB_APP_TITLE: string;
  VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
}
