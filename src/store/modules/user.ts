import { defineStore } from 'pinia'
import {
  getNewTokenByRefreshTokenApi,
  getUserInfoApi,
  loginAccountApi,
  logoutApi,
} from '@/api/user'
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_INFO_KEY,
  USER_UUID_KEY,
} from '@/enums/cacheEnum'
import { router } from '@/router'
import { store } from '@/store'
import { setAuthCache } from '@/utils/auth'
import { ss } from '@/utils/cache'
import type { GetUserInfoResult, LoginAccountParams } from '@/api/user/types'

interface UserState {
  userInfo: Nullable<GetUserInfoResult>
  accessToken?: string
  refreshToken?: string
  userUuid?: string
  lastUpdateTime: number
}

export const useUserStore = defineStore('app-user', {
  state: (): UserState => ({
    userInfo: null,
    accessToken: undefined,
    refreshToken: undefined,
    userUuid: undefined,
    lastUpdateTime: 0,
  }),
  actions: {
    setAccessToken(info: string | undefined) {
      this.accessToken = info || ''
      setAuthCache(ACCESS_TOKEN_KEY, info)
    },
    setRefreshToken(info: string | undefined) {
      this.refreshToken = info || ''
      setAuthCache(REFRESH_TOKEN_KEY, info)
    },
    setUserUuid(info: string | undefined) {
      this.userUuid = info || ''
      setAuthCache(USER_UUID_KEY, info)
    },
    setUserInfo(info: GetUserInfoResult | null) {
      this.userInfo = info
      this.lastUpdateTime = Date.now()
      setAuthCache(USER_INFO_KEY, info)
    },
    resetState() {
      this.userInfo = null
      this.accessToken = ''
      this.refreshToken = ''
      this.userUuid = ''
    },
    /**
     * @description: login
     */
    async login(
      params: LoginAccountParams & {
        goHome?: boolean
      },
    ): Promise<Nullable<GetUserInfoResult>> {
      const { goHome = true, ...loginParams } = params
      const { oauthTokenVo, userUuid } = await loginAccountApi(loginParams)
      // if (resultCode === ResultEnum.SUCCESS) {
      this.setAccessToken(oauthTokenVo.value)
      this.setRefreshToken(oauthTokenVo.refreshToken.value)
      this.setUserUuid(userUuid)
      return this.afterLoginAction(goHome)
      // }

      // return Promise.reject({
      //   resultCode,
      //   message,
      // })
    },
    async afterLoginAction(
      goHome?: boolean,
    ): Promise<Nullable<GetUserInfoResult>> {
      if (!this.accessToken) return null
      const userInfo = await this.getUserInfoAction()
      if (goHome) {
        await router.replace('/home')
      }
      return userInfo
    },
    async getUserInfoAction(): Promise<Nullable<GetUserInfoResult>> {
      const userInfo = await getUserInfoApi({
        userUuid: this.userUuid,
      })

      this.setUserInfo(userInfo)
      return userInfo
    },
    async doRefreshToken() {
      const data = await getNewTokenByRefreshTokenApi({
        refreshToken: this.refreshToken!,
      })
      const { token, refreshToken } = data
      this.setAccessToken(token)
      this.setRefreshToken(refreshToken)
      return data
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.accessToken) {
        try {
          await logoutApi({
            token: this.accessToken,
          })
        } catch {
          console.log('logout error')
        }
      }
      this.setAccessToken(undefined)
      this.setRefreshToken(undefined)
      this.setUserInfo(null)
      ss.set('operationType', 'signIn')
      if (goLogin) {
        router.push('/home')
      }
    },
  },
})

export function useUserStoreWithOut() {
  return useUserStore(store)
}
