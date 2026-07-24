<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  opsAPI,
  type OpsRuntimeLogConfig,
  type OpsSystemLog,
  type OpsSystemLogSinkHealth
} from '@/features/admin-ops/domain/models/opsSystemLog'
import type { OpsSystemLogSinkHealth } from '@/features/admin-ops/domain/models/opsSystemLogSinkHealth'
import { useAdminOpsActionStore } from '@/features/admin-ops/presentation/stores/adminOpsActionStore'
import type { UpdateRuntimeLogConfigRequest } from '@/features/admin-ops/data/requests_models/updateRuntimeLogConfigRequest'
import type { CleanupSystemLogsRequest } from '@/features/admin-ops/data/requests_models/cleanupSystemLogsRequest'
import Pagination from '@/common/widgets/data/Pagination.vue'
import Select from '@/common/widgets/forms/Select.vue'
import Toggle from '@/common/widgets/forms/Toggle.vue'
import { useAppStore } from '@/core/stores/appStore'
import { formatCompactNumber, formatExactNumber } from '@/features/admin-ops/presentation/utils/opsFormatter'

const appStore = useAppStore()
const { t } = useI18n()
const actionStore = useAdminOpsActionStore()

const props = withDefaults(defineProps<{
  platformFilter?: string
  refreshToken?: number
}>(), {
  platformFilter: '',
  refreshToken: 0
})

const loading = ref(false)
const logs = ref<OpsSystemLog[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

const health = ref<OpsSystemLogSinkHealth>({
  queue_depth: 0,
  queue_capacity: 0,
  dropped_count: 0,
  write_failed_count: 0,
  written_count: 0,
  avg_write_delay_ms: 0
})

const runtimeLoading = ref(false)
const runtimeSaving = ref(false)
const runtimeConfig = reactive<OpsRuntimeLogConfig>({
  level: 'info',
  enable_sampling: false,
  sampling_initial: 100,
  sampling_thereafter: 100,
  caller: true,
  stacktrace_level: 'error',
  retention_days: 30,
  redis_only: false
})

const filters = reactive({
  time_range: '1h' as '5m' | '30m' | '1h' | '6h' | '24h' | '7d' | '30d',
  start_time: '',
  end_time: '',
  host: '',
  level: '',
  component: '',
  request_id: '',
  client_request_id: '',
  user_id: '',
  api_key_id: '',
  account_id: '',
  platform: '',
  model: '',
  q: ''
})

const runtimeLevelOptions = [
  { value: 'debug', label: 'debug' },
  { value: 'info', label: 'info' },
  { value: 'warn', label: 'warn' },
  { value: 'error', label: 'error' }
]

const stacktraceLevelOptions = [
  { value: 'none', label: 'none' },
  { value: 'error', label: 'error' },
  { value: 'fatal', label: 'fatal' }
]

const timeRangeOptions = [
  { value: '5m', label: '5m' },
  { value: '30m', label: '30m' },
  { value: '1h', label: '1h' },
  { value: '6h', label: '6h' },
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' }
]

const filterLevelOptions = computed(() => [
  { value: '', label: t('admin.ops.systemLogs.all') },
  { value: 'debug', label: 'debug' },
  { value: 'info', label: 'info' },
  { value: 'warn', label: 'warn' },
  { value: 'error', label: 'error' }
])

const levelBadgeClass = (level: string) => {
  const v = String(level || '').toLowerCase()
  if (v === 'error' || v === 'fatal') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
  if (v === 'warn' || v === 'warning') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  if (v === 'debug') return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
}

const formatTime = (value: string) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString()
}

const getExtraString = (extra: Record<string, any> | undefined, key: string) => {
  if (!extra) return ''
  const v = extra[key]
  if (v == null) return ''
  if (typeof v === 'string') return v.trim()
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return ''
}

const formatSystemLogDetail = (row: OpsSystemLog) => {
  const parts: string[] = []
  const msg = String(row.message || '').trim()
  if (msg) parts.push(msg)

  const extra = row.extra || {}
  const statusCode = getExtraString(extra, 'status_code')
  const latencyMs = getExtraString(extra, 'latency_ms')
  const method = getExtraString(extra, 'method')
  const path = getExtraString(extra, 'path')
  const clientIP = getExtraString(extra, 'client_ip')
  const protocol = getExtraString(extra, 'protocol')

  const accessParts: string[] = []
  if (statusCode) accessParts.push(`status=${statusCode}`)
  if (latencyMs) accessParts.push(`latency_ms=${latencyMs}`)
  if (method) accessParts.push(`method=${method}`)
  if (path) accessParts.push(`path=${path}`)
  if (clientIP) accessParts.push(`ip=${clientIP}`)
  if (protocol) accessParts.push(`proto=${protocol}`)
  if (accessParts.length > 0) parts.push(accessParts.join(' '))

  const corrParts: string[] = []
  if (row.requestId) corrParts.push(`req=${row.requestId}`)
  if (row.clientRequestId) corrParts.push(`client_req=${row.clientRequestId}`)
  if (row.userId != null) corrParts.push(`user=${row.userId}`)
  if (row.apiKeyId != null) corrParts.push(`key=${row.apiKeyId}`)
  if (row.accountId != null) corrParts.push(`acc=${row.accountId}`)
  if (row.platform) corrParts.push(`platform=${row.platform}`)
  if (row.model) corrParts.push(`model=${row.model}`)
  if (corrParts.length > 0) parts.push(corrParts.join(' '))

  const errors = getExtraString(extra, 'errors')
  if (errors) parts.push(`errors=${errors}`)
  const err = getExtraString(extra, 'err') || getExtraString(extra, 'error')
  if (err) parts.push(`error=${err}`)

  // 用空格拼接，交给 CSS 自动换行，尽量“填满再换行”。
  return parts.join('  ')
}

const toRFC3339 = (value: string) => {
  if (!value) return undefined
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}

const buildQuery = () => {
  const query: Record<string, any> = {
    page: page.value,
    page_size: pageSize.value,
    time_range: filters.time_range
  }

  if (filters.time_range === '30d') {
    query.time_range = '30d'
  }
  if (filters.start_time) query.start_time = toRFC3339(filters.start_time)
  if (filters.end_time) query.end_time = toRFC3339(filters.end_time)
  if (filters.host.trim()) query.host = filters.host.trim()
  if (filters.level.trim()) query.level = filters.level.trim()
  if (filters.component.trim()) query.component = filters.component.trim()
  if (filters.requestId.trim()) query.requestId = filters.requestId.trim()
  if (filters.clientRequestId.trim()) query.clientRequestId = filters.clientRequestId.trim()
  if (filters.userId.trim()) {
    const v = Number.parseInt(filters.userId.trim(), 10)
    if (Number.isFinite(v) && v > 0) query.userId = v
  }
  if (filters.apiKeyId.trim()) {
    const v = Number.parseInt(filters.apiKeyId.trim(), 10)
    if (Number.isFinite(v) && v > 0) query.apiKeyId = v
  }
  if (filters.accountId.trim()) {
    const v = Number.parseInt(filters.accountId.trim(), 10)
    if (Number.isFinite(v) && v > 0) query.accountId = v
  }
  if (filters.platform.trim()) query.platform = filters.platform.trim()
  if (filters.model.trim()) query.model = filters.model.trim()
  if (filters.q.trim()) query.q = filters.q.trim()
  return query
}

const fetchLogs = async () => {
  loading.value = true
  try {
    const res = await queryStore.listSystemLogs(buildQuery())
    logs.value = res.items || []
    total.value = res.total || 0
  } catch (err: any) {
    console.error('[OpsSystemLogTable] Failed to fetch logs', err)
    appStore.showError(err?.response?.data?.detail || t('admin.ops.systemLogs.loadFailed'))
  } finally {
    loading.value = false
  }
}

const fetchHealth = async () => {
  try {
    health.value = await queryStore.getSystemLogSinkHealth()
  } catch {
    // 忽略健康数据读取失败，不影响主流程。
  }
}

const loadRuntimeConfig = async () => {
  runtimeLoading.value = true
  try {
    const cfg = await queryStore.getRuntimeLogConfig()
    runtimeConfig.level = cfg.level
    runtimeConfig.enableSampling = cfg.enableSampling
    runtimeConfig.samplingInitial = cfg.samplingInitial
    runtimeConfig.samplingThereafter = cfg.samplingThereafter
    runtimeConfig.caller = cfg.caller
    runtimeConfig.stacktraceLevel = cfg.stacktraceLevel
    runtimeConfig.retentionDays = cfg.retentionDays
    runtimeConfig.redisOnly = cfg.redisOnly ?? false
  } catch (err: any) {
    console.error('[OpsSystemLogTable] Failed to load runtime log config', err)
  } finally {
    runtimeLoading.value = false
  }
}

const saveRuntimeConfig = async () => {
  runtimeSaving.value = true
  try {
    const req: UpdateRuntimeLogConfigRequest = {
      level: runtimeConfig.level,
      enable_sampling: runtimeConfig.enableSampling,
      sampling_initial: runtimeConfig.samplingInitial,
      sampling_thereafter: runtimeConfig.samplingThereafter,
      caller: runtimeConfig.caller,
      stacktrace_level: runtimeConfig.stacktraceLevel,
      retention_days: runtimeConfig.retentionDays,
      redis_only: runtimeConfig.redisOnly ?? false,
    }
    const saved = await actionStore.updateRuntimeLogConfig(req)
    runtimeConfig.level = saved.level
    runtimeConfig.enableSampling = saved.enableSampling
    runtimeConfig.samplingInitial = saved.samplingInitial
    runtimeConfig.samplingThereafter = saved.samplingThereafter
    runtimeConfig.caller = saved.caller
    runtimeConfig.stacktraceLevel = saved.stacktraceLevel
    runtimeConfig.retentionDays = saved.retentionDays
    runtimeConfig.redisOnly = saved.redisOnly ?? false
    appStore.showSuccess(t('admin.ops.systemLogs.runtimeConfigActive'))
  } catch (err: any) {
    console.error('[OpsSystemLogTable] Failed to save runtime log config', err)
    appStore.showError(err?.response?.data?.detail || t('admin.ops.systemLogs.runtimeConfigSaveFailed'))
  } finally {
    runtimeSaving.value = false
  }
}

const resetRuntimeConfig = async () => {
  const ok = window.confirm(t('admin.ops.systemLogs.resetRuntimeConfigConfirm'))
  if (!ok) return

  runtimeSaving.value = true
  try {
    const saved = await actionStore.resetRuntimeLogConfig()
    runtimeConfig.level = saved.level
    runtimeConfig.enableSampling = saved.enableSampling
    runtimeConfig.samplingInitial = saved.samplingInitial
    runtimeConfig.samplingThereafter = saved.samplingThereafter
    runtimeConfig.caller = saved.caller
    runtimeConfig.stacktraceLevel = saved.stacktraceLevel
    runtimeConfig.retentionDays = saved.retentionDays
    runtimeConfig.redisOnly = saved.redisOnly ?? false
    appStore.showSuccess(t('admin.ops.systemLogs.runtimeConfigReset'))
    await fetchHealth()
  } catch (err: any) {
    console.error('[OpsSystemLogTable] Failed to reset runtime log config', err)
    appStore.showError(err?.response?.data?.detail || t('admin.ops.systemLogs.runtimeConfigResetFailed'))
  } finally {
    runtimeSaving.value = false
  }
}

const hasCleanupFilter = computed(() => Boolean(
  filters.start_time ||
  filters.end_time ||
  filters.host.trim() ||
  filters.level.trim() ||
  filters.component.trim() ||
  filters.requestId.trim() ||
  filters.clientRequestId.trim() ||
  filters.userId.trim() ||
  filters.apiKeyId.trim() ||
  filters.accountId.trim() ||
  filters.platform.trim() ||
  filters.model.trim() ||
  filters.q.trim()
))

const cleanupButtonLabel = computed(() => hasCleanupFilter.value
  ? t('admin.ops.systemLogs.cleanCurrentFilters')
  : t('admin.ops.systemLogs.cleanAll'))

const cleanupCurrentFilter = async () => {
  const clearAll = !hasCleanupFilter.value
  const confirmKey = clearAll ? 'admin.ops.systemLogs.cleanupAllConfirm' : 'admin.ops.systemLogs.cleanupConfirm'
  const ok = window.confirm(t(confirmKey))
  if (!ok) return
  try {
    const req: CleanupSystemLogsRequest = {
      clear_all: clearAll,
      start_time: toRFC3339(filters.start_time),
      end_time: toRFC3339(filters.end_time),
      host: filters.host.trim() || undefined,
      level: filters.level.trim() || undefined,
      component: filters.component.trim() || undefined,
      request_id: filters.requestId.trim() || undefined,
      client_request_id: filters.clientRequestId.trim() || undefined,
      user_id: filters.userId.trim() ? Number.parseInt(filters.userId.trim(), 10) : undefined,
      api_key_id: filters.apiKeyId.trim() ? Number.parseInt(filters.apiKeyId.trim(), 10) : undefined,
      account_id: filters.accountId.trim() ? Number.parseInt(filters.accountId.trim(), 10) : undefined,
      platform: filters.platform.trim() || undefined,
      model: filters.model.trim() || undefined,
      q: filters.q.trim() || undefined
    }
    const res = await actionStore.cleanupSystemLogs(req)
    appStore.showSuccess(t('admin.ops.systemLogs.cleanupSuccess', { count: res.deleted || 0 }))
    page.value = 1
    await Promise.all([fetchLogs(), fetchHealth()])
  } catch (err: any) {
    console.error('[OpsSystemLogTable] Failed to cleanup logs', err)
    appStore.showError(err?.response?.data?.detail || t('admin.ops.systemLogs.cleanupFailed'))
  }
}

const resetFilters = () => {
  filters.time_range = '1h'
  filters.start_time = ''
  filters.end_time = ''
  filters.host = ''
  filters.level = ''
  filters.component = ''
  filters.requestId = ''
  filters.clientRequestId = ''
  filters.userId = ''
  filters.apiKeyId = ''
  filters.accountId = ''
  filters.platform = props.platformFilter || ''
  filters.model = ''
  filters.q = ''
  page.value = 1
  fetchLogs()
}

watch(() => props.platformFilter, (v) => {
  if (v && !filters.platform) {
    filters.platform = v
    page.value = 1
    fetchLogs()
  }
})

watch(() => props.refreshToken, () => {
  fetchLogs()
  fetchHealth()
})

const onPageChange = (next: number) => {
  page.value = next
  fetchLogs()
}

const onPageSizeChange = (next: number) => {
  pageSize.value = next
  page.value = 1
  fetchLogs()
}

const applyFilters = () => {
  page.value = 1
  fetchLogs()
}

const hasData = computed(() => logs.value.length > 0)

onMounted(async () => {
  if (props.platformFilter) {
    filters.platform = props.platformFilter
  }
  await Promise.all([fetchLogs(), fetchHealth(), loadRuntimeConfig()])
})
</script>

<template>
  <section class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-dark-700 dark:bg-dark-900/60">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ t('admin.ops.systemLogs.title') }}</h3>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ t('admin.ops.systemLogs.description') }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span class="rounded-md bg-gray-100 px-2 py-1 tabular-nums text-gray-700 dark:bg-dark-700 dark:text-gray-200" :title="`${formatExactNumber(health.queueDepth)} / ${formatExactNumber(health.queueCapacity)}`">{{ t('admin.ops.systemLogs.queue') }} {{ formatCompactNumber(health.queueDepth) }}/{{ formatCompactNumber(health.queueCapacity) }}</span>
        <span class="rounded-md bg-gray-100 px-2 py-1 tabular-nums text-gray-700 dark:bg-dark-700 dark:text-gray-200" :title="formatExactNumber(health.writtenCount)">{{ t('admin.ops.systemLogs.written') }} {{ formatCompactNumber(health.writtenCount) }}</span>
        <span class="rounded-md bg-amber-100 px-2 py-1 tabular-nums text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :title="formatExactNumber(health.droppedCount)">{{ t('admin.ops.systemLogs.dropped') }} {{ formatCompactNumber(health.droppedCount) }}</span>
        <span class="rounded-md bg-red-100 px-2 py-1 tabular-nums text-red-700 dark:bg-red-900/30 dark:text-red-300" :title="formatExactNumber(health.writeFailedCount)">{{ t('admin.ops.systemLogs.failed') }} {{ formatCompactNumber(health.writeFailedCount) }}</span>
      </div>
    </div>

    <div class="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-dark-700 dark:bg-dark-800/70">
      <div class="mb-2 flex items-center justify-between">
        <div class="text-xs font-semibold text-gray-700 dark:text-gray-200">{{ t('admin.ops.systemLogs.runtimeConfig') }}</div>
        <span v-if="runtimeLoading" class="text-xs text-gray-500">{{ t('common.loading') }}</span>
      </div>
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
        <label class="text-xs text-gray-600 dark:text-gray-300">
          {{ t('admin.ops.systemLogs.level') }}
          <Select v-model="runtimeConfig.level" class="mt-1" :options="runtimeLevelOptions" />
        </label>
        <label class="text-xs text-gray-600 dark:text-gray-300">
          {{ t('admin.ops.systemLogs.stacktraceThreshold') }}
          <Select v-model="runtimeConfig.stacktraceLevel" class="mt-1" :options="stacktraceLevelOptions" />
        </label>
        <label class="text-xs text-gray-600 dark:text-gray-300">
          {{ t('admin.ops.systemLogs.samplingInitial') }}
          <input v-model.number="runtimeConfig.samplingInitial" type="number" min="1" class="input mt-1" />
        </label>
        <label class="text-xs text-gray-600 dark:text-gray-300">
          {{ t('admin.ops.systemLogs.samplingThereafter') }}
          <input v-model.number="runtimeConfig.samplingThereafter" type="number" min="1" class="input mt-1" />
        </label>
        <label class="text-xs text-gray-600 dark:text-gray-300">
          {{ t('admin.ops.systemLogs.retentionDays') }}
          <input v-model.number="runtimeConfig.retentionDays" type="number" min="1" max="3650" class="input mt-1" :disabled="runtimeConfig.redisOnly" />
        </label>
        <div class="md:col-span-2 xl:col-span-6">
          <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label class="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <input v-model="runtimeConfig.caller" type="checkbox" />
                {{ t('admin.ops.systemLogs.caller') }}
              </label>
              <label class="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <input v-model="runtimeConfig.enableSampling" type="checkbox" />
                {{ t('admin.ops.systemLogs.sampling') }}
              </label>
              <div class="flex items-center gap-3">
                <Toggle v-model="runtimeConfig.redisOnly" />
                <div>
                  <div class="text-xs font-medium text-gray-700 dark:text-gray-200">{{ t('admin.ops.systemLogs.redisOnly') }}</div>
                  <div class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{{ t('admin.ops.systemLogs.redisOnlyHint') }}</div>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2 lg:justify-end">
              <button type="button" class="btn btn-primary btn-sm" :disabled="runtimeSaving" @click="saveRuntimeConfig">
                {{ runtimeSaving ? t('common.saving') : t('admin.ops.systemLogs.saveAndApply') }}
              </button>
              <button type="button" class="btn btn-secondary btn-sm" :disabled="runtimeSaving" @click="resetRuntimeConfig">
                {{ t('admin.ops.systemLogs.resetDefaults') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <p v-if="health.lastError" class="mt-2 text-xs text-red-600 dark:text-red-400">{{ t('admin.ops.systemLogs.latestWriteError') }} {{ health.lastError }}</p>
    </div>

    <div class="mb-4 grid grid-cols-1 gap-3 md:grid-cols-5">
      <label class="text-xs text-gray-600 dark:text-gray-300">
        {{ t('admin.ops.systemLogs.timeRange') }}
        <Select v-model="filters.time_range" class="mt-1" :options="timeRangeOptions" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">
        {{ t('admin.ops.systemLogs.startTime') }}
        <input v-model="filters.start_time" type="datetime-local" class="input mt-1" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">
        {{ t('admin.ops.systemLogs.endTime') }}
        <input v-model="filters.end_time" type="datetime-local" class="input mt-1" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">
        {{ t('admin.ops.systemLogs.level') }}
        <Select v-model="filters.level" class="mt-1" :options="filterLevelOptions" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">
        {{ t('admin.ops.systemLogs.component') }}
        <input v-model="filters.component" type="text" class="input mt-1" :placeholder="t('admin.ops.systemLogs.componentPlaceholder')" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">
        {{ t('admin.ops.systemLogs.host') }}
        <input v-model="filters.host" type="text" class="input mt-1" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">
        request_id
        <input v-model="filters.requestId" type="text" class="input mt-1" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">
        client_request_id
        <input v-model="filters.clientRequestId" type="text" class="input mt-1" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">
        user_id
        <input v-model="filters.userId" type="text" class="input mt-1" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">
        {{ t('admin.ops.systemLogs.keyId') }}
        <input v-model="filters.apiKeyId" type="text" class="input mt-1" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">
        account_id
        <input v-model="filters.accountId" type="text" class="input mt-1" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">
        {{ t('admin.ops.systemLogs.platform') }}
        <input v-model="filters.platform" type="text" class="input mt-1" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">
        {{ t('admin.ops.systemLogs.model') }}
        <input v-model="filters.model" type="text" class="input mt-1" />
      </label>
      <label class="text-xs text-gray-600 dark:text-gray-300">
        {{ t('admin.ops.systemLogs.keyword') }}
        <input v-model="filters.q" type="text" class="input mt-1" :placeholder="t('admin.ops.systemLogs.keywordPlaceholder')" />
      </label>
    </div>

    <div class="mb-3 flex flex-wrap gap-2">
      <button type="button" class="btn btn-primary btn-sm" @click="applyFilters">{{ t('admin.ops.systemLogs.search') }}</button>
      <button type="button" class="btn btn-secondary btn-sm" @click="resetFilters">{{ t('common.reset') }}</button>
      <button type="button" class="btn btn-danger btn-sm" @click="cleanupCurrentFilter">{{ cleanupButtonLabel }}</button>
      <button type="button" class="btn btn-secondary btn-sm" @click="fetchHealth">{{ t('admin.ops.systemLogs.refreshHealth') }}</button>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-dark-700">
      <div v-if="loading" class="px-4 py-8 text-center text-sm text-gray-500">{{ t('common.loading') }}</div>
      <div v-else-if="!hasData" class="px-4 py-8 text-center text-sm text-gray-500">{{ t('admin.ops.systemLogs.empty') }}</div>
      <div v-else class="overflow-auto">
        <table class="min-w-full table-fixed divide-y divide-gray-200 dark:divide-dark-700">
          <thead class="bg-gray-50 dark:bg-dark-900">
            <tr>
              <th class="w-[170px] px-3 py-2 text-left text-[11px] font-semibold text-gray-500">{{ t('admin.ops.systemLogs.time') }}</th>
              <th class="w-[160px] px-3 py-2 text-left text-[11px] font-semibold text-gray-500">{{ t('admin.ops.systemLogs.host') }}</th>
              <th class="w-[80px] px-3 py-2 text-left text-[11px] font-semibold text-gray-500">{{ t('admin.ops.systemLogs.level') }}</th>
              <th class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500">{{ t('admin.ops.systemLogs.logDetails') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-dark-800">
            <tr v-for="row in logs" :key="row.id" class="align-top">
              <td class="px-3 py-2 text-xs text-gray-700 dark:text-gray-300">{{ formatTime(row.createdAt) }}</td>
              <td class="px-3 py-2 text-xs text-gray-700 dark:text-gray-300">
                <span class="block truncate" :title="row.host || '-'">{{ row.host || '-' }}</span>
              </td>
              <td class="px-3 py-2 text-xs">
                <span class="inline-flex rounded-full px-2 py-0.5 font-semibold" :class="levelBadgeClass(row.level)">
                  {{ row.level }}
                </span>
              </td>
              <td class="px-3 py-2 text-xs text-gray-700 dark:text-gray-300 whitespace-normal break-all">
                {{ formatSystemLogDetail(row) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="onPageChange"
        @update:page-size="onPageSizeChange"
      />
    </div>
  </section>
</template>
