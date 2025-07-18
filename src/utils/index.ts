export function noop() {}

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  appendUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function appendUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj) parameters += `${key}=${encodeURIComponent(obj[key])}&`

  parameters = parameters.replace(/&$/, '')
  return baseUrl.endsWith('?')
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, '?') + parameters
}

/**
 * Get error message from an error object. If the error object is not an instance of Error,
 * it will be converted to string and returned.
 * 从错误对象中获取错误信息。如果错误对象不是 Error 的实例，
 * 则会将其转换为字符串并返回。
 *
 * @param error The error object to extract error message from. 用于提取错误信息的错误对象。
 * @returns The error message string. 错误信息字符串。
 */
export function getErrorMessage(error): string {
  if (error instanceof Error) return error.message
  else return String(error)
}

// dynamic use hook props
export function getDynamicProps<T extends object, U>(props: T): Partial<U> {
  const ret: Recordable = {}

  Object.keys(props).forEach((key) => {
    ret[key] = unref((props as Recordable)[key])
  })

  return ret as Partial<U>
}

/**
 * Create a cached version of a pure function.
 */
export function cached(fn: (str: string) => string) {
  const cache = Object.create(null)
  return function cachedFn(str: string): string {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  return str.replaceAll(camelizeRE, (_, c) => c.toUpperCase())
})

const underlineRE = /([A-Z])/g
export const underline = cached((str: string): string => {
  return str.replaceAll(underlineRE, '_$1').toUpperCase()
})

const kebabCaseRE = /([A-Z])/g
export const kebabCase = cached((str: string): string => {
  return str.replaceAll(kebabCaseRE, '-$1').toUpperCase()
})

export function replaceTemplate(tpl: string, context?: Record<string, string>) {
  const regex = /\{\{([^{}]+)\}\}|\{([^{}]+)\}/g
  try {
    return tpl.replaceAll(regex, (match, doubleCurly, singleCurly) => {
      if (doubleCurly !== undefined) {
        return context?.[doubleCurly.trim()] ?? match
      }
      if (singleCurly !== undefined) {
        return context?.[singleCurly.trim()] ?? match
      }
      return match
    })
  } catch {
    return tpl
  }
}

export function delay(waitTime: number) {
  return new Promise((resolve) => setTimeout(resolve, waitTime))
}

/**
 * @param { Promise } promise
 * @param {object=} errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function awaitTo<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object,
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((error: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, error, errorExt)
        return [parsedError, undefined]
      }

      return [error, undefined]
    })
}
