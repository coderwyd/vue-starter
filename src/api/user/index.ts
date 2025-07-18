import { http } from '@/utils/http'
import type { LoginAccountParams, LoginAccountResult } from './types'

enum Api {
  Login = '/v1.0/login',
  GetNewTokenByRefreshToken = '/v1.0/getNewTokenByRefreshToken',
  GetUserInfo = '/v1.0/getUserInfo',
  Logout = '/v1.0/logout',
}

/**
 * @description: 发送验证码 api
 */
export function loginAccountApi(data: LoginAccountParams) {
  return http.post<LoginAccountResult>(Api.Login, {
    data,
  })
}

/**
 * 获取新的token
 */
export function getNewTokenByRefreshTokenApi(data: { refreshToken: string }) {
  return http.request<{ token: string; refreshToken: string }>(
    Api.GetNewTokenByRefreshToken,
    { data },
  )
}

export function getUserInfoApi(data) {
  return http.request<{ token: string; refreshToken: string }>(
    Api.GetUserInfo,
    { data },
  )
}

/**
 * 获取新的token
 */
export function logoutApi(data) {
  return http.request<{ token: string; refreshToken: string }>(Api.Logout, {
    data,
  })
}
