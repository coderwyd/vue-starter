import type { ListResult } from '#/axios'

interface BasicUserInfo {
  userUuid: string
  firstName: string
  lastName: string
}

export enum ContactTypeEnum {
  SMS = 1,
  EMAIL = 2,
}

/**
 * @description: Send Verification Code interface parameters
 */
export interface SendVerificationCodeParams {
  contactAccount: string | number
  contactType: ContactTypeEnum
  codeType: number
  language?: string
  customerId?: number
}

/**
 * @description: Send Verification Code interface return value
 */
export interface SendVerificationCodeResult {
  contactAccount: string
  contactType: ContactTypeEnum
  codeType: number
  language?: string
  customerId?: number
}

interface AddressInfo {
  lon: number
  lat: number
  country: string
  city: string
  state: string
  zipCode: string
  address: string
}

interface ContactInformation {
  cellphone: string
  email: string
}

type BasicInformation = Omit<BasicUserInfo, 'userUuid'>

/**
 * @description: Send Verification Code interface parameters
 */
export interface ResidentSelfRegistrationByH5Params {
  source: number
  contactAccount: string
  codeType: number
  workspaceId: number
  verificationCode: string
  basicInformation: BasicInformation
  addressInfo: AddressInfo[]
  contactInformation: ContactInformation
}

/**
 * @description: 注册 interface return value
 */
export interface ResidentSelfRegistrationByH5Result {
  userUuid: string
  accountName: string
}

/**
 * @description: login interface parameters
 */
export interface LoginAccountParams {
  accountName: string
  loginType: number
  workspaceId?: number
  token: string
  device: {
    deviceType: number
    deviceName: string
    deviceModel: string
  }
}

interface RefreshToken {
  expiration: number
  value: string
}

interface OauthTokenVo {
  additionalInformation?: any
  expiration: number
  expired: boolean
  expiresIn: number
  refreshToken: RefreshToken
  scope: any[]
  tokenType: string
  value: string
}

/**
 * @description: login interface return value
 */
export interface LoginAccountResult {
  beatTim: number
  eocEventShareId: number
  loginType: number
  manageUserUid: string
  oauthTokenVo: OauthTokenVo
  userId: number
  userName: string
  userUuid: string
  workspaceId: number
}
interface FamilyMember extends BasicUserInfo {
  relationship: number
  cellPhone: string
  email: string
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoResult extends BasicUserInfo {
  address: string[]
  email: string
  cellPhone: string
  familyMember: FamilyMember[]
  realName: string
  addressInfo: {
    lat: string
    lon: string
  }
}

/**
 * @description: refresh token information return value
 */
export interface GetNewTokenByRefreshTokenResult {
  refreshToken: string
  refreshTokenExpiration: number
  token: string
  expiration: number
}

export enum ModFamilyMemberTypeEnum {
  ADD = 1, // 新增家庭成员   为主账号userUuid
  EDIT = 2, // 编辑家庭成员  为家庭成员userUuid
  DELETE = 3,
}

export interface AddOrModOrDelFamilyMemberParams extends BasicUserInfo {
  type: ModFamilyMemberTypeEnum
}

export interface DelFamilyMemberParams {
  type: ModFamilyMemberTypeEnum
  userUuid: string
}

export type ListFamilyMemberResult = ListResult<BasicUserInfo>

export interface ModifyResidentInfoParams {
  userUuid: string
  basicInformation?: BasicInformation
  addressInfo?: AddressInfo[]
  contactInformation?: ContactInformation
  familyMember?: FamilyMember[]
}
