import type { ComputedRef, Ref } from 'vue'
import type { useI18n } from 'vue-i18n'
import type { Account, CheckMixedChannelResponse } from '@/types'
import type { OpenAIWSMode } from '@/core/utils/openaiWsMode'
import { isOpenAIWSModeEnabled } from '@/core/utils/openaiWsMode'
import { accountsAPI } from '../../data/datasources/adminAccountsDatasource'
import type { useQuotaNotifyState } from './useQuotaNotifyState'
import {
  applyAntigravityProjectID,
  applyHeaderOverride,
  applyInterceptWarmup,
  applyPlanType,
  isHeaderOverrideCapable,
  validateHeaderOverrideRows,
} from '../credentialsBuilder'
import {
  normalizePoolModeRetryCount,
  parsePoolModeRetryStatusCodes,
} from '../accountFormPolicy'
import { buildModelMappingObject } from './useModelWhitelist'
import type {
  EditAccountAdvancedContext,
  EditAccountCredentialContext,
  EditAccountPolicyContext,
} from '../accountEditorContext'

type EditorFields =
  Pick<
    EditAccountCredentialContext,
    | 'antigravityModelMappings'
    | 'antigravityProjectId'
    | 'autoDisableOnUpstreamInsufficientBalance'
    | 'cpaConcurrencyPerCredential'
    | 'cpaManagementKey'
    | 'cpaManagementUrl'
    | 'cpaModeEnabled'
    | 'customErrorCodesEnabled'
    | 'editApiKey'
    | 'editBaseUrl'
    | 'editBedrockAccessKeyId'
    | 'editBedrockApiKeyValue'
    | 'editBedrockForceGlobal'
    | 'editBedrockRegion'
    | 'editBedrockSecretAccessKey'
    | 'editBedrockSessionToken'
    | 'editVertexLocation'
    | 'editVertexProjectId'
    | 'form'
    | 'grokClientToolCacheEnabled'
    | 'grokOAuthBaseUrl'
    | 'grokOAuthCustomBaseUrlEnabled'
    | 'headerOverrideEnabled'
    | 'headerOverrideRows'
    | 'isBedrockAPIKeyMode'
    | 'poolModeEnabled'
    | 'poolModeRetryCount'
    | 'poolModeRetryStatusCodesInput'
    | 'selectedErrorCodes'
  > &
  Pick<
    EditAccountAdvancedContext,
    | 'anthropicAPIKeyAuthScheme'
    | 'anthropicPassthroughEnabled'
    | 'codexCLIOnlyAppServerEnabled'
    | 'codexCLIOnlyEnabled'
    | 'codexImageToolMode'
    | 'editDailyResetHour'
    | 'editDailyResetMode'
    | 'editQuotaDailyLimit'
    | 'editQuotaLimit'
    | 'editQuotaWeeklyLimit'
    | 'editResetTimezone'
    | 'editWeeklyResetDay'
    | 'editWeeklyResetHour'
    | 'editWeeklyResetMode'
    | 'interceptWarmupRequests'
    | 'isOpenAIPersonalAccessTokenAccount'
    | 'isSparkShadow'
    | 'openAIForceImageAPIEnabled'
    | 'openAILongContextBillingEnabled'
    | 'openAIResponsesMode'
    | 'openAITextGenerationCapabilityEnabled'
    | 'openaiPassthroughEnabled'
    | 'upstreamBillingAutoProbeEnabled'
    | 'webSearchEmulationMode'
  > &
  Pick<
    EditAccountPolicyContext,
    | 'allowOverages'
    | 'autoPause5hDisabled'
    | 'autoPause5hThreshold'
    | 'autoPause7dDisabled'
    | 'autoPause7dThreshold'
    | 'autoPauseOnExpired'
    | 'baseRpm'
    | 'cacheTTLOverrideEnabled'
    | 'cacheTTLOverrideTarget'
    | 'customBaseUrl'
    | 'customBaseUrlEnabled'
    | 'editPlanType'
    | 'maxSessions'
    | 'mixedScheduling'
    | 'openAICompactMode'
    | 'openAICompactModelMappings'
    | 'rpmLimitEnabled'
    | 'rpmStickyBuffer'
    | 'rpmStrategy'
    | 'sessionIdMaskingEnabled'
    | 'sessionIdleTimeout'
    | 'sessionLimitEnabled'
    | 'tlsFingerprintEnabled'
    | 'tlsFingerprintProfileId'
    | 'userMsgQueueMode'
    | 'windowCostEnabled'
    | 'windowCostLimit'
    | 'windowCostStickyReserve'
  >

interface EditAccountSubmissionContext extends EditorFields {
  account: () => Account | null
  antigravityMixedChannelConfirmed: Ref<boolean>
  applyCodexWebSearchCapability: (credentials: Record<string, unknown>) => void
  applyOpenAIEndpointCapabilities: (credentials: Record<string, unknown>) => void
  applyOpenAIModelMappingCredentials: (credentials: Record<string, unknown>) => void
  applyTempUnschedConfig: (credentials: Record<string, unknown>) => boolean
  buildModelRestrictionMapping: () => Record<string, string> | null
  defaultBaseUrl: ComputedRef<string>
  editVertexClientEmail: Ref<string>
  grokClientToolCacheExtraKey: string
  maxCPAConcurrencyPerCredential: number
  mixedChannelWarningAction: Ref<(() => Promise<void>) | null>
  mixedChannelWarningDetails: Ref<{
    groupName: string
    currentPlatform: string
    otherPlatform: string
  } | null>
  mixedChannelWarningRawMessage: Ref<string>
  notifications: {
    showError: (message: string) => void
    showSuccess: (message: string) => void
  }
  onClose: () => void
  onUpdated: (account: Account) => void
  openaiAPIKeyResponsesWebSocketV2Mode: Ref<OpenAIWSMode>
  openaiOAuthResponsesWebSocketV2Mode: Ref<OpenAIWSMode>
  showMixedChannelWarning: Ref<boolean>
  submitting: Ref<boolean>
  t: ReturnType<typeof useI18n>['t']
  writeQuotaNotifyToExtra: ReturnType<typeof useQuotaNotifyState>['writeToExtra']
}

export function useEditAccountSubmission(context: EditAccountSubmissionContext) {
  const {
    account, allowOverages, anthropicAPIKeyAuthScheme, anthropicPassthroughEnabled,
    antigravityMixedChannelConfirmed, antigravityModelMappings, antigravityProjectId,
    applyCodexWebSearchCapability, applyOpenAIEndpointCapabilities,
    applyOpenAIModelMappingCredentials, applyTempUnschedConfig,
    autoDisableOnUpstreamInsufficientBalance, autoPause5hDisabled, autoPause5hThreshold,
    autoPause7dDisabled, autoPause7dThreshold, autoPauseOnExpired, baseRpm,
    buildModelRestrictionMapping, cacheTTLOverrideEnabled, cacheTTLOverrideTarget,
    codexCLIOnlyAppServerEnabled, codexCLIOnlyEnabled, codexImageToolMode,
    cpaConcurrencyPerCredential, cpaManagementKey, cpaManagementUrl, cpaModeEnabled,
    customBaseUrl, customBaseUrlEnabled, customErrorCodesEnabled, defaultBaseUrl,
    editApiKey, editBaseUrl, editBedrockAccessKeyId, editBedrockApiKeyValue,
    editBedrockForceGlobal, editBedrockRegion, editBedrockSecretAccessKey,
    editBedrockSessionToken, editDailyResetHour, editDailyResetMode, editPlanType,
    editQuotaDailyLimit, editQuotaLimit, editQuotaWeeklyLimit, editResetTimezone,
    editVertexClientEmail, editVertexLocation, editVertexProjectId, editWeeklyResetDay,
    editWeeklyResetHour, editWeeklyResetMode, form, grokClientToolCacheEnabled,
    grokClientToolCacheExtraKey: GROK_CLIENT_TOOL_CACHE_EXTRA_KEY, grokOAuthBaseUrl,
    grokOAuthCustomBaseUrlEnabled, headerOverrideEnabled, headerOverrideRows,
    interceptWarmupRequests, isBedrockAPIKeyMode, isOpenAIPersonalAccessTokenAccount,
    isSparkShadow, maxCPAConcurrencyPerCredential: MAX_CPA_CONCURRENCY_PER_CREDENTIAL,
    maxSessions, mixedChannelWarningAction, mixedChannelWarningDetails,
    mixedChannelWarningRawMessage, mixedScheduling, notifications, onClose, onUpdated,
    openAICompactMode, openAICompactModelMappings, openAIForceImageAPIEnabled,
    openAILongContextBillingEnabled, openAIResponsesMode,
    openAITextGenerationCapabilityEnabled, openaiAPIKeyResponsesWebSocketV2Mode,
    openaiOAuthResponsesWebSocketV2Mode, openaiPassthroughEnabled, poolModeEnabled,
    poolModeRetryCount, poolModeRetryStatusCodesInput, rpmLimitEnabled, rpmStickyBuffer,
    rpmStrategy, selectedErrorCodes, sessionIdMaskingEnabled, sessionIdleTimeout,
    sessionLimitEnabled, showMixedChannelWarning, submitting, t, tlsFingerprintEnabled,
    tlsFingerprintProfileId, upstreamBillingAutoProbeEnabled, userMsgQueueMode,
    webSearchEmulationMode, windowCostEnabled, windowCostLimit, windowCostStickyReserve,
    writeQuotaNotifyToExtra,
  } = context

  const needsMixedChannelCheck = () => account()?.platform === 'antigravity' || account()?.platform === 'anthropic'

  const buildMixedChannelDetails = (resp?: CheckMixedChannelResponse) => {
    const details = resp?.details
    if (!details) {
      return null
    }
    return {
      groupName: details.group_name || 'Unknown',
      currentPlatform: details.current_platform || 'Unknown',
      otherPlatform: details.other_platform || 'Unknown'
    }
  }

  const clearMixedChannelDialog = () => {
    showMixedChannelWarning.value = false
    mixedChannelWarningDetails.value = null
    mixedChannelWarningRawMessage.value = ''
    mixedChannelWarningAction.value = null
  }

  const openMixedChannelDialog = (opts: {
    response?: CheckMixedChannelResponse
    message?: string
    onConfirm: () => Promise<void>
  }) => {
    mixedChannelWarningDetails.value = buildMixedChannelDetails(opts.response)
    mixedChannelWarningRawMessage.value =
      opts.message || opts.response?.message || t('admin.accounts.failedToUpdate')
    mixedChannelWarningAction.value = opts.onConfirm
    showMixedChannelWarning.value = true
  }

  const withAntigravityConfirmFlag = (payload: Record<string, unknown>) => {
    if (needsMixedChannelCheck() && antigravityMixedChannelConfirmed.value) {
      return {
        ...payload,
        confirm_mixed_channel_risk: true
      }
    }
    const cloned = { ...payload }
    delete cloned.confirm_mixed_channel_risk
    return cloned
  }

  const ensureAntigravityMixedChannelConfirmed = async (onConfirm: () => Promise<void>): Promise<boolean> => {
    if (!needsMixedChannelCheck()) {
      return true
    }
    if (antigravityMixedChannelConfirmed.value) {
      return true
    }
    const currentAccount = account()
    if (!currentAccount) {
      return false
    }

    try {
      const result = await accountsAPI.checkMixedChannelRisk({
        platform: currentAccount.platform,
        group_ids: form.group_ids,
        account_id: currentAccount.id
      })
      if (!result.has_risk) {
        return true
      }
      openMixedChannelDialog({
        response: result,
        onConfirm: async () => {
          antigravityMixedChannelConfirmed.value = true
          await onConfirm()
        }
      })
      return false
    } catch (error: any) {
      notifications.showError(error.message || t('admin.accounts.failedToUpdate'))
      return false
    }
  }

  // Methods
  const handleClose = () => {
    antigravityMixedChannelConfirmed.value = false
    clearMixedChannelDialog()
    onClose()
  }

  const submitUpdateAccount = async (accountID: number, updatePayload: Record<string, unknown>) => {
    submitting.value = true
    try {
      const updatedAccount = await accountsAPI.update(accountID, withAntigravityConfirmFlag(updatePayload))
      notifications.showSuccess(t('admin.accounts.accountUpdated'))
      onUpdated(updatedAccount)
      handleClose()
    } catch (error: any) {
      if (error.status === 409 && error.error === 'mixed_channel_warning' && needsMixedChannelCheck()) {
        openMixedChannelDialog({
          message: error.message,
          onConfirm: async () => {
            antigravityMixedChannelConfirmed.value = true
            await submitUpdateAccount(accountID, updatePayload)
          }
        })
        return
      }
      notifications.showError(error.message || t('admin.accounts.failedToUpdate'))
    } finally {
      submitting.value = false
    }
  }

  const handleSubmit = async () => {
    const currentAccount = account()
    if (!currentAccount) return
    const accountID = currentAccount.id

    if (form.status !== 'active' && form.status !== 'inactive' && form.status !== 'error') {
      notifications.showError(t('admin.accounts.pleaseSelectStatus'))
      return
    }

    const updatePayload: Record<string, unknown> = { ...form }
    try {
      // 后端期望 proxy_id: 0 表示清除代理，而不是 null
      if (updatePayload.proxy_id === null) {
        updatePayload.proxy_id = 0
      }
      if (form.expires_at === null) {
        updatePayload.expires_at = 0
      }
      // load_factor: 空值/NaN/0/负数 时发送 0（后端约定 <= 0 = 清除）
      const lf = form.load_factor
      if (lf == null || Number.isNaN(lf) || lf <= 0) {
        updatePayload.load_factor = 0
      }
      updatePayload.auto_pause_on_expired = autoPauseOnExpired.value

      // For apikey type, handle credentials update
      if (currentAccount.type === 'apikey') {
        const currentCredentials = (currentAccount.credentials as Record<string, unknown>) || {}
        const newBaseUrl = editBaseUrl.value.trim() || defaultBaseUrl.value
        const shouldApplyModelMapping = !(currentAccount.platform === 'openai' && openaiPassthroughEnabled.value)

        // Always update credentials for apikey type to handle model mapping changes
        const newCredentials: Record<string, unknown> = {
          ...currentCredentials,
          base_url: newBaseUrl
        }

        // Handle API key
        // 后端响应已脱敏：currentCredentials 不会再包含 api_key 原文。
        // 用户填入新值则覆盖；留空时优先看 credentials_status.has_api_key；
        // 若后端尚未升级（无 credentials_status），回退读旧结构 currentCredentials.api_key。
        // 两者都无才报错。
        const hasExistingApiKey =
          currentAccount.credentials_status?.has_api_key ?? Boolean(currentCredentials.api_key)
        if (editApiKey.value.trim()) {
          newCredentials.api_key = editApiKey.value.trim()
        } else if (!hasExistingApiKey) {
          notifications.showError(t('admin.accounts.apiKeyIsRequired'))
          return
        }

        // Add model mapping if configured（OpenAI 开启自动透传时保留现有映射，不再编辑）
        if (shouldApplyModelMapping) {
          const modelMapping = buildModelRestrictionMapping()
          if (modelMapping) {
            newCredentials.model_mapping = modelMapping
          } else {
            delete newCredentials.model_mapping
          }
        } else if (currentCredentials.model_mapping) {
          newCredentials.model_mapping = currentCredentials.model_mapping
        }
        if (currentAccount.platform === 'openai') {
          applyOpenAIEndpointCapabilities(newCredentials)
          const compactModelMapping = buildModelMappingObject('mapping', [], openAICompactModelMappings.value)
          if (compactModelMapping) {
            newCredentials.compact_model_mapping = compactModelMapping
          } else {
            delete newCredentials.compact_model_mapping
          }
        }

        if (cpaModeEnabled.value) {
          const managementUrl = cpaManagementUrl.value.trim().replace(/\/+$/, '')
          if (!managementUrl) {
            notifications.showError(t('admin.accounts.cpaManagementUrlRequired'))
            return
          }
          const hasExistingManagementKey =
            currentAccount.credentials_status?.has_cpa_management_key ?? false
          const managementKey = cpaManagementKey.value.trim()
          if (!managementKey && !hasExistingManagementKey) {
            notifications.showError(t('admin.accounts.cpaManagementKeyRequired'))
            return
          }
          const perCredential = Math.trunc(Number(cpaConcurrencyPerCredential.value))
          if (!Number.isFinite(perCredential) || perCredential < 1 || perCredential > MAX_CPA_CONCURRENCY_PER_CREDENTIAL) {
            notifications.showError(t('admin.accounts.cpaConcurrencyInvalid', { max: MAX_CPA_CONCURRENCY_PER_CREDENTIAL }))
            return
          }
          newCredentials.cpa_mode = true
          newCredentials.cpa_management_url = managementUrl
          newCredentials.cpa_concurrency_per_credential = perCredential
          if (managementKey) newCredentials.cpa_management_key = managementKey
        } else {
          newCredentials.cpa_mode = false
          newCredentials.cpa_management_key = ''
          delete newCredentials.cpa_management_url
          delete newCredentials.cpa_concurrency_per_credential
        }

        // Add pool mode if enabled
        if (poolModeEnabled.value) {
          newCredentials.pool_mode = true
          newCredentials.pool_mode_retry_count = normalizePoolModeRetryCount(poolModeRetryCount.value)
          const parsedRetryStatusCodes = parsePoolModeRetryStatusCodes(poolModeRetryStatusCodesInput.value)
          if (parsedRetryStatusCodes.length > 0) {
            newCredentials.pool_mode_retry_status_codes = parsedRetryStatusCodes
          } else {
            delete newCredentials.pool_mode_retry_status_codes
          }
        } else {
          delete newCredentials.pool_mode
          delete newCredentials.pool_mode_retry_count
          delete newCredentials.pool_mode_retry_status_codes
        }

        // Add custom error codes if enabled
        if (customErrorCodesEnabled.value) {
          newCredentials.custom_error_codes_enabled = true
          newCredentials.custom_error_codes = [...selectedErrorCodes.value]
        } else {
          delete newCredentials.custom_error_codes_enabled
          delete newCredentials.custom_error_codes
        }

        // Add header override if enabled (anthropic/openai/grok apikey)
        if (isHeaderOverrideCapable(currentAccount.platform, 'apikey')) {
          if (headerOverrideEnabled.value) {
            const headerError = validateHeaderOverrideRows(headerOverrideRows.value)
            if (headerError) {
              notifications.showError(t(`admin.accounts.headerOverride.${headerError}`))
              return
            }
          }
          applyHeaderOverride(newCredentials, headerOverrideEnabled.value, headerOverrideRows.value, 'edit')
        }

        // Add intercept warmup requests setting
        applyInterceptWarmup(newCredentials, interceptWarmupRequests.value, 'edit')
        if (!applyTempUnschedConfig(newCredentials)) {
          return
        }

        updatePayload.credentials = newCredentials
      } else if (currentAccount.type === 'upstream') {
        const currentCredentials = (currentAccount.credentials as Record<string, unknown>) || {}
        const newCredentials: Record<string, unknown> = { ...currentCredentials }

        newCredentials.base_url = editBaseUrl.value.trim()

        if (editApiKey.value.trim()) {
          newCredentials.api_key = editApiKey.value.trim()
        }

        // Add intercept warmup requests setting
        applyInterceptWarmup(newCredentials, interceptWarmupRequests.value, 'edit')

        if (!applyTempUnschedConfig(newCredentials)) {
          return
        }

        updatePayload.credentials = newCredentials
      } else if ((currentAccount.platform === 'gemini' || currentAccount.platform === 'anthropic') && currentAccount.type === 'service_account') {
        const currentCredentials = (currentAccount.credentials as Record<string, unknown>) || {}
        const newCredentials: Record<string, unknown> = { ...currentCredentials }

        if (!editVertexProjectId.value.trim()) {
          notifications.showError(t('admin.accounts.vertexSaJsonMissingProjectId'))
          return
        }
        if (!editVertexClientEmail.value.trim()) {
          notifications.showError(t('admin.accounts.vertexSaJsonMissingClientEmail'))
          return
        }
        if (!editVertexLocation.value.trim()) {
          notifications.showError(t('admin.accounts.vertexLocationRequired'))
          return
        }

        // SA JSON 已脱敏不再随 credentials 返回，存在性优先读 credentials_status。
        // 若后端尚未升级（无 credentials_status），回退读旧结构 service_account_json / service_account。
        const credentialsStatus = currentAccount.credentials_status
        const hasExistingServiceAccountJson = credentialsStatus
          ? Boolean(
              credentialsStatus.has_service_account_json || credentialsStatus.has_service_account
            )
          : Boolean(currentCredentials.service_account_json || currentCredentials.service_account)
        if (!hasExistingServiceAccountJson) {
          notifications.showError(t('admin.accounts.vertexSaJsonRequired'))
          return
        }
        newCredentials.project_id = editVertexProjectId.value.trim()
        newCredentials.client_email = editVertexClientEmail.value.trim()
        newCredentials.location = editVertexLocation.value.trim()
        newCredentials.tier_id = 'vertex'

        // Add model mapping if configured
        const modelMapping = buildModelRestrictionMapping()
        if (modelMapping) {
          newCredentials.model_mapping = modelMapping
        } else {
          delete newCredentials.model_mapping
        }

        applyInterceptWarmup(newCredentials, interceptWarmupRequests.value, 'edit')
        if (!applyTempUnschedConfig(newCredentials)) {
          return
        }

        updatePayload.credentials = newCredentials
      } else if (currentAccount.type === 'bedrock') {
        const currentCredentials = (currentAccount.credentials as Record<string, unknown>) || {}
        const newCredentials: Record<string, unknown> = { ...currentCredentials }

        newCredentials.aws_region = editBedrockRegion.value.trim()
        if (editBedrockForceGlobal.value) {
          newCredentials.aws_force_global = 'true'
        } else {
          delete newCredentials.aws_force_global
        }

        if (isBedrockAPIKeyMode.value) {
          // API Key mode: only update api_key if user provided new value
          if (editBedrockApiKeyValue.value.trim()) {
            newCredentials.api_key = editBedrockApiKeyValue.value.trim()
          }
        } else {
          // SigV4 mode
          newCredentials.aws_access_key_id = editBedrockAccessKeyId.value.trim()
          if (editBedrockSecretAccessKey.value.trim()) {
            newCredentials.aws_secret_access_key = editBedrockSecretAccessKey.value.trim()
          }
          if (editBedrockSessionToken.value.trim()) {
            newCredentials.aws_session_token = editBedrockSessionToken.value.trim()
          }
        }

        // Pool mode
        if (poolModeEnabled.value) {
          newCredentials.pool_mode = true
          newCredentials.pool_mode_retry_count = normalizePoolModeRetryCount(poolModeRetryCount.value)
          const parsedRetryStatusCodes = parsePoolModeRetryStatusCodes(poolModeRetryStatusCodesInput.value)
          if (parsedRetryStatusCodes.length > 0) {
            newCredentials.pool_mode_retry_status_codes = parsedRetryStatusCodes
          } else {
            delete newCredentials.pool_mode_retry_status_codes
          }
        } else {
          delete newCredentials.pool_mode
          delete newCredentials.pool_mode_retry_count
          delete newCredentials.pool_mode_retry_status_codes
        }

        // Model mapping
        const modelMapping = buildModelRestrictionMapping()
        if (modelMapping) {
          newCredentials.model_mapping = modelMapping
        } else {
          delete newCredentials.model_mapping
        }

        applyInterceptWarmup(newCredentials, interceptWarmupRequests.value, 'edit')
        if (!applyTempUnschedConfig(newCredentials)) {
          return
        }

        updatePayload.credentials = newCredentials
      } else {
        // For oauth/setup-token types, only update intercept_warmup_requests if changed
        const currentCredentials = (currentAccount.credentials as Record<string, unknown>) || {}
        const newCredentials: Record<string, unknown> = { ...currentCredentials }

        applyInterceptWarmup(newCredentials, interceptWarmupRequests.value, 'edit')
        if (!applyTempUnschedConfig(newCredentials)) {
          return
        }

        updatePayload.credentials = newCredentials
      }

      // OpenAI/Grok OAuth: persist model mapping to credentials
      if ((currentAccount.platform === 'openai' || currentAccount.platform === 'grok') && currentAccount.type === 'oauth') {
        const currentCredentials = isSparkShadow.value
          ? {}
          : (updatePayload.credentials as Record<string, unknown>) ||
            ((currentAccount.credentials as Record<string, unknown>) || {})
        const newCredentials: Record<string, unknown> = { ...currentCredentials }
        if (currentAccount.platform === 'openai') {
          applyOpenAIModelMappingCredentials(newCredentials)
          if (isOpenAIPersonalAccessTokenAccount.value) {
            applyCodexWebSearchCapability(newCredentials)
          }
        } else {
          const modelMapping = buildModelRestrictionMapping()
          if (modelMapping) {
            newCredentials.model_mapping = modelMapping
          } else {
            delete newCredentials.model_mapping
          }
        }

        updatePayload.credentials = newCredentials
      }

      // Grok OAuth: 自定义上游地址 + 请求头覆写。base_url 仅改写转发端点，
      // OAuth 授权与令牌刷新链路不读取该值；关闭开关即恢复默认官方网关。
      if (currentAccount.platform === 'grok' && currentAccount.type === 'oauth') {
        const currentCredentials =
          (updatePayload.credentials as Record<string, unknown>) ||
          ((currentAccount.credentials as Record<string, unknown>) || {})
        const newCredentials: Record<string, unknown> = { ...currentCredentials }

        if (grokOAuthCustomBaseUrlEnabled.value) {
          const trimmedBaseUrl = grokOAuthBaseUrl.value.trim()
          if (!trimmedBaseUrl) {
            notifications.showError(t('admin.accounts.grokCustomBaseUrl.required'))
            return
          }
          if (!/^https?:\/\//i.test(trimmedBaseUrl)) {
            notifications.showError(t('admin.accounts.grokCustomBaseUrl.invalid'))
            return
          }
          newCredentials.base_url = trimmedBaseUrl
        } else {
          delete newCredentials.base_url
        }

        if (headerOverrideEnabled.value) {
          const headerError = validateHeaderOverrideRows(headerOverrideRows.value)
          if (headerError) {
            notifications.showError(t(`admin.accounts.headerOverride.${headerError}`))
            return
          }
        }
        applyHeaderOverride(newCredentials, headerOverrideEnabled.value, headerOverrideRows.value, 'edit')

        updatePayload.credentials = newCredentials

        const newExtra: Record<string, unknown> = {
          ...((currentAccount.extra as Record<string, unknown>) || {})
        }
        // Persist both states so a disabled account remains opted out when the
        // backend applies the default-enabled policy to missing values.
        newExtra[GROK_CLIENT_TOOL_CACHE_EXTRA_KEY] = grokClientToolCacheEnabled.value
        updatePayload.extra = newExtra
      }

      // OpenAI: 手动覆盖订阅档位 plan_type（Plus/Pro/Free）。仅 OAuth 非影子账号：
      // 影子账号凭据由母账号管理(且后端会 sanitize),setup-token 无订阅调度语义。
      if (currentAccount.platform === 'openai' && currentAccount.type === 'oauth' && !isSparkShadow.value) {
        const currentCredentials = (updatePayload.credentials as Record<string, unknown>) ||
          ((currentAccount.credentials as Record<string, unknown>) || {})
        updatePayload.credentials = applyPlanType({ ...currentCredentials }, editPlanType.value)
      }

      // Antigravity: persist model mapping to credentials (applies to all antigravity types)
      // Antigravity 只支持映射模式
      if (currentAccount.platform === 'antigravity') {
        const currentCredentials = (updatePayload.credentials as Record<string, unknown>) ||
          ((currentAccount.credentials as Record<string, unknown>) || {})
        const newCredentials: Record<string, unknown> = { ...currentCredentials }
        if (currentAccount.type === 'oauth') {
          applyAntigravityProjectID(newCredentials, antigravityProjectId.value, 'edit')
        }

        // 移除旧字段
        delete newCredentials.model_whitelist
        delete newCredentials.model_mapping

        // 只使用映射模式
        const antigravityModelMapping = buildModelMappingObject(
          'mapping',
          [],
          antigravityModelMappings.value
        )
        if (antigravityModelMapping) {
          newCredentials.model_mapping = antigravityModelMapping
        }

        updatePayload.credentials = newCredentials
      }

      // For antigravity accounts, handle mixed_scheduling and allow_overages in extra
      if (currentAccount.platform === 'antigravity') {
        const currentExtra = (currentAccount.extra as Record<string, unknown>) || {}
        const newExtra: Record<string, unknown> = { ...currentExtra }
        if (mixedScheduling.value) {
          newExtra.mixed_scheduling = true
        } else {
          delete newExtra.mixed_scheduling
        }
        if (allowOverages.value) {
          newExtra.allow_overages = true
        } else {
          delete newExtra.allow_overages
        }
        updatePayload.extra = newExtra
      }

      // For Anthropic OAuth/SetupToken accounts, handle quota control settings in extra
      if (currentAccount.platform === 'anthropic' && (currentAccount.type === 'oauth' || currentAccount.type === 'setup-token')) {
        const currentExtra = (updatePayload.extra as Record<string, unknown>) || (currentAccount.extra as Record<string, unknown>) || {}
        const newExtra: Record<string, unknown> = { ...currentExtra }

        // Window cost limit settings
        if (windowCostEnabled.value && windowCostLimit.value != null && windowCostLimit.value > 0) {
          newExtra.window_cost_limit = windowCostLimit.value
          newExtra.window_cost_sticky_reserve = windowCostStickyReserve.value ?? 10
        } else {
          delete newExtra.window_cost_limit
          delete newExtra.window_cost_sticky_reserve
        }

        // Session limit settings
        if (sessionLimitEnabled.value && maxSessions.value != null && maxSessions.value > 0) {
          newExtra.max_sessions = maxSessions.value
          newExtra.session_idle_timeout_minutes = sessionIdleTimeout.value ?? 5
        } else {
          delete newExtra.max_sessions
          delete newExtra.session_idle_timeout_minutes
        }

        // RPM limit settings
        if (rpmLimitEnabled.value) {
          const DEFAULT_BASE_RPM = 15
          newExtra.base_rpm = (baseRpm.value != null && baseRpm.value > 0)
            ? baseRpm.value
            : DEFAULT_BASE_RPM
          newExtra.rpm_strategy = rpmStrategy.value
          if (rpmStickyBuffer.value != null && rpmStickyBuffer.value > 0) {
            newExtra.rpm_sticky_buffer = rpmStickyBuffer.value
          } else {
            delete newExtra.rpm_sticky_buffer
          }
        } else {
          delete newExtra.base_rpm
          delete newExtra.rpm_strategy
          delete newExtra.rpm_sticky_buffer
        }

        // UMQ mode（独立于 RPM 保存）
        if (userMsgQueueMode.value) {
          newExtra.user_msg_queue_mode = userMsgQueueMode.value
        } else {
          delete newExtra.user_msg_queue_mode
        }
        delete newExtra.user_msg_queue_enabled  // 清理旧字段

        // TLS fingerprint setting
        if (tlsFingerprintEnabled.value) {
          newExtra.enable_tls_fingerprint = true
          if (tlsFingerprintProfileId.value) {
            newExtra.tls_fingerprint_profile_id = tlsFingerprintProfileId.value
          } else {
            delete newExtra.tls_fingerprint_profile_id
          }
        } else {
          delete newExtra.enable_tls_fingerprint
          delete newExtra.tls_fingerprint_profile_id
        }

        // Session ID masking setting
        if (sessionIdMaskingEnabled.value) {
          newExtra.session_id_masking_enabled = true
        } else {
          delete newExtra.session_id_masking_enabled
        }

        // Cache TTL override setting
        if (cacheTTLOverrideEnabled.value) {
          newExtra.cache_ttl_override_enabled = true
          newExtra.cache_ttl_override_target = cacheTTLOverrideTarget.value
        } else {
          delete newExtra.cache_ttl_override_enabled
          delete newExtra.cache_ttl_override_target
        }

        // Custom base URL relay setting
        if (customBaseUrlEnabled.value && customBaseUrl.value.trim()) {
          newExtra.custom_base_url_enabled = true
          newExtra.custom_base_url = customBaseUrl.value.trim()
        } else {
          delete newExtra.custom_base_url_enabled
          delete newExtra.custom_base_url
        }

        updatePayload.extra = newExtra
      }

      // For Anthropic API Key accounts, handle passthrough mode + web search emulation in extra
      if (currentAccount.platform === 'anthropic' && currentAccount.type === 'apikey') {
        const currentExtra = (updatePayload.extra as Record<string, unknown>) || (currentAccount.extra as Record<string, unknown>) || {}
        const newExtra: Record<string, unknown> = { ...currentExtra }
        if (anthropicPassthroughEnabled.value) {
          newExtra.anthropic_passthrough = true
        } else {
          delete newExtra.anthropic_passthrough
        }
        if (anthropicAPIKeyAuthScheme.value === 'authorization_bearer') {
          newExtra.anthropic_apikey_auth_scheme = 'authorization_bearer'
        } else {
          delete newExtra.anthropic_apikey_auth_scheme
        }
        if (webSearchEmulationMode.value === 'default') {
          delete newExtra.web_search_emulation
        } else {
          newExtra.web_search_emulation = webSearchEmulationMode.value
        }
        updatePayload.extra = newExtra
      }

      // For OpenAI OAuth/SetupToken/API Key accounts, handle passthrough mode in extra
      if (currentAccount.platform === 'openai' && (currentAccount.type === 'oauth' || currentAccount.type === 'setup-token' || currentAccount.type === 'apikey')) {
        const currentExtra = (currentAccount.extra as Record<string, unknown>) || {}
        const newExtra: Record<string, unknown> = { ...currentExtra }
        const hadCodexCLIOnlyEnabled = currentExtra.codex_cli_only === true
        if (currentAccount.type === 'oauth' || currentAccount.type === 'setup-token') {
          newExtra.openai_oauth_responses_websockets_v2_mode = openaiOAuthResponsesWebSocketV2Mode.value
          newExtra.openai_oauth_responses_websockets_v2_enabled = isOpenAIWSModeEnabled(openaiOAuthResponsesWebSocketV2Mode.value)
        } else if (currentAccount.type === 'apikey') {
          newExtra.openai_apikey_responses_websockets_v2_mode = openaiAPIKeyResponsesWebSocketV2Mode.value
          newExtra.openai_apikey_responses_websockets_v2_enabled = isOpenAIWSModeEnabled(openaiAPIKeyResponsesWebSocketV2Mode.value)
        }
        delete newExtra.responses_websockets_v2_enabled
        delete newExtra.openai_ws_enabled
        if (openaiPassthroughEnabled.value) {
          newExtra.openai_passthrough = true
        } else {
          delete newExtra.openai_passthrough
          delete newExtra.openai_oauth_passthrough
        }
        if (isSparkShadow.value) {
          delete newExtra.openai_long_context_billing_enabled
        } else {
          newExtra.openai_long_context_billing_enabled = openAILongContextBillingEnabled.value
        }
        if (openAICompactMode.value === 'auto') {
          delete newExtra.openai_compact_mode
        } else {
          newExtra.openai_compact_mode = openAICompactMode.value
        }
      if (currentAccount.type === 'apikey') {
          if (!openAITextGenerationCapabilityEnabled.value || openAIResponsesMode.value === 'auto') {
            delete newExtra.openai_responses_mode
          } else {
            newExtra.openai_responses_mode = openAIResponsesMode.value
          }
        newExtra.upstream_billing_probe_enabled = upstreamBillingAutoProbeEnabled.value
        if (openAIForceImageAPIEnabled.value) {
          newExtra.openai_force_image_api = true
        } else {
          delete newExtra.openai_force_image_api
        }
      }
      if (autoPause5hThreshold.value != null && autoPause5hThreshold.value > 0) {
        newExtra.auto_pause_5h_threshold = autoPause5hThreshold.value / 100
      } else {
        delete newExtra.auto_pause_5h_threshold
      }
      if (autoPause7dThreshold.value != null && autoPause7dThreshold.value > 0) {
        newExtra.auto_pause_7d_threshold = autoPause7dThreshold.value / 100
      } else {
        delete newExtra.auto_pause_7d_threshold
      }
      if (autoPause5hDisabled.value) {
        newExtra.auto_pause_5h_disabled = true
      } else {
        delete newExtra.auto_pause_5h_disabled
      }
      if (autoPause7dDisabled.value) {
        newExtra.auto_pause_7d_disabled = true
      } else {
        delete newExtra.auto_pause_7d_disabled
      }

      delete newExtra.codex_image_generation_bridge_enabled
        switch (codexImageToolMode.value) {
          case 'enabled':
          case 'disabled':
            newExtra.codex_image_generation_bridge = codexImageToolMode.value === 'enabled'
            delete newExtra.codex_image_generation_explicit_tool_policy
            break
          case 'block':
            newExtra.codex_image_generation_explicit_tool_policy = 'strip'
            delete newExtra.codex_image_generation_bridge
            break
          default:
            delete newExtra.codex_image_generation_bridge
            delete newExtra.codex_image_generation_explicit_tool_policy
        }

        if (currentAccount.type === 'oauth' || currentAccount.type === 'setup-token') {
          if (codexCLIOnlyEnabled.value) {
            newExtra.codex_cli_only = true
          } else if (hadCodexCLIOnlyEnabled) {
            // 关闭时显式写 false，避免 extra 为空被后端忽略导致旧值无法清除
            newExtra.codex_cli_only = false
          } else {
            delete newExtra.codex_cli_only
          }
          // Claude Code 插件放行已迁移到全局 codex_cli_only_whitelist，编辑时清理废弃账号级快捷字段。
          delete newExtra.codex_cli_only_allowed_clients
          if (codexCLIOnlyEnabled.value && codexCLIOnlyAppServerEnabled.value) {
            newExtra.codex_cli_only_allow_app_server = true
          } else {
            delete newExtra.codex_cli_only_allow_app_server
          }
        }

        updatePayload.extra = newExtra
      }

      // For apikey/bedrock accounts, handle quota_limit in extra
      if (currentAccount.type === 'apikey' || currentAccount.type === 'bedrock') {
        const currentExtra = (updatePayload.extra as Record<string, unknown>) ||
          (currentAccount.extra as Record<string, unknown>) || {}
        const newExtra: Record<string, unknown> = { ...currentExtra }
        // Total quota
        if (editQuotaLimit.value != null && editQuotaLimit.value > 0) {
          newExtra.quota_limit = editQuotaLimit.value
        } else {
          delete newExtra.quota_limit
        }
        // Daily quota
        if (editQuotaDailyLimit.value != null && editQuotaDailyLimit.value > 0) {
          newExtra.quota_daily_limit = editQuotaDailyLimit.value
        } else {
          delete newExtra.quota_daily_limit
          delete newExtra.quota_daily_used
          delete newExtra.quota_daily_start
        }
        // Weekly quota
        if (editQuotaWeeklyLimit.value != null && editQuotaWeeklyLimit.value > 0) {
          newExtra.quota_weekly_limit = editQuotaWeeklyLimit.value
        } else {
          delete newExtra.quota_weekly_limit
          delete newExtra.quota_weekly_used
          delete newExtra.quota_weekly_start
        }
        // Quota reset mode config
        if (editDailyResetMode.value === 'fixed') {
          newExtra.quota_daily_reset_mode = 'fixed'
          newExtra.quota_daily_reset_hour = editDailyResetHour.value ?? 0
        } else {
          delete newExtra.quota_daily_reset_mode
          delete newExtra.quota_daily_reset_hour
        }
        if (editWeeklyResetMode.value === 'fixed') {
          newExtra.quota_weekly_reset_mode = 'fixed'
          newExtra.quota_weekly_reset_day = editWeeklyResetDay.value ?? 1
          newExtra.quota_weekly_reset_hour = editWeeklyResetHour.value ?? 0
        } else {
          delete newExtra.quota_weekly_reset_mode
          delete newExtra.quota_weekly_reset_day
          delete newExtra.quota_weekly_reset_hour
        }
        if (editDailyResetMode.value === 'fixed' || editWeeklyResetMode.value === 'fixed') {
          newExtra.quota_reset_timezone = editResetTimezone.value || 'UTC'
        } else {
          delete newExtra.quota_reset_timezone
        }
        // Quota notify config
        writeQuotaNotifyToExtra(newExtra, 'update')
        updatePayload.extra = newExtra
      }

      if (currentAccount.type === 'apikey') {
        const currentExtra =
          (updatePayload.extra as Record<string, unknown>) ||
          (currentAccount.extra as Record<string, unknown>) ||
          {}
        const newExtra: Record<string, unknown> = { ...currentExtra }
        if (autoDisableOnUpstreamInsufficientBalance.value) {
          newExtra.auto_disable_on_upstream_insufficient_balance = true
        } else {
          delete newExtra.auto_disable_on_upstream_insufficient_balance
        }
        updatePayload.extra = newExtra
      }

      const canContinue = await ensureAntigravityMixedChannelConfirmed(async () => {
        await submitUpdateAccount(accountID, updatePayload)
      })
      if (!canContinue) {
        return
      }

      await submitUpdateAccount(accountID, updatePayload)
    } catch (error: any) {
      notifications.showError(error.message || t('admin.accounts.failedToUpdate'))
    }
  }

  // Handle mixed channel warning confirmation
  const handleMixedChannelConfirm = async () => {
    const action = mixedChannelWarningAction.value
    if (!action) {
      clearMixedChannelDialog()
      return
    }
    clearMixedChannelDialog()
    submitting.value = true
    try {
      await action()
    } finally {
      submitting.value = false
    }
  }

  const handleMixedChannelCancel = () => {
    clearMixedChannelDialog()
  }

  return {
    handleClose,
    handleMixedChannelCancel,
    handleMixedChannelConfirm,
    handleSubmit,
  }
}
