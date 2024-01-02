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
import { ResultEnum } from '@/enums/httpEnum'
import { PageEnum } from '@/enums/pageEnum'
import { router } from '@/router'
import { store } from '@/store'
import { getAuthCache, setAuthCache } from '@/utils/auth'
import { ss } from '@/utils/cache'
import type { GetUserInfoResult, LoginAccountParams } from '@/api/user/types'

interface UserState {
  userInfo: Nullable<GetUserInfoResult>
  accessToken?: string
  refreshToken?: string
  userUuid?: string
  lastUpdateTime: number
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: null,
    accessToken: undefined,
    refreshToken: undefined,
    userUuid: undefined,
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(state): GetUserInfoResult {
      return (
        state.userInfo || getAuthCache<GetUserInfoResult>(USER_INFO_KEY) || {}
      )
    },
    getAccessToken(state) {
      return state.accessToken || getAuthCache<string>(ACCESS_TOKEN_KEY)
    },
    getRefreshToken(state) {
      return state.refreshToken || getAuthCache<string>(REFRESH_TOKEN_KEY)
    },
    getUserUuid(state) {
      return state.userUuid || getAuthCache<string>(USER_UUID_KEY)
    },
    getLastUpdateTime(state) {
      return state.lastUpdateTime
    },
  },
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
      this.lastUpdateTime = new Date().getTime()
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
      const { resultCode, message, data } = await loginAccountApi(loginParams)
      if (resultCode === ResultEnum.SUCCESS) {
        const { oauthTokenVo, userUuid } = data
        this.setAccessToken(oauthTokenVo.value)
        this.setRefreshToken(oauthTokenVo.refreshToken.value)
        this.setUserUuid(userUuid)
        return this.afterLoginAction(goHome)
      }
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        resultCode,
        message,
      })
    },
    async afterLoginAction(
      goHome?: boolean,
    ): Promise<Nullable<GetUserInfoResult>> {
      if (!this.getAccessToken) return null
      const userInfo = await this.getUserInfoAction()
      goHome && (await router.replace(PageEnum.BASE_HOME))
      return userInfo
    },
    async getUserInfoAction(): Promise<Nullable<GetUserInfoResult>> {
      if (!this.getAccessToken || !this.getUserUuid) return null

      const userInfo = await getUserInfoApi({
        userUuid: this.getUserUuid,
      })

      userInfo.realName = `${userInfo.firstName} ${userInfo.lastName}`
      this.setUserInfo(userInfo)
      return userInfo
    },
    async doRefreshToken() {
      const data = await getNewTokenByRefreshTokenApi({
        refreshToken: this.getRefreshToken,
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
      if (this.getAccessToken) {
        try {
          await logoutApi({
            token: this.getAccessToken,
          })
        } catch {
          console.log('logout error')
        }
      }
      this.setAccessToken(undefined)
      this.setRefreshToken(undefined)
      this.setUserInfo(null)
      ss.set('operationType', 'signIn')
      goLogin && router.push(PageEnum.BASE_HOME)
    },
  },
})

export function useUserStoreWithOut() {
  return useUserStore(store)
}
