import type { AxiosError, AxiosInstance } from 'axios'
import { delay } from '@/utils'

/**
 *  请求重试机制
 */

export class AxiosRetry {
  /**
   * 重试
   */
  retry(axiosInstance: AxiosInstance, error: AxiosError) {
    const { config } = (error.response ?? error) as Recordable
    const { waitTime, count } = config?.requestOptions?.retryRequest ?? {}
    config.__retryCount = config.__retryCount || 0
    if (config.__retryCount >= count) return Promise.reject(error)

    config.__retryCount += 1
    delete config.headers
    return delay(waitTime).then(() => axiosInstance(config))
  }
}
