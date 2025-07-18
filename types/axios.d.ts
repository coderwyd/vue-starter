import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    showLoading?: boolean
  }
}
