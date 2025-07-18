/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      current: number
      size: number
      total: number
    }

    interface CommonSearchParams
      extends Pick<Common.PaginatingCommonParams, 'current' | 'size'> {
      pageSwitch?: 0 | 1
      orderBy?: { column: string; asc: boolean }[]
    }

    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      list: T[]
    }

    interface QueryRecord<T = any> {
      list: T[]
    }
  }
}

/** Service namespace */
namespace Service {
  interface Response<T = any> {
    data: T
    message: string
    resultCode: string
    resultDesc: string
    timestamp: number
  }
}
