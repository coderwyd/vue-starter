import type { ErrorTypeEnum } from '@/enums/exceptionEnum'
import type { GetUserInfoResult } from '@/api/user/types'

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum
  // Error file
  file: string
  // Error name
  name?: string
  // Error message
  message: string
  // Error stack
  stack?: string
  // Error detail
  detail: string
  // Error url
  url: string
  // Error time
  time?: string
}

export type UserInfo = GetUserInfoResult
