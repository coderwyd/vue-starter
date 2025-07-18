/**
 * @description: login interface parameters
 */
export interface LoginAccountParams {
  accountName: string
  loginType: number
  workspaceId?: number
  password: string
}

/**
 * @description: login interface return value
 */
export interface LoginAccountResult {
  loginType: number
  userName: string
  userUuid: string
  oauthTokenVo: {
    value: string
    refreshToken: {
      value: string
    }
  }
}

export type GetUserInfoResult = object
