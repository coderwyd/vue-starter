import { getNewTokenByRefreshTokenApi } from '@/api/user'
import { useUserStoreWithOut } from '@/store/modules/user'
import { awaitTo } from '..'
import type { AxiosRequestConfig } from 'axios'
/**
 * @param axiosConfig - request config when the token is expired
 */
export async function handleRefreshToken(axiosConfig: AxiosRequestConfig) {
  const userStore = useUserStoreWithOut()

  const [error, data] = await awaitTo(
    getNewTokenByRefreshTokenApi({
      refreshToken: userStore.refreshToken!,
    }),
  )
  if (!error) {
    userStore.setAccessToken(data.token)
    userStore.setRefreshToken(data.refreshToken)

    const config = { ...axiosConfig }
    if (config.headers) {
      config.headers.token = data.token
    }

    config.data = { ...JSON.parse(config.data), token: data.token }

    return config
  }
  userStore.resetState()
  return null
}
