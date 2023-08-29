import { request } from '@/utils/http'
import type {
  AddOrModOrDelFamilyMemberParams,
  DelFamilyMemberParams,
  GetNewTokenByRefreshTokenResult,
  GetUserInfoResult,
  ListFamilyMemberResult,
  LoginAccountParams,
  LoginAccountResult,
  ModifyResidentInfoParams,
  ResidentSelfRegistrationByH5Params,
  ResidentSelfRegistrationByH5Result,
  SendVerificationCodeParams,
  SendVerificationCodeResult,
} from './types'
import type { Result } from '#/axios'

enum Api {
  ResidentSelfRegistrationByH5 = '/ecomm-biz-http/icontrol/http/safety/mustering/v1.0/residentSelfRegistrationByH5',
  SendVerificationCode = '/cloud-user/user/comm/login/v1.0/sendCommVerificationCode',
  LoginAccount = '/cloud-user/user/comm/login/v1.0/loginAccount',
  GetResidentInfo = '/ecomm-biz-http/icontrol/http/safety/mustering/v1.0/getResidentInfo',
  Logout = '/cloud-user/user/comm/login/v1.0/logout',
  GetNewTokenByRefreshToken = '/cloud-user/user/comm/login/v1.0/getNewTokenByRefreshToken',
  AddOrModOrDelFamilyMember = '/ecomm-biz-http/icontrol/http/safety/mustering/v1.0/addOrModOrDelFamilyMember',
  ListFamilyMember = '/ecomm-biz-http/icontrol/http/safety/mustering/v1.0/listFamilyMember',
  ModifyResidentInfo = '/ecomm-biz-http/icontrol/http/safety/mustering/v1.0/modifyResidentInfo',
}

/**
 * @description: 发送验证码 api
 */
export function sendVerificationCodeApi(params: SendVerificationCodeParams) {
  return request.post<SendVerificationCodeResult>({
    url: Api.SendVerificationCode,
    params,
  })
}

/**
 * @description: 居民通过H5自注册 api
 */
export function residentSelfRegistrationByH5Api(params: ResidentSelfRegistrationByH5Params) {
  return request.post<Result<ResidentSelfRegistrationByH5Result>>(
    {
      url: Api.ResidentSelfRegistrationByH5,
      params,
    },
    { isTransformResponse: false },
  )
}

/**
 * @description: user login api
 */
export function loginAccountApi(params: LoginAccountParams) {
  return request.post<Result<LoginAccountResult>>(
    {
      url: Api.LoginAccount,
      params,
    },
    { isTransformResponse: false },
  )
}

/**
 * @description: getUserInfoApi
 */
export function getUserInfoApi(params: { userUuid: string }) {
  return request.post<GetUserInfoResult>({ url: Api.GetResidentInfo, params })
}

export function logoutApi(params: { token: string }) {
  return request.post({ url: Api.Logout, params })
}

export function getNewTokenByRefreshTokenApi(params: { refreshToken: string }) {
  return request.post<GetNewTokenByRefreshTokenResult>({
    url: Api.GetNewTokenByRefreshToken,
    params,
  })
}

/**
 * 添加家庭成员名称
 */
export function addOrModOrDelFamilyMemberApi<T = 'add'>(
  params: T extends 'del' ? DelFamilyMemberParams : AddOrModOrDelFamilyMemberParams,
) {
  return request.post({
    url: Api.AddOrModOrDelFamilyMember,
    params,
  })
}

/**
 * 获取当前居民家庭成员列表
 */
export function listFamilyMemberApi(params: { userUuid: string }) {
  return request.post<ListFamilyMemberResult>({
    url: Api.ListFamilyMember,
    params,
  })
}

/**
 * 修改居民自注册信息
 */
export function modifyResidentInfoApi(params: ModifyResidentInfoParams) {
  return request.post<{ userUuid: string }>({
    url: Api.ModifyResidentInfo,
    params,
  })
}
