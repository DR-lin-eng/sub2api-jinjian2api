/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  ClientIPResolutionMode,
  ClientIPResolutionStatus,
  DefaultSubscriptionSetting,
  PlatformType,
  QuotaWindowType,
  PlatformQuotaLimits,
  DefaultPlatformQuotasMap,
  AuthSourceType,
  AuthSourceDefaultsValue,
  AuthSourceDefaultsState,
  PaymentVisibleMethod,
  PaymentVisibleMethodSource,
  WeChatConnectMode,
  PaymentVisibleMethodSourceOption,
  WeChatConnectModeOption,
  SystemSettings,
  UpdateSettingsRequest,
  TestSmtpRequest,
  SendTestEmailRequest,
  EmailTemplateOption,
  EmailTemplateEventOption,
  EmailTemplateSummary,
  EmailTemplateListResponse,
  EmailTemplateDetail,
  UpdateEmailTemplateRequest,
  PreviewEmailTemplateRequest,
  EmailTemplatePreviewResponse,
  AdminApiKeyStatus,
  AdminApiKeyScope,
  AdminApiKey,
  CreateAdminApiKeyRequest,
  UpdateAdminApiKeyRequest,
  OverloadCooldownSettings,
  RateLimit429CooldownSettings,
  GlobalTempUnschedulableSettings,
  StreamTimeoutSettings,
  ThinkingDisplayMode,
  RectifierSettings,
  OpenAIFastPolicyRule,
  OpenAIFastPolicySettings,
  BetaPolicyRule,
  BetaPolicySettings,
  WebSearchProviderConfig,
  WebSearchEmulationConfig,
  WebSearchTestResult
} from '@/features/admin-settings/data/datasources/adminSettingsDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toClientIPResolutionMode = (dto: ClientIPResolutionMode): ClientIPResolutionMode => dto
export const clientIPResolutionModeToDto = (entity: ClientIPResolutionMode): ClientIPResolutionMode => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toClientIPResolutionStatus = (dto: ClientIPResolutionStatus): ClientIPResolutionStatus => dto
export const clientIPResolutionStatusToDto = (entity: ClientIPResolutionStatus): ClientIPResolutionStatus => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toDefaultSubscriptionSetting = (dto: DefaultSubscriptionSetting): DefaultSubscriptionSetting => dto
export const defaultSubscriptionSettingToDto = (entity: DefaultSubscriptionSetting): DefaultSubscriptionSetting => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toPlatformType = (dto: PlatformType): PlatformType => dto
export const platformTypeToDto = (entity: PlatformType): PlatformType => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toQuotaWindowType = (dto: QuotaWindowType): QuotaWindowType => dto
export const quotaWindowTypeToDto = (entity: QuotaWindowType): QuotaWindowType => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toPlatformQuotaLimits = (dto: PlatformQuotaLimits): PlatformQuotaLimits => dto
export const platformQuotaLimitsToDto = (entity: PlatformQuotaLimits): PlatformQuotaLimits => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toDefaultPlatformQuotasMap = (dto: DefaultPlatformQuotasMap): DefaultPlatformQuotasMap => dto
export const defaultPlatformQuotasMapToDto = (entity: DefaultPlatformQuotasMap): DefaultPlatformQuotasMap => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toAuthSourceType = (dto: AuthSourceType): AuthSourceType => dto
export const authSourceTypeToDto = (entity: AuthSourceType): AuthSourceType => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toAuthSourceDefaultsValue = (dto: AuthSourceDefaultsValue): AuthSourceDefaultsValue => dto
export const authSourceDefaultsValueToDto = (entity: AuthSourceDefaultsValue): AuthSourceDefaultsValue => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toAuthSourceDefaultsState = (dto: AuthSourceDefaultsState): AuthSourceDefaultsState => dto
export const authSourceDefaultsStateToDto = (entity: AuthSourceDefaultsState): AuthSourceDefaultsState => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toPaymentVisibleMethod = (dto: PaymentVisibleMethod): PaymentVisibleMethod => dto
export const paymentVisibleMethodToDto = (entity: PaymentVisibleMethod): PaymentVisibleMethod => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toPaymentVisibleMethodSource = (dto: PaymentVisibleMethodSource): PaymentVisibleMethodSource => dto
export const paymentVisibleMethodSourceToDto = (entity: PaymentVisibleMethodSource): PaymentVisibleMethodSource => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toWeChatConnectMode = (dto: WeChatConnectMode): WeChatConnectMode => dto
export const weChatConnectModeToDto = (entity: WeChatConnectMode): WeChatConnectMode => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toPaymentVisibleMethodSourceOption = (dto: PaymentVisibleMethodSourceOption): PaymentVisibleMethodSourceOption => dto
export const paymentVisibleMethodSourceOptionToDto = (entity: PaymentVisibleMethodSourceOption): PaymentVisibleMethodSourceOption => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toWeChatConnectModeOption = (dto: WeChatConnectModeOption): WeChatConnectModeOption => dto
export const weChatConnectModeOptionToDto = (entity: WeChatConnectModeOption): WeChatConnectModeOption => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toSystemSettings = (dto: SystemSettings): SystemSettings => dto
export const systemSettingsToDto = (entity: SystemSettings): SystemSettings => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUpdateSettingsRequest = (dto: UpdateSettingsRequest): UpdateSettingsRequest => dto
export const updateSettingsRequestToDto = (entity: UpdateSettingsRequest): UpdateSettingsRequest => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toTestSmtpRequest = (dto: TestSmtpRequest): TestSmtpRequest => dto
export const testSmtpRequestToDto = (entity: TestSmtpRequest): TestSmtpRequest => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toSendTestEmailRequest = (dto: SendTestEmailRequest): SendTestEmailRequest => dto
export const sendTestEmailRequestToDto = (entity: SendTestEmailRequest): SendTestEmailRequest => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toEmailTemplateOption = (dto: EmailTemplateOption): EmailTemplateOption => dto
export const emailTemplateOptionToDto = (entity: EmailTemplateOption): EmailTemplateOption => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toEmailTemplateEventOption = (dto: EmailTemplateEventOption): EmailTemplateEventOption => dto
export const emailTemplateEventOptionToDto = (entity: EmailTemplateEventOption): EmailTemplateEventOption => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toEmailTemplateSummary = (dto: EmailTemplateSummary): EmailTemplateSummary => dto
export const emailTemplateSummaryToDto = (entity: EmailTemplateSummary): EmailTemplateSummary => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toEmailTemplateListResponse = (dto: EmailTemplateListResponse): EmailTemplateListResponse => dto
export const emailTemplateListResponseToDto = (entity: EmailTemplateListResponse): EmailTemplateListResponse => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toEmailTemplateDetail = (dto: EmailTemplateDetail): EmailTemplateDetail => dto
export const emailTemplateDetailToDto = (entity: EmailTemplateDetail): EmailTemplateDetail => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUpdateEmailTemplateRequest = (dto: UpdateEmailTemplateRequest): UpdateEmailTemplateRequest => dto
export const updateEmailTemplateRequestToDto = (entity: UpdateEmailTemplateRequest): UpdateEmailTemplateRequest => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toPreviewEmailTemplateRequest = (dto: PreviewEmailTemplateRequest): PreviewEmailTemplateRequest => dto
export const previewEmailTemplateRequestToDto = (entity: PreviewEmailTemplateRequest): PreviewEmailTemplateRequest => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toEmailTemplatePreviewResponse = (dto: EmailTemplatePreviewResponse): EmailTemplatePreviewResponse => dto
export const emailTemplatePreviewResponseToDto = (entity: EmailTemplatePreviewResponse): EmailTemplatePreviewResponse => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toAdminApiKeyStatus = (dto: AdminApiKeyStatus): AdminApiKeyStatus => dto
export const adminApiKeyStatusToDto = (entity: AdminApiKeyStatus): AdminApiKeyStatus => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toAdminApiKeyScope = (dto: AdminApiKeyScope): AdminApiKeyScope => dto
export const adminApiKeyScopeToDto = (entity: AdminApiKeyScope): AdminApiKeyScope => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toAdminApiKey = (dto: AdminApiKey): AdminApiKey => dto
export const adminApiKeyToDto = (entity: AdminApiKey): AdminApiKey => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toCreateAdminApiKeyRequest = (dto: CreateAdminApiKeyRequest): CreateAdminApiKeyRequest => dto
export const createAdminApiKeyRequestToDto = (entity: CreateAdminApiKeyRequest): CreateAdminApiKeyRequest => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUpdateAdminApiKeyRequest = (dto: UpdateAdminApiKeyRequest): UpdateAdminApiKeyRequest => dto
export const updateAdminApiKeyRequestToDto = (entity: UpdateAdminApiKeyRequest): UpdateAdminApiKeyRequest => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toOverloadCooldownSettings = (dto: OverloadCooldownSettings): OverloadCooldownSettings => dto
export const overloadCooldownSettingsToDto = (entity: OverloadCooldownSettings): OverloadCooldownSettings => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toRateLimit429CooldownSettings = (dto: RateLimit429CooldownSettings): RateLimit429CooldownSettings => dto
export const rateLimit429CooldownSettingsToDto = (entity: RateLimit429CooldownSettings): RateLimit429CooldownSettings => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toGlobalTempUnschedulableSettings = (dto: GlobalTempUnschedulableSettings): GlobalTempUnschedulableSettings => dto
export const globalTempUnschedulableSettingsToDto = (entity: GlobalTempUnschedulableSettings): GlobalTempUnschedulableSettings => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toStreamTimeoutSettings = (dto: StreamTimeoutSettings): StreamTimeoutSettings => dto
export const streamTimeoutSettingsToDto = (entity: StreamTimeoutSettings): StreamTimeoutSettings => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toThinkingDisplayMode = (dto: ThinkingDisplayMode): ThinkingDisplayMode => dto
export const thinkingDisplayModeToDto = (entity: ThinkingDisplayMode): ThinkingDisplayMode => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toRectifierSettings = (dto: RectifierSettings): RectifierSettings => dto
export const rectifierSettingsToDto = (entity: RectifierSettings): RectifierSettings => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toOpenAIFastPolicyRule = (dto: OpenAIFastPolicyRule): OpenAIFastPolicyRule => dto
export const openAIFastPolicyRuleToDto = (entity: OpenAIFastPolicyRule): OpenAIFastPolicyRule => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toOpenAIFastPolicySettings = (dto: OpenAIFastPolicySettings): OpenAIFastPolicySettings => dto
export const openAIFastPolicySettingsToDto = (entity: OpenAIFastPolicySettings): OpenAIFastPolicySettings => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toBetaPolicyRule = (dto: BetaPolicyRule): BetaPolicyRule => dto
export const betaPolicyRuleToDto = (entity: BetaPolicyRule): BetaPolicyRule => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toBetaPolicySettings = (dto: BetaPolicySettings): BetaPolicySettings => dto
export const betaPolicySettingsToDto = (entity: BetaPolicySettings): BetaPolicySettings => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toWebSearchProviderConfig = (dto: WebSearchProviderConfig): WebSearchProviderConfig => dto
export const webSearchProviderConfigToDto = (entity: WebSearchProviderConfig): WebSearchProviderConfig => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toWebSearchEmulationConfig = (dto: WebSearchEmulationConfig): WebSearchEmulationConfig => dto
export const webSearchEmulationConfigToDto = (entity: WebSearchEmulationConfig): WebSearchEmulationConfig => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toWebSearchTestResult = (dto: WebSearchTestResult): WebSearchTestResult => dto
export const webSearchTestResultToDto = (entity: WebSearchTestResult): WebSearchTestResult => entity
