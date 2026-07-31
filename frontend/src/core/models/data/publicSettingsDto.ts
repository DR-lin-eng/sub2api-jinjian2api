import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { PublicSettings } from '@/core/models/domain/publicSettings'
import { CustomMenuItemDto } from '@/core/models/data/customMenuItemDto'
import { CustomEndpointDto } from '@/core/models/data/customEndpointDto'
import { LoginAgreementDocumentDto } from '@/core/models/data/loginAgreementDocumentDto'

export class PublicSettingsDto {
  @Expose({ name: 'registration_enabled' })
  @Transform(({ value }) => value ?? false)
  registrationEnabled!: boolean

  @Expose({ name: 'email_verify_enabled' })
  @Transform(({ value }) => value ?? false)
  emailVerifyEnabled!: boolean

  @Expose({ name: 'force_email_on_third_party_signup' })
  @Transform(({ value }) => value ?? false)
  forceEmailOnThirdPartySignup!: boolean

  @Expose({ name: 'registration_email_suffix_whitelist' })
  @Transform(({ value }) => value ?? [])
  registrationEmailSuffixWhitelist!: string[]

  @Expose({ name: 'promo_code_enabled' })
  @Transform(({ value }) => value ?? false)
  promoCodeEnabled!: boolean

  @Expose({ name: 'password_reset_enabled' })
  @Transform(({ value }) => value ?? false)
  passwordResetEnabled!: boolean

  @Expose({ name: 'invitation_code_enabled' })
  @Transform(({ value }) => value ?? false)
  invitationCodeEnabled!: boolean

  @Expose({ name: 'turnstile_enabled' })
  @Transform(({ value }) => value ?? false)
  turnstileEnabled!: boolean

  @Expose({ name: 'turnstile_site_key' })
  @Transform(({ value }) => value ?? '')
  turnstileSiteKey!: string

  @Expose({ name: 'recaptcha_enabled' })
  @Transform(({ value }) => value ?? false)
  recaptchaEnabled!: boolean

  @Expose({ name: 'recaptcha_site_key' })
  @Transform(({ value }) => value ?? '')
  recaptchaSiteKey!: string

  @Expose({ name: 'cap_enabled' })
  @Transform(({ value }) => value ?? false)
  capEnabled!: boolean

  @Expose({ name: 'cap_api_endpoint' })
  @Transform(({ value }) => value ?? '')
  capApiEndpoint!: string

  @Expose({ name: 'site_name' })
  @Transform(({ value }) => value ?? '')
  siteName!: string

  @Expose({ name: 'site_logo' })
  @Transform(({ value }) => value ?? '')
  siteLogo!: string

  @Expose({ name: 'site_subtitle' })
  @Transform(({ value }) => value ?? '')
  siteSubtitle!: string

  @Expose({ name: 'api_base_url' })
  @Transform(({ value }) => value ?? '')
  apiBaseUrl!: string

  @Expose({ name: 'contact_info' })
  @Transform(({ value }) => value ?? '')
  contactInfo!: string

  @Expose({ name: 'doc_url' })
  @Transform(({ value }) => value ?? '')
  docUrl!: string

  @Expose({ name: 'home_content' })
  @Transform(({ value }) => value ?? '')
  homeContent!: string

  @Expose({ name: 'hide_ccs_import_button' })
  @Transform(({ value }) => value ?? false)
  hideCcsImportButton!: boolean

  @Expose({ name: 'payment_enabled' })
  @Transform(({ value }) => value ?? false)
  paymentEnabled!: boolean

  @Expose({ name: 'risk_control_enabled' })
  @Transform(({ value }) => value ?? false)
  riskControlEnabled!: boolean

  @Expose({ name: 'table_default_page_size' })
  @Transform(({ value }) => value ?? 20)
  tableDefaultPageSize!: number

  @Expose({ name: 'table_page_size_options' })
  @Transform(({ value }) => value ?? [10, 20, 50, 100])
  tablePageSizeOptions!: number[]

  @Expose({ name: 'custom_menu_items' })
  @Type(() => CustomMenuItemDto)
  @Transform(({ value }) => value ?? [])
  customMenuItems!: CustomMenuItemDto[]

  @Expose({ name: 'custom_endpoints' })
  @Type(() => CustomEndpointDto)
  @Transform(({ value }) => value ?? [])
  customEndpoints!: CustomEndpointDto[]

  @Expose({ name: 'linuxdo_oauth_enabled' })
  @Transform(({ value }) => value ?? false)
  linuxdoOauthEnabled!: boolean

  @Expose({ name: 'wechat_oauth_enabled' })
  @Transform(({ value }) => value ?? false)
  wechatOauthEnabled!: boolean

  @Expose({ name: 'oidc_oauth_enabled' })
  @Transform(({ value }) => value ?? false)
  oidcOauthEnabled!: boolean

  @Expose({ name: 'oidc_oauth_provider_name' })
  @Transform(({ value }) => value ?? '')
  oidcOauthProviderName!: string

  @Expose({ name: 'github_oauth_enabled' })
  @Transform(({ value }) => value ?? false)
  githubOauthEnabled!: boolean

  @Expose({ name: 'google_oauth_enabled' })
  @Transform(({ value }) => value ?? false)
  googleOauthEnabled!: boolean

  @Expose({ name: 'backend_mode_enabled' })
  @Transform(({ value }) => value ?? false)
  backendModeEnabled!: boolean

  @Expose()
  @Transform(({ value }) => value ?? '')
  version!: string

  @Expose({ name: 'balance_low_notify_enabled' })
  @Transform(({ value }) => value ?? false)
  balanceLowNotifyEnabled!: boolean

  @Expose({ name: 'account_quota_notify_enabled' })
  @Transform(({ value }) => value ?? false)
  accountQuotaNotifyEnabled!: boolean

  @Expose({ name: 'balance_low_notify_threshold' })
  @Transform(({ value }) => value ?? 0)
  balanceLowNotifyThreshold!: number

  @Expose({ name: 'channel_monitor_enabled' })
  @Transform(({ value }) => value ?? false)
  channelMonitorEnabled!: boolean

  @Expose({ name: 'channel_monitor_default_interval_seconds' })
  @Transform(({ value }) => value ?? 300)
  channelMonitorDefaultIntervalSeconds!: number

  @Expose({ name: 'available_channels_enabled' })
  @Transform(({ value }) => value ?? false)
  availableChannelsEnabled!: boolean

  @Expose({ name: 'service_quota_enabled' })
  @Transform(({ value }) => value ?? false)
  serviceQuotaEnabled!: boolean

  @Expose({ name: 'affiliate_enabled' })
  @Transform(({ value }) => value ?? false)
  affiliateEnabled!: boolean

  @Expose({ name: 'login_agreement_enabled' })
  loginAgreementEnabled?: boolean

  @Expose({ name: 'login_agreement_mode' })
  loginAgreementMode?: 'modal' | 'checkbox' | string

  @Expose({ name: 'login_agreement_updated_at' })
  loginAgreementUpdatedAt?: string

  @Expose({ name: 'login_agreement_revision' })
  loginAgreementRevision?: string

  @Expose({ name: 'login_agreement_documents' })
  @Type(() => LoginAgreementDocumentDto)
  loginAgreementDocuments?: LoginAgreementDocumentDto[]

  @Expose({ name: 'local_captcha_enabled' })
  localCaptchaEnabled?: boolean

  @Expose({ name: 'dingtalk_oauth_enabled' })
  dingtalkOauthEnabled?: boolean

  @Expose({ name: 'wechat_oauth_open_enabled' })
  wechatOauthOpenEnabled?: boolean

  @Expose({ name: 'wechat_oauth_mp_enabled' })
  wechatOauthMpEnabled?: boolean

  @Expose({ name: 'wechat_oauth_mobile_enabled' })
  wechatOauthMobileEnabled?: boolean

  @Expose({ name: 'server_timezone' })
  serverTimezone?: string

  @Expose({ name: 'server_utc_offset' })
  serverUtcOffset?: string

  @Expose({ name: 'allow_user_view_error_requests' })
  allowUserViewErrorRequests?: boolean

  @Expose({ name: 'allow_user_view_usage_details' })
  allowUserViewUsageDetails?: boolean

  static fromJson(json: unknown): PublicSettingsDto {
    return plainToInstance(PublicSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PublicSettings {
    const entity = new PublicSettings()
    entity.registrationEnabled = this.registrationEnabled
    entity.emailVerifyEnabled = this.emailVerifyEnabled
    entity.forceEmailOnThirdPartySignup = this.forceEmailOnThirdPartySignup
    entity.registrationEmailSuffixWhitelist = this.registrationEmailSuffixWhitelist
    entity.promoCodeEnabled = this.promoCodeEnabled
    entity.passwordResetEnabled = this.passwordResetEnabled
    entity.invitationCodeEnabled = this.invitationCodeEnabled
    entity.turnstileEnabled = this.turnstileEnabled
    entity.turnstileSiteKey = this.turnstileSiteKey
    entity.recaptchaEnabled = this.recaptchaEnabled
    entity.recaptchaSiteKey = this.recaptchaSiteKey
    entity.capEnabled = this.capEnabled
    entity.capApiEndpoint = this.capApiEndpoint
    entity.siteName = this.siteName
    entity.siteLogo = this.siteLogo
    entity.siteSubtitle = this.siteSubtitle
    entity.apiBaseUrl = this.apiBaseUrl
    entity.contactInfo = this.contactInfo
    entity.docUrl = this.docUrl
    entity.homeContent = this.homeContent
    entity.hideCcsImportButton = this.hideCcsImportButton
    entity.paymentEnabled = this.paymentEnabled
    entity.riskControlEnabled = this.riskControlEnabled
    entity.tableDefaultPageSize = this.tableDefaultPageSize
    entity.tablePageSizeOptions = this.tablePageSizeOptions
    entity.customMenuItems = this.customMenuItems.map(dto => dto.toEntity())
    entity.customEndpoints = this.customEndpoints.map(dto => dto.toEntity())
    entity.linuxdoOauthEnabled = this.linuxdoOauthEnabled
    entity.wechatOauthEnabled = this.wechatOauthEnabled
    entity.oidcOauthEnabled = this.oidcOauthEnabled
    entity.oidcOauthProviderName = this.oidcOauthProviderName
    entity.githubOauthEnabled = this.githubOauthEnabled
    entity.googleOauthEnabled = this.googleOauthEnabled
    entity.backendModeEnabled = this.backendModeEnabled
    entity.version = this.version
    entity.balanceLowNotifyEnabled = this.balanceLowNotifyEnabled
    entity.accountQuotaNotifyEnabled = this.accountQuotaNotifyEnabled
    entity.balanceLowNotifyThreshold = this.balanceLowNotifyThreshold
    entity.channelMonitorEnabled = this.channelMonitorEnabled
    entity.channelMonitorDefaultIntervalSeconds = this.channelMonitorDefaultIntervalSeconds
    entity.availableChannelsEnabled = this.availableChannelsEnabled
    entity.serviceQuotaEnabled = this.serviceQuotaEnabled
    entity.affiliateEnabled = this.affiliateEnabled
    entity.loginAgreementEnabled = this.loginAgreementEnabled
    entity.loginAgreementMode = this.loginAgreementMode
    entity.loginAgreementUpdatedAt = this.loginAgreementUpdatedAt
    entity.loginAgreementRevision = this.loginAgreementRevision
    entity.loginAgreementDocuments = this.loginAgreementDocuments?.map(dto => dto.toEntity())
    entity.localCaptchaEnabled = this.localCaptchaEnabled
    entity.dingtalkOauthEnabled = this.dingtalkOauthEnabled
    entity.wechatOauthOpenEnabled = this.wechatOauthOpenEnabled
    entity.wechatOauthMpEnabled = this.wechatOauthMpEnabled
    entity.wechatOauthMobileEnabled = this.wechatOauthMobileEnabled
    entity.serverTimezone = this.serverTimezone
    entity.serverUtcOffset = this.serverUtcOffset
    entity.allowUserViewErrorRequests = this.allowUserViewErrorRequests
    entity.allowUserViewUsageDetails = this.allowUserViewUsageDetails
    return entity
  }
}
