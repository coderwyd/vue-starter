import axios from 'axios'
import { clone, isString } from 'lodash-es'
import { ContentTypeEnum, RequestEnum, ResultEnum } from '@/enums/httpEnum'
import { appendUrlParams, deepMerge } from '@/utils'
import { useGlobSetting } from '@/hooks/useGlobSetting'
import { VAxios } from './Axios'
import { AxiosRetry } from './axios-retry'
import { formatRequestDate, joinTimestamp } from './helper'
import type { AxiosTransform, CreateAxiosOptions } from './axios-transform'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { RequestOptions, Result } from '#/axios'

const globSetting = useGlobSetting()

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (
    res: AxiosResponse<Result>,
    options: RequestOptions,
  ) => {
    const { isTransformResponse, isReturnNativeResponse } = options
    if (['blob', 'arraybuffer'].includes(res.request.responseType))
      return res.data

    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) return res

    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) return res.data

    const { resultCode, data: result } = res.data
    const hasSuccess =
      res.data &&
      Reflect.has(res.data, 'resultCode') &&
      resultCode === ResultEnum.SUCCESS
    if (hasSuccess) return result
    throw new Error('The interface request failed, please try again later!')
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinParamsToUrl, formatDate, joinTime = true } = options

    if (apiUrl && isString(apiUrl)) config.url = `${apiUrl}${config.url}`

    const params = config.params || {}
    const data = config.data || false
    formatDate && data && !isString(data) && formatRequestDate(data)
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(
          params || {},
          joinTimestamp(joinTime, false),
        )
      } else {
        // 兼容restful风格
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params)
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          (Object.keys(config.data).length > 0 ||
            config.data instanceof FormData)
        ) {
          config.data = data
          config.params = params
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params
          config.params = undefined
        }
        if (joinParamsToUrl) {
          config.url = appendUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          )
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    const userStore = useUserStoreWithOut()
    const token = userStore.getAccessToken

    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      config.headers.token = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token
    }
    config.data = { token, ...config.data }
    return config
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
    const { config } = error || {}
    const err: string = error?.toString?.() ?? ''
    let errMessage = ''
    if (axios.isCancel(error)) return Promise.reject(error)

    try {
      if (err?.includes('Network Error'))
        errMessage =
          'Please check if your network connection is normal! The network is abnormal.'

      if (errMessage) {
        // 弹窗显示
        // showFailToast(errMessage)
        return Promise.reject(error)
      }
    } catch (error) {
      throw new Error(error as unknown as string)
    }
    const retryRequest = new AxiosRetry()
    const { isOpenRetry } = config.requestOptions.retryRequest
    if (isOpenRetry) return retryRequest.retry(axiosInstance, error)

    return Promise.reject(error)
  },
}

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    // 深度合并
    deepMerge(
      {
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 10 * 1000,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 数据处理方式
        transform: clone(transform),
        noSenseSwitchOn: true,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'none',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          //  是否加入时间戳 ?_t=xxx
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          retryRequest: {
            isOpenRetry: true,
            count: 3,
            waitTime: 100,
          },
        },
      },
      opt || {},
    ),
  )
}
export const request = createAxios()

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//     urlPrefix: 'xxx',
//   },
// });
