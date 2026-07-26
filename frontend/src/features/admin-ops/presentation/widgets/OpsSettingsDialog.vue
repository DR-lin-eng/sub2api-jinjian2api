<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/core/stores/appStore'
import { useAdminOpsQueryStore } from '@/features/admin-ops/presentation/stores/adminOpsQueryStore'
const queryStore = useAdminOpsQueryStore()
import { useAdminOpsActionStore } from '@/features/admin-ops/presentation/stores/adminOpsActionStore'
import BaseDialog from '@/common/widgets/feedback/BaseDialog.vue'
import Select from '@/common/widgets/forms/Select.vue'
import Toggle from '@/common/widgets/forms/Toggle.vue'
import type { OpsAdvancedSettings } from '@/features/admin-ops/domain/models/opsAdvancedSettings'
import type { OpsAlertRuntimeSettings } from '@/features/admin-ops/domain/models/opsAlertRuntimeSettings'
import type { EmailNotificationConfig } from '@/features/admin-ops/domain/models/emailNotificationConfig'
import type { OpsMetricThresholds } from '@/features/admin-ops/domain/models/opsMetricThresholds'
import type { AlertSeverity } from '@/features/admin-ops/enums/alertEnums'
import type { UpdateAlertRuntimeSettingsRequest } from '@/features/admin-ops/data/requests_models/updateAlertRuntimeSettingsRequest'
import type { UpdateEmailNotificationConfigRequest } from '@/features/admin-ops/data/requests_models/updateEmailNotificationConfigRequest'
import type { UpdateAdvancedSettingsRequest } from '@/features/admin-ops/data/requests_models/updateAdvancedSettingsRequest'

const { t } = useI18n()
const appStore = useAppStore()
const actionStore = useAdminOpsActionStore()

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const loading = ref(false)
const saving = ref(false)

// 运行时设置
const runtimeSettings = ref<OpsAlertRuntimeSettings | null>(null)
// 邮件通知配置
const emailConfig = ref<EmailNotificationConfig | null>(null)
// 高级设置
const advancedSettings = ref<OpsAdvancedSettings | null>(null)
// 指标阈值配置
const metricThresholds = ref<OpsMetricThresholds>({
  slaPercentMin: 99.5,
  ttftP99MsMax: 500,
  requestErrorRatePercentMax: 5,
  upstreamErrorRatePercentMax: 5
})

// 加载所有配置
async function loadAllSettings() {
  loading.value = true
  try {
    const settings = await queryStore.getSettingsSnapshot().catch(async () => {
      const [runtime, email, advanced] = await Promise.all([
        queryStore.getAlertRuntimeSettings(),
        queryStore.getEmailNotificationConfig(),
        queryStore.getAdvancedSettings(),
      ])
      return { runtime, email, advanced, metric_thresholds: null }
    })
    const s = settings as Record<string, unknown>
    runtimeSettings.value = s.runtime as OpsAlertRuntimeSettings
    emailConfig.value = s.email as EmailNotificationConfig
    advancedSettings.value = s.advanced as OpsAdvancedSettings
    if (advancedSettings.value && !advancedSettings.value.openaiAccountQuotaAutoPause) {
      advancedSettings.value.openaiAccountQuotaAutoPause = { defaultThreshold5h: 0, defaultThreshold7d: 0 }
    }
    if (advancedSettings.value && typeof advancedSettings.value.displayImageGenerationStats !== 'boolean') {
      advancedSettings.value.displayImageGenerationStats = true
    }
    const mt = s.metric_thresholds as OpsMetricThresholds | null
    if (mt && Object.keys(mt).length > 0) {
      metricThresholds.value = {
        slaPercentMin: mt.slaPercentMin ?? 99.5,
        ttftP99MsMax: mt.ttftP99MsMax ?? 500,
        requestErrorRatePercentMax: mt.requestErrorRatePercentMax ?? 5,
        upstreamErrorRatePercentMax: mt.upstreamErrorRatePercentMax ?? 5,
      }
    }
  } catch (err: unknown) {
    console.error('[OpsSettingsDialog] Failed to load settings', err)
    appStore.showError((err as Record<string, unknown>)?.message as string || t('admin.ops.settings.loadFailed'))
  } finally {
    loading.value = false
  }
}

// 监听弹窗打开
watch(() => props.show, (show) => {
  if (show) {
    loadAllSettings()
  }
})

// 邮件输入
const alertRecipientInput = ref('')
const reportRecipientInput = ref('')

// 严重级别选项
const severityOptions: Array<{ value: AlertSeverity | ''; label: string }> = [
  { value: '', label: t('admin.ops.email.minSeverityAll') },
  { value: 'critical', label: t('common.critical') },
  { value: 'warning', label: t('common.warning') },
  { value: 'info', label: t('common.info') }
]

// 验证邮箱
function isValidEmailAddress(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 添加收件人
function addRecipient(target: 'alert' | 'report') {
  if (!emailConfig.value) return
  const raw = (target === 'alert' ? alertRecipientInput.value : reportRecipientInput.value).trim()
  if (!raw) return

  if (!isValidEmailAddress(raw)) {
    appStore.showError(t('common.invalidEmail'))
    return
  }

  const normalized = raw.toLowerCase()
  const list = target === 'alert' ? emailConfig.value.alert.recipients : emailConfig.value.report.recipients
  if (!list.includes(normalized)) {
    list.push(normalized)
  }
  if (target === 'alert') alertRecipientInput.value = ''
  else reportRecipientInput.value = ''
}

// 移除收件人
function removeRecipient(target: 'alert' | 'report', email: string) {
  if (!emailConfig.value) return
  const list = target === 'alert' ? emailConfig.value.alert.recipients : emailConfig.value.report.recipients
  const idx = list.indexOf(email)
  if (idx >= 0) list.splice(idx, 1)
}

// OpenAI 账号配额自动暂停：后端按 0~1 分数存储，UI 按百分比(0~100)展示
const quotaAutoPause5hPercent = computed<number | null>({
  get() {
    const v = advancedSettings.value?.openaiAccountQuotaAutoPause?.defaultThreshold5h
    return v && v > 0 ? Math.round(v * 1000) / 10 : null
  },
  set(val) {
    if (!advancedSettings.value?.openaiAccountQuotaAutoPause) return
    advancedSettings.value.openaiAccountQuotaAutoPause.defaultThreshold5h = val != null && val > 0 ? val / 100 : 0
  }
})
const quotaAutoPause7dPercent = computed<number | null>({
  get() {
    const v = advancedSettings.value?.openaiAccountQuotaAutoPause?.defaultThreshold7d
    return v && v > 0 ? Math.round(v * 1000) / 10 : null
  },
  set(val) {
    if (!advancedSettings.value?.openaiAccountQuotaAutoPause) return
    advancedSettings.value.openaiAccountQuotaAutoPause.defaultThreshold7d = val != null && val > 0 ? val / 100 : 0
  }
})

// 验证
const validation = computed(() => {
  const errors: string[] = []

  // 验证运行时设置
  if (runtimeSettings.value) {
    const evalSeconds = runtimeSettings.value.evaluationIntervalSeconds
    if (!Number.isFinite(evalSeconds) || evalSeconds < 1 || evalSeconds > 86400) {
      errors.push(t('admin.ops.runtime.validation.evalIntervalRange'))
    }
  }

  // 邮件配置: 启用但无收件人时不阻断保存, 保存时会自动禁用

  // 验证高级设置
  if (advancedSettings.value) {
    const {
      userRequestLogRetentionDays,
      errorLogRetentionDays,
      minuteMetricsRetentionDays,
      hourlyMetricsRetentionDays
    } = advancedSettings.value.dataRetention
    if (userRequestLogRetentionDays < 1 || userRequestLogRetentionDays > 3650) {
      errors.push(t('admin.ops.settings.validation.userRequestLogRetentionDaysRange'))
    }
    if (errorLogRetentionDays < 0 || errorLogRetentionDays > 365) {
      errors.push(t('admin.ops.settings.validation.retentionDaysRange'))
    }
    if (minuteMetricsRetentionDays < 0 || minuteMetricsRetentionDays > 365) {
      errors.push(t('admin.ops.settings.validation.retentionDaysRange'))
    }
    if (hourlyMetricsRetentionDays < 0 || hourlyMetricsRetentionDays > 365) {
      errors.push(t('admin.ops.settings.validation.retentionDaysRange'))
    }

    const { defaultThreshold5h, defaultThreshold7d } = advancedSettings.value.openaiAccountQuotaAutoPause
    if (defaultThreshold5h < 0 || defaultThreshold5h > 1 || defaultThreshold7d < 0 || defaultThreshold7d > 1) {
      errors.push(t('admin.ops.settings.validation.openaiQuotaAutoPauseRange'))
    }
  }

  // 验证指标阈值
  if (metricThresholds.value.slaPercentMin != null && (metricThresholds.value.slaPercentMin < 0 || metricThresholds.value.slaPercentMin > 100)) {
    errors.push(t('admin.ops.settings.validation.slaMinPercentRange'))
  }
  if (metricThresholds.value.ttftP99MsMax != null && metricThresholds.value.ttftP99MsMax < 0) {
    errors.push(t('admin.ops.settings.validation.ttftP99MaxRange'))
  }
  if (metricThresholds.value.requestErrorRatePercentMax != null && (metricThresholds.value.requestErrorRatePercentMax < 0 || metricThresholds.value.requestErrorRatePercentMax > 100)) {
    errors.push(t('admin.ops.settings.validation.requestErrorRateMaxRange'))
  }
  if (metricThresholds.value.upstreamErrorRatePercentMax != null && (metricThresholds.value.upstreamErrorRatePercentMax < 0 || metricThresholds.value.upstreamErrorRatePercentMax > 100)) {
    errors.push(t('admin.ops.settings.validation.upstreamErrorRateMaxRange'))
  }

  return { valid: errors.length === 0, errors }
})

// 保存所有配置
async function saveAllSettings() {
  if (!validation.value.valid) {
    appStore.showError(validation.value.errors[0])
    return
  }

  saving.value = true
  try {
    // 无收件人时自动禁用邮件通知
    if (emailConfig.value) {
      if (emailConfig.value.alert.enabled && emailConfig.value.alert.recipients.length === 0) {
        emailConfig.value.alert.enabled = false
      }
      if (emailConfig.value.report.enabled && emailConfig.value.report.recipients.length === 0) {
        emailConfig.value.report.enabled = false
      }
    }
    const promises: Promise<unknown>[] = []
    if (runtimeSettings.value) {
      const rs = runtimeSettings.value
      const runtimeReq: UpdateAlertRuntimeSettingsRequest = {
        evaluation_interval_seconds: rs.evaluationIntervalSeconds,
        distributed_lock: { enabled: rs.distributedLock.enabled, key: rs.distributedLock.key, ttl_seconds: rs.distributedLock.ttlSeconds },
        silencing: {
          enabled: rs.silencing.enabled,
          global_until_rfc3339: rs.silencing.globalUntilRfc3339,
          global_reason: rs.silencing.globalReason,
          entries: rs.silencing.entries?.map(e => ({ rule_id: e.ruleId, severities: e.severities, until_rfc3339: e.untilRfc3339, reason: e.reason })),
        },
        thresholds: {
          sla_percent_min: rs.thresholds.slaPercentMin ?? null,
          ttft_p99_ms_max: rs.thresholds.ttftP99MsMax ?? null,
          request_error_rate_percent_max: rs.thresholds.requestErrorRatePercentMax ?? null,
          upstream_error_rate_percent_max: rs.thresholds.upstreamErrorRatePercentMax ?? null,
        },
      }
      promises.push(actionStore.updateAlertRuntimeSettings(runtimeReq))
    }
    if (emailConfig.value) {
      const ec = emailConfig.value
      const emailReq: UpdateEmailNotificationConfigRequest = {
        alert: { enabled: ec.alert.enabled, recipients: ec.alert.recipients, min_severity: ec.alert.minSeverity, rate_limit_per_hour: ec.alert.rateLimitPerHour, batching_window_seconds: ec.alert.batchingWindowSeconds, include_resolved_alerts: ec.alert.includeResolvedAlerts },
        report: { enabled: ec.report.enabled, recipients: ec.report.recipients, daily_summary_enabled: ec.report.dailySummaryEnabled, daily_summary_schedule: ec.report.dailySummarySchedule, weekly_summary_enabled: ec.report.weeklySummaryEnabled, weekly_summary_schedule: ec.report.weeklySummarySchedule, error_digest_enabled: ec.report.errorDigestEnabled, error_digest_schedule: ec.report.errorDigestSchedule, error_digest_min_count: ec.report.errorDigestMinCount, account_health_enabled: ec.report.accountHealthEnabled, account_health_schedule: ec.report.accountHealthSchedule, account_health_error_rate_threshold: ec.report.accountHealthErrorRateThreshold },
      }
      promises.push(actionStore.updateEmailNotificationConfig(emailReq))
    }
    if (advancedSettings.value) {
      const as_ = advancedSettings.value
      const advReq: UpdateAdvancedSettingsRequest = {
        data_retention: { user_request_log_retention_days: as_.dataRetention.userRequestLogRetentionDays, cleanup_enabled: as_.dataRetention.cleanupEnabled, cleanup_schedule: as_.dataRetention.cleanupSchedule, error_log_retention_days: as_.dataRetention.errorLogRetentionDays, minute_metrics_retention_days: as_.dataRetention.minuteMetricsRetentionDays, hourly_metrics_retention_days: as_.dataRetention.hourlyMetricsRetentionDays },
        aggregation: { aggregation_enabled: as_.aggregation.aggregationEnabled },
        openai_account_quota_auto_pause: { default_threshold_5h: as_.openaiAccountQuotaAutoPause.defaultThreshold5h, default_threshold_7d: as_.openaiAccountQuotaAutoPause.defaultThreshold7d },
        ignore_count_tokens_errors: as_.ignoreCountTokensErrors,
        ignore_context_canceled: as_.ignoreContextCanceled,
        ignore_no_available_accounts: as_.ignoreNoAvailableAccounts,
        ignore_invalid_api_key_errors: as_.ignoreInvalidApiKeyErrors,
        ignore_insufficient_balance_errors: as_.ignoreInsufficientBalanceErrors,
        display_openai_token_stats: as_.displayOpenaiTokenStats,
        display_user_usage_stats: as_.displayUserUsageStats,
        display_alert_events: as_.displayAlertEvents,
        display_system_logs: as_.displaySystemLogs,
        display_concurrency: as_.displayConcurrency,
        display_switch_rate_trend: as_.displaySwitchRateTrend,
        display_throughput_trend: as_.displayThroughputTrend,
        display_latency_histogram: as_.displayLatencyHistogram,
        display_error_distribution: as_.displayErrorDistribution,
        display_error_trend: as_.displayErrorTrend,
        display_image_generation_stats: as_.displayImageGenerationStats,
        auto_refresh_enabled: as_.autoRefreshEnabled,
        auto_refresh_interval_seconds: as_.autoRefreshIntervalSeconds,
      }
      promises.push(actionStore.updateAdvancedSettings(advReq))
    }
    await Promise.all(promises)
    appStore.showSuccess(t('admin.ops.settings.saveSuccess'))
    emit('saved')
    emit('close')
  } catch (err: any) {
    console.error('[OpsSettingsDialog] Failed to save settings', err)
    appStore.showError(err?.response?.data?.message || err?.response?.data?.detail || t('admin.ops.settings.saveFailed'))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <BaseDialog :show="show" :title="t('admin.ops.settings.title')" width="extra-wide" @close="emit('close')">
    <div v-if="loading" class="py-10 text-center text-sm text-gray-500">
      {{ t('common.loading') }}
    </div>

    <div v-else-if="runtimeSettings && emailConfig && advancedSettings" class="space-y-6">
      <!-- 验证错误 -->
      <div v-if="!validation.valid" class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
        <div class="font-bold">{{ t('admin.ops.settings.validation.title') }}</div>
        <ul class="mt-1 list-disc space-y-1 pl-4">
          <li v-for="msg in validation.errors" :key="msg">{{ msg }}</li>
        </ul>
      </div>

      <!-- 数据采集频率 -->
      <div class="rounded-2xl bg-gray-50 p-4 dark:bg-dark-700/50">
        <h4 class="mb-3 text-sm font-semibold text-gray-900 dark:text-white">{{ t('admin.ops.settings.dataCollection') }}</h4>
        <div>
          <label class="input-label">{{ t('admin.ops.settings.evaluationInterval') }}</label>
          <input
            v-model.number="runtimeSettings.evaluationIntervalSeconds"
            type="number"
            min="1"
            max="86400"
            class="input"
          />
          <p class="mt-1 text-xs text-gray-500">{{ t('admin.ops.settings.evaluationIntervalHint') }}</p>
        </div>
      </div>

      <!-- 预警配置 -->
      <div class="rounded-2xl bg-gray-50 p-4 dark:bg-dark-700/50">
        <h4 class="mb-3 text-sm font-semibold text-gray-900 dark:text-white">{{ t('admin.ops.settings.alertConfig') }}</h4>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="font-medium text-gray-900 dark:text-white">{{ t('admin.ops.settings.enableAlert') }}</label>
            </div>
            <Toggle v-model="emailConfig.alert.enabled" />
          </div>

          <div v-if="emailConfig.alert.enabled">
            <label class="input-label">{{ t('admin.ops.settings.alertRecipients') }}</label>
            <div class="flex gap-2">
              <input
                v-model="alertRecipientInput"
                type="email"
                class="input"
                :placeholder="t('admin.ops.settings.emailPlaceholder')"
                @keydown.enter.prevent="addRecipient('alert')"
              />
              <button class="btn btn-secondary whitespace-nowrap" type="button" @click="addRecipient('alert')">
                {{ t('common.add') }}
              </button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="email in emailConfig.alert.recipients"
                :key="email"
                class="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {{ email }}
                <button type="button" class="text-blue-700/80 hover:text-blue-900" @click="removeRecipient('alert', email)">×</button>
              </span>
            </div>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {{ t('admin.ops.settings.recipientsHint') }}
            </p>
          </div>

          <div v-if="emailConfig.alert.enabled">
            <label class="input-label">{{ t('admin.ops.settings.minSeverity') }}</label>
            <Select v-model="emailConfig.alert.minSeverity" :options="severityOptions" />
          </div>
        </div>
      </div>

      <!-- 评估报告配置 -->
      <div class="rounded-2xl bg-gray-50 p-4 dark:bg-dark-700/50">
        <h4 class="mb-3 text-sm font-semibold text-gray-900 dark:text-white">{{ t('admin.ops.settings.reportConfig') }}</h4>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="font-medium text-gray-900 dark:text-white">{{ t('admin.ops.settings.enableReport') }}</label>
            </div>
            <Toggle v-model="emailConfig.report.enabled" />
          </div>

          <div v-if="emailConfig.report.enabled">
            <label class="input-label">{{ t('admin.ops.settings.reportRecipients') }}</label>
            <div class="flex gap-2">
              <input
                v-model="reportRecipientInput"
                type="email"
                class="input"
                :placeholder="t('admin.ops.settings.emailPlaceholder')"
                @keydown.enter.prevent="addRecipient('report')"
              />
              <button class="btn btn-secondary whitespace-nowrap" type="button" @click="addRecipient('report')">
                {{ t('common.add') }}
              </button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="email in emailConfig.report.recipients"
                :key="email"
                class="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {{ email }}
                <button type="button" class="text-blue-700/80 hover:text-blue-900" @click="removeRecipient('report', email)">×</button>
              </span>
            </div>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {{ t('admin.ops.settings.recipientsHint') }}
            </p>
          </div>

          <div v-if="emailConfig.report.enabled" class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.dailySummary') }}</label>
              <Toggle v-model="emailConfig.report.dailySummaryEnabled" />
            </div>
            <div v-if="emailConfig.report.dailySummaryEnabled">
              <input v-model="emailConfig.report.dailySummarySchedule" type="text" class="input" placeholder="0 9 * * *" />
            </div>
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.weeklySummary') }}</label>
              <Toggle v-model="emailConfig.report.weeklySummaryEnabled" />
            </div>
            <div v-if="emailConfig.report.weeklySummaryEnabled">
              <input v-model="emailConfig.report.weeklySummarySchedule" type="text" class="input" placeholder="0 9 * * 1" />
            </div>
          </div>
        </div>
      </div>

      <!-- 指标阈值配置 -->
      <div class="rounded-2xl bg-gray-50 p-4 dark:bg-dark-700/50">
        <h4 class="mb-3 text-sm font-semibold text-gray-900 dark:text-white">{{ t('admin.ops.settings.metricThresholds') }}</h4>
        <p class="mb-4 text-xs text-gray-500 dark:text-gray-400">{{ t('admin.ops.settings.metricThresholdsHint') }}</p>

        <div class="space-y-4">
          <div>
            <label class="input-label">{{ t('admin.ops.settings.slaMinPercent') }}</label>
            <input
              v-model.number="metricThresholds.slaPercentMin"
              type="number"
              min="0"
              max="100"
              step="0.1"
              class="input"
            />
            <p class="mt-1 text-xs text-gray-500">{{ t('admin.ops.settings.slaMinPercentHint') }}</p>
          </div>


          <div>
            <label class="input-label">{{ t('admin.ops.settings.ttftP99MaxMs') }}</label>
            <input
              v-model.number="metricThresholds.ttftP99MsMax"
              type="number"
              min="0"
              step="50"
              class="input"
            />
            <p class="mt-1 text-xs text-gray-500">{{ t('admin.ops.settings.ttftP99MaxMsHint') }}</p>
          </div>

          <div>
            <label class="input-label">{{ t('admin.ops.settings.requestErrorRateMaxPercent') }}</label>
            <input
              v-model.number="metricThresholds.requestErrorRatePercentMax"
              type="number"
              min="0"
              max="100"
              step="0.1"
              class="input"
            />
            <p class="mt-1 text-xs text-gray-500">{{ t('admin.ops.settings.requestErrorRateMaxPercentHint') }}</p>
          </div>

          <div>
            <label class="input-label">{{ t('admin.ops.settings.upstreamErrorRateMaxPercent') }}</label>
            <input
              v-model.number="metricThresholds.upstreamErrorRatePercentMax"
              type="number"
              min="0"
              max="100"
              step="0.1"
              class="input"
            />
            <p class="mt-1 text-xs text-gray-500">{{ t('admin.ops.settings.upstreamErrorRateMaxPercentHint') }}</p>
          </div>
        </div>
      </div>

      <!-- 高级设置 -->
      <details class="rounded-2xl bg-gray-50 dark:bg-dark-700/50">
        <summary class="cursor-pointer p-4 text-sm font-semibold text-gray-900 dark:text-white">
          {{ t('admin.ops.settings.advancedSettings') }}
        </summary>
        <div class="space-y-4 px-4 pb-4">
          <!-- 数据保留策略 -->
          <div class="space-y-3">
            <h5 class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.dataRetention') }}</h5>

            <div class="space-y-2 border-b border-gray-200 pb-4 dark:border-dark-600">
              <div>
                <h6 class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ t('admin.ops.settings.userRequestLogs') }}</h6>
                <p class="mt-1 text-xs text-gray-500">{{ t('admin.ops.settings.userRequestLogsHint') }}</p>
              </div>
              <div class="max-w-xs">
                <label class="input-label">{{ t('admin.ops.settings.userRequestLogRetentionDays') }}</label>
                <input
                  v-model.number="advancedSettings.dataRetention.userRequestLogRetentionDays"
                  type="number"
                  min="1"
                  max="3650"
                  class="input"
                />
              </div>
            </div>

            <div>
              <h6 class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ t('admin.ops.settings.opsMonitoringData') }}</h6>
              <p class="mt-1 text-xs text-gray-500">{{ t('admin.ops.settings.opsMonitoringDataHint') }}</p>
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.enableOpsCleanup') }}</label>
              <Toggle v-model="advancedSettings.dataRetention.cleanupEnabled" />
            </div>

            <div v-if="advancedSettings.dataRetention.cleanupEnabled">
              <label class="input-label">{{ t('admin.ops.settings.cleanupSchedule') }}</label>
              <input
                v-model="advancedSettings.dataRetention.cleanupSchedule"
                type="text"
                class="input"
                placeholder="0 2 * * *"
              />
              <p class="mt-1 text-xs text-gray-500">{{ t('admin.ops.settings.cleanupScheduleHint') }}</p>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label class="input-label">{{ t('admin.ops.settings.errorLogRetentionDays') }}</label>
                <input
                  v-model.number="advancedSettings.dataRetention.errorLogRetentionDays"
                  type="number"
                  min="0"
                  max="365"
                  class="input"
                />
              </div>
              <div>
                <label class="input-label">{{ t('admin.ops.settings.minuteMetricsRetentionDays') }}</label>
                <input
                  v-model.number="advancedSettings.dataRetention.minuteMetricsRetentionDays"
                  type="number"
                  min="0"
                  max="365"
                  class="input"
                />
              </div>
              <div>
                <label class="input-label">{{ t('admin.ops.settings.hourlyMetricsRetentionDays') }}</label>
                <input
                  v-model.number="advancedSettings.dataRetention.hourlyMetricsRetentionDays"
                  type="number"
                  min="0"
                  max="365"
                  class="input"
                />
              </div>
            </div>
            <p class="text-xs text-gray-500">{{ t('admin.ops.settings.retentionDaysHint') }}</p>
          </div>

          <!-- 预聚合任务 -->
          <div class="space-y-3">
            <h5 class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.aggregation') }}</h5>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.enableAggregation') }}</label>
                <p class="mt-1 text-xs text-gray-500">{{ t('admin.ops.settings.aggregationHint') }}</p>
              </div>
              <Toggle v-model="advancedSettings.aggregation.aggregationEnabled" />
            </div>
          </div>

          <!-- OpenAI 账号配额自动暂停（全局默认阈值） -->
          <div class="space-y-3">
            <h5 class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.openaiQuotaAutoPause') }}</h5>
            <p class="text-xs text-gray-500">{{ t('admin.ops.settings.openaiQuotaAutoPauseHint') }}</p>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="input-label">{{ t('admin.ops.settings.openaiQuotaAutoPauseDefault5h') }}</label>
                <input
                  v-model.number="quotaAutoPause5hPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  class="input"
                  data-testid="ops-quota-auto-pause-5h"
                />
              </div>
              <div>
                <label class="input-label">{{ t('admin.ops.settings.openaiQuotaAutoPauseDefault7d') }}</label>
                <input
                  v-model.number="quotaAutoPause7dPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  class="input"
                  data-testid="ops-quota-auto-pause-7d"
                />
              </div>
            </div>
            <p class="text-xs text-gray-500">{{ t('admin.ops.settings.openaiQuotaAutoPauseThresholdHint') }}</p>
          </div>

          <!-- Error Filtering -->
          <div class="space-y-3">
            <h5 class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.errorFiltering') }}</h5>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.ignoreCountTokensErrors') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.ignoreCountTokensErrorsHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.ignoreCountTokensErrors" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.ignoreContextCanceled') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.ignoreContextCanceledHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.ignoreContextCanceled" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.ignoreNoAvailableAccounts') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.ignoreNoAvailableAccountsHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.ignoreNoAvailableAccounts" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.ignoreInsufficientBalanceErrors') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.ignoreInsufficientBalanceErrorsHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.ignoreInsufficientBalanceErrors" />
            </div>
          </div>

          <!-- Auto Refresh -->
          <div class="space-y-3">
            <h5 class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.autoRefresh') }}</h5>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.enableAutoRefresh') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.enableAutoRefreshHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.autoRefreshEnabled" />
            </div>

            <div v-if="advancedSettings.autoRefreshEnabled">
              <label class="input-label">{{ t('admin.ops.settings.refreshInterval') }}</label>
              <Select
                v-model="advancedSettings.autoRefreshIntervalSeconds"
                :options="[
                  { value: 15, label: t('admin.ops.settings.refreshInterval15s') },
                  { value: 30, label: t('admin.ops.settings.refreshInterval30s') },
                  { value: 60, label: t('admin.ops.settings.refreshInterval60s') }
                ]"
              />
            </div>
          </div>

          <!-- Dashboard Cards -->
          <div class="space-y-3">
            <h5 class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.dashboardCards') }}</h5>

            <div class="flex items-center justify-between gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.displayConcurrency') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.displayConcurrencyHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.displayConcurrency" />
            </div>

            <div class="flex items-center justify-between gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.displaySwitchRateTrend') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.displaySwitchRateTrendHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.displaySwitchRateTrend" />
            </div>

            <div class="flex items-center justify-between gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.displayThroughputTrend') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.displayThroughputTrendHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.displayThroughputTrend" />
            </div>

            <div class="flex items-center justify-between gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.displayLatencyHistogram') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.displayLatencyHistogramHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.displayLatencyHistogram" />
            </div>

            <div class="flex items-center justify-between gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.displayErrorDistribution') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.displayErrorDistributionHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.displayErrorDistribution" />
            </div>

            <div class="flex items-center justify-between gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.displayErrorTrend') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.displayErrorTrendHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.displayErrorTrend" />
            </div>

            <div class="flex items-center justify-between gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.displayImageGenerationStats') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.displayImageGenerationStatsHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.displayImageGenerationStats" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.displayAlertEvents') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.displayAlertEventsHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.displayAlertEvents" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.displayOpenAITokenStats') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.displayOpenAITokenStatsHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.displayOpenaiTokenStats" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.displayUserUsageStats') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.displayUserUsageStatsHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.displayUserUsageStats" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('admin.ops.settings.displaySystemLogs') }}</label>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('admin.ops.settings.displaySystemLogsHint') }}
                </p>
              </div>
              <Toggle v-model="advancedSettings.displaySystemLogs" />
            </div>
          </div>
        </div>
      </details>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button class="btn btn-secondary" @click="emit('close')">{{ t('common.cancel') }}</button>
        <button class="btn btn-primary" :disabled="saving || !validation.valid" @click="saveAllSettings">
          {{ saving ? t('common.saving') : t('common.save') }}
        </button>
      </div>
    </template>
  </BaseDialog>
</template>
