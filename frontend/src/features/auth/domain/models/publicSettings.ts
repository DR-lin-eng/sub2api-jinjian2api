import type { CustomMenuItem } from './customMenuItem'
import type { CustomEndpoint } from './customEndpoint'
import type { LoginAgreementDocument } from './loginAgreementDocument'

export class PublicSettings {
  registrationEnabled!: boolean
  emailVerifyEnabled!: boolean
  forceEmailOnThirdPartySignup!: boolean
  registrationEmailSuffixWhitelist!: string[]
  promoCodeEnabled!: boolean
  passwordResetEnabled!: boolean
  invitationCodeEnabled!: boolean
  turnstileEnabled!: boolean
  turnstileSiteKey!: string
  recaptchaEnabled!: boolean
  recaptchaSiteKey!: string
  capEnabled!: boolean
  capApiEndpoint!: string
  siteName!: string
  siteLogo!: string
  siteSubtitle!: string
  apiBaseUrl!: string
  contactInfo!: string
  docUrl!: string
  homeContent!: string
  hideCcsImportButton!: boolean
  paymentEnabled!: boolean
  riskControlEnabled!: boolean
  tableDefaultPageSize!: number
  tablePageSizeOptions!: number[]
  customMenuItems!: CustomMenuItem[]
  customEndpoints!: CustomEndpoint[]
  linuxdoOauthEnabled!: boolean
  wechatOauthEnabled!: boolean
  oidcOauthEnabled!: boolean
  oidcOauthProviderName!: string
  githubOauthEnabled!: boolean
  googleOauthEnabled!: boolean
  backendModeEnabled!: boolean
  version!: string
  balanceLowNotifyEnabled!: boolean
  accountQuotaNotifyEnabled!: boolean
  balanceLowNotifyThreshold!: number
  channelMonitorEnabled!: boolean
  channelMonitorDefaultIntervalSeconds!: number
  availableChannelsEnabled!: boolean
  serviceQuotaEnabled!: boolean
  affiliateEnabled!: boolean
  // optional fields
  loginAgreementEnabled?: boolean
  loginAgreementMode?: 'modal' | 'checkbox' | string
  loginAgreementUpdatedAt?: string
  loginAgreementRevision?: string
  loginAgreementDocuments?: LoginAgreementDocument[]
  localCaptchaEnabled?: boolean
  dingtalkOauthEnabled?: boolean
  wechatOauthOpenEnabled?: boolean
  wechatOauthMpEnabled?: boolean
  wechatOauthMobileEnabled?: boolean
  serverTimezone?: string
  serverUtcOffset?: string
  allowUserViewErrorRequests?: boolean
  allowUserViewUsageDetails?: boolean
}
