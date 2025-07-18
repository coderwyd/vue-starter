import axios from 'axios'
import { handleRefreshToken } from './shared'
// import BASE_URL from '@/api/base'
// import { useLoadingStoreWithOut } from '@/store'
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  // InternalAxiosRequestConfig,
} from 'axios'
// import { session } from '../cache'

enum ResultEnum {
  EXPIRED = '10008',
}

type RefreshRequestQueue = (config: AxiosRequestConfig) => void

export default class CustomAxiosInstance {
  private instance: AxiosInstance

  private waitingQueue: RefreshRequestQueue[]
  private isRefreshing: boolean

  constructor() {
    this.instance = axios.create({
      // baseURL: BASE_URL,
      timeout: 60 * 1_000,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
    })
    this.isRefreshing = false
    this.waitingQueue = []
    this.setInterceptor()
  }

  private setInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
        if (!window.navigator.onLine) {
          return Promise.reject(new Error('Network Error.'))
        }
        // const accessStore = useUserStoreWithOut()
        // config.showLoading ??= true
        // if (config.showLoading) {
        //   const loadingStore = useLoadingStoreWithOut()
        //   loadingStore.increaseLoadingCount()
        // }

        // const getAccessToken = accessStore.getAccessToken

        // if (getAccessToken) {
        //   config.data = {
        //     ...config.data,
        //     token: getAccessToken,
        //     sourceId: session.get('authFrom') ? 35 : undefined,
        //   }
        //   config.headers.token = getAccessToken
        // }

        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    )

    this.instance.interceptors.response.use(
      async (response: AxiosResponse<Service.Response>) => {
        const { data: responseData, status, request, config } = response
        const { resultCode, data } = responseData
        // if (config.showLoading) {
        // const loadingStore = useLoadingStoreWithOut()
        // loadingStore.decreaseLoadingCount()
        // }

        if (['arraybuffer', 'blob'].includes(request.responseType)) {
          return data
        }
        if (status === 200 && resultCode === '1') {
          return data
        }
        if (response.data.resultCode === ResultEnum.EXPIRED) {
          return await this.refreshTokenAfterResponse(config)
        }
        return Promise.reject(responseData)
      },
      (error: any) => {
        // const loadingStore = useLoadingStoreWithOut()
        // loadingStore.decreaseLoadingCount()
        if (axios.isCancel(error)) {
          return Promise.reject(error)
        }

        return Promise.reject(error)
      },
    )
  }

  private async refreshTokenAfterResponse(
    config: InternalAxiosRequestConfig<any>,
  ) {
    const originRequest = new Promise((resolve) => {
      this.waitingQueue.push((refreshConfig: AxiosRequestConfig) => {
        const { token } = refreshConfig.data
        config.headers.token = token
        config.data = { ...refreshConfig.data, token }
        resolve(this.instance.request(config))
      })
    })
    if (!this.isRefreshing) {
      this.isRefreshing = true
      const refreshConfig = await handleRefreshToken(config)
      if (refreshConfig) {
        this.waitingQueue.map((cb) => cb(refreshConfig))
      }
      this.waitingQueue = []
      this.isRefreshing = false
    }
    return originRequest
  }

  /**
   * DELETE请求方法
   */
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' })
  }

  /**
   * GET请求方法
   */
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' })
  }

  /**
   * POST请求方法
   */
  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'POST' })
  }

  /**
   * PUT请求方法
   */
  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'PUT' })
  }

  /**
   * 通用的请求方法
   */
  public async request<T>(url: string, config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance({
        url,
        ...config,
      })
      return response as T
    } catch (error: any) {
      throw error.response ? error.response.data : error
    }
  }
}
