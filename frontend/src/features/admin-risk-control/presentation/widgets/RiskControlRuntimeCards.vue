<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  ContentModerationAPIKeyLoad,
  ContentModerationAPIKeyStatus,
  ContentModerationRuntimeStatus,
  ModerationMode,
} from '@/features/admin-risk-control/data/datasources/adminRiskControlDatasource'
import { formatDateTime as formatDateTimeValue } from '@/core/utils/format'

interface Props {
  status: ContentModerationRuntimeStatus | null
  mode: ModerationMode
  workerCount: number
  queueSize: number
}

type WorkerSlotState = 'active' | 'idle' | 'disabled'

const props = defineProps<Props>()
const { t } = useI18n()

const runtimeMode = computed<ModerationMode>(() => props.status?.mode ?? props.mode)
const showPreBlockRuntimeCard = computed(() => runtimeMode.value === 'pre_block')
const showWorkerRuntimeCard = computed(() => runtimeMode.value === 'observe')

const queueUsagePercent = computed(
  () => `${Math.min(100, Math.max(0, props.status?.queue_usage_percent ?? 0)).toFixed(1)}%`,
)
const queueUsageStyle = computed(() => ({ width: queueUsagePercent.value }))

const preBlockMetricItems = computed(() => [
  {
    key: 'active',
    label: t('admin.riskControl.preBlockActive'),
    value: formatNumber(props.status?.pre_block_active ?? 0),
    meta: t('admin.riskControl.preBlockActiveHint'),
    class: 'bg-sky-50 dark:bg-sky-900/10',
    valueClass: 'text-sky-700 dark:text-sky-300',
  },
  {
    key: 'checked',
    label: t('admin.riskControl.preBlockChecked'),
    value: formatNumber(props.status?.pre_block_checked ?? 0),
    meta: t('admin.riskControl.preBlockCheckedHint'),
    class: 'bg-gray-50 dark:bg-dark-700/50',
    valueClass: 'text-gray-900 dark:text-white',
  },
  {
    key: 'allowed',
    label: t('admin.riskControl.preBlockAllowed'),
    value: formatNumber(props.status?.pre_block_allowed ?? 0),
    meta: t('admin.riskControl.preBlockAllowedHint'),
    class: 'bg-emerald-50 dark:bg-emerald-900/10',
    valueClass: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    key: 'blocked',
    label: t('admin.riskControl.preBlockBlocked'),
    value: formatNumber(props.status?.pre_block_blocked ?? 0),
    meta: t('admin.riskControl.preBlockBlockedHint'),
    class: 'bg-rose-50 dark:bg-rose-900/10',
    valueClass: 'text-rose-700 dark:text-rose-300',
  },
  {
    key: 'errors',
    label: t('admin.riskControl.preBlockErrors'),
    value: formatNumber(props.status?.pre_block_errors ?? 0),
    meta: t('admin.riskControl.preBlockErrorsHint'),
    class: 'bg-amber-50 dark:bg-amber-900/10',
    valueClass: 'text-amber-700 dark:text-amber-300',
  },
  {
    key: 'latency',
    label: t('admin.riskControl.preBlockAvgLatency'),
    value: `${formatNumber(props.status?.pre_block_avg_latency_ms ?? 0)} ms`,
    meta: t('admin.riskControl.preBlockAvgLatencyHint'),
    class: 'bg-violet-50 dark:bg-violet-900/10',
    valueClass: 'text-violet-700 dark:text-violet-300',
  },
])

const preBlockAPIKeyLoads = computed<ContentModerationAPIKeyLoad[]>(() =>
  [...(props.status?.pre_block_api_key_loads ?? [])].sort((a, b) => a.index - b.index),
)
const preBlockAPIKeyMaxTotal = computed(() =>
  Math.max(1, ...preBlockAPIKeyLoads.value.map((item) => item.total || 0)),
)
const preBlockAPIKeyLoadSummaryText = computed(() =>
  t('admin.riskControl.preBlockAPIKeyLoadSummary', {
    active: formatNumber(props.status?.pre_block_api_key_active ?? 0),
    available: formatNumber(props.status?.pre_block_api_key_available_count ?? 0),
    total: formatNumber(props.status?.pre_block_api_key_total_calls ?? 0),
    workerActive: formatNumber(props.status?.active_workers ?? 0),
    workerTotal: formatNumber(props.status?.worker_count ?? props.workerCount),
  }),
)

const workerSlots = computed(() => {
  const total = Math.max(0, props.status?.worker_count ?? props.workerCount)
  const active = Math.max(0, props.status?.active_workers ?? 0)
  const enabled = Boolean(
    props.status?.risk_control_enabled &&
      props.status?.enabled &&
      props.status?.mode !== 'off',
  )
  return Array.from({ length: total }, (_, index) => ({
    id: index + 1,
    state: (!enabled ? 'disabled' : index < active ? 'active' : 'idle') as WorkerSlotState,
    label: !enabled
      ? t('admin.riskControl.workerDisabled')
      : index < active
        ? t('admin.riskControl.workerActive')
        : t('admin.riskControl.workerIdle'),
  }))
})

function preBlockAPIKeyLoadWidth(total: number): string {
  return `${Math.min(100, Math.max(0, (total / preBlockAPIKeyMaxTotal.value) * 100)).toFixed(1)}%`
}

function modeLabel(mode: ModerationMode): string {
  const labels: Record<ModerationMode, string> = {
    pre_block: t('admin.riskControl.modePreBlock'),
    observe: t('admin.riskControl.modeObserve'),
    off: t('admin.riskControl.modeOff'),
  }
  return labels[mode]
}

function apiKeyStatusDotClass(status: ContentModerationAPIKeyStatus['status']): string {
  const classes: Record<ContentModerationAPIKeyStatus['status'], string> = {
    ok: 'bg-emerald-500',
    error: 'bg-amber-500',
    frozen: 'bg-red-500',
    unknown: 'bg-gray-400',
  }
  return classes[status] ?? classes.unknown
}

function workerSlotClass(state: WorkerSlotState): string {
  if (state === 'active') {
    return 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-900/20 dark:text-sky-300'
  }
  if (state === 'idle') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-300'
  }
  return 'border-gray-100 bg-white text-gray-400 dark:border-dark-700 dark:bg-dark-800 dark:text-gray-500'
}

function workerDotClass(state: WorkerSlotState): string {
  if (state === 'active') return 'bg-sky-500'
  if (state === 'idle') return 'bg-emerald-500'
  return 'bg-gray-300 dark:bg-dark-500'
}

function formatDateTime(value: string): string {
  return formatDateTimeValue(value) || '-'
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value)
}
</script>

<template>
<div
    v-if="showPreBlockRuntimeCard"
    data-test="pre-block-runtime-cards"
    class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,520px)_minmax(0,1fr)]"
  >
    <div data-test="pre-block-sync-card" class="card">
      <div class="flex flex-col gap-4 border-b border-gray-100 px-6 py-4 dark:border-dark-700 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('admin.riskControl.preBlockSyncStatus') }}</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ t('admin.riskControl.preBlockSyncHint') }}</p>
        </div>
        <span class="inline-flex w-fit items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-dark-700 dark:text-gray-300">
          {{ modeLabel(status?.mode ?? props.mode) }}
        </span>
      </div>

      <div class="p-6">
        <div data-test="pre-block-metric-grid" class="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div
            v-for="item in preBlockMetricItems"
            :key="item.key"
            class="rounded-lg p-4"
            :class="item.class"
          >
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.label }}</p>
            <p class="mt-2 truncate text-2xl font-semibold leading-8" :class="item.valueClass">{{ item.value }}</p>
            <p v-if="item.meta" class="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{{ item.meta }}</p>
          </div>
        </div>
      </div>
    </div>

    <div data-test="pre-block-api-key-load-card" class="card">
      <div class="flex flex-col gap-4 border-b border-gray-100 px-6 py-4 dark:border-dark-700 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('admin.riskControl.preBlockAPIKeyLoad') }}</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ t('admin.riskControl.preBlockAPIKeyLoadHint') }}
          </p>
        </div>
        <span class="inline-flex w-fit items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-dark-700 dark:text-gray-300">
          {{ preBlockAPIKeyLoadSummaryText }}
        </span>
      </div>

      <div class="p-6">
        <div
          v-if="preBlockAPIKeyLoads.length > 0"
          data-test="pre-block-api-key-load-list"
          class="max-h-[280px] space-y-3 overflow-y-auto pr-1"
        >
          <div
            v-for="item in preBlockAPIKeyLoads"
            :key="item.key_hash || item.index"
            class="rounded-lg bg-gray-50 p-3 dark:bg-dark-700/50"
          >
            <div class="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="min-w-0">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="font-mono text-sm font-semibold text-gray-900 dark:text-white">#{{ item.index + 1 }}</span>
                  <span class="truncate font-mono text-sm text-gray-700 dark:text-gray-200">{{ item.masked || '-' }}</span>
                  <span class="h-2 w-2 flex-shrink-0 rounded-full" :class="apiKeyStatusDotClass(item.status)"></span>
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ t('admin.riskControl.preBlockAPIKeyTotals', { total: formatNumber(item.total), success: formatNumber(item.success), errors: formatNumber(item.errors) }) }}
                </p>
              </div>
              <div class="grid grid-cols-4 gap-2 text-right text-xs text-gray-500 dark:text-gray-400 sm:min-w-[280px]">
                <div>
                  <p>{{ t('admin.riskControl.preBlockKeyActiveShort') }}</p>
                  <p class="mt-1 text-sm font-semibold text-sky-700 dark:text-sky-300">{{ formatNumber(item.active) }}</p>
                </div>
                <div>
                  <p>{{ t('admin.riskControl.preBlockKeyTotalShort') }}</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ formatNumber(item.total) }}</p>
                </div>
                <div>
                  <p>{{ t('admin.riskControl.preBlockKeyAvgShort') }}</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ formatNumber(item.avg_latency_ms) }} ms</p>
                </div>
                <div>
                  <p>{{ t('admin.riskControl.preBlockKeyLastShort') }}</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ formatNumber(item.last_latency_ms) }} ms</p>
                </div>
              </div>
            </div>
            <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-white dark:bg-dark-900">
              <div class="h-full rounded-full bg-sky-500" :style="{ width: preBlockAPIKeyLoadWidth(item.total) }"></div>
            </div>
          </div>
        </div>
        <p v-else class="rounded-lg bg-gray-50 p-4 text-sm text-gray-500 dark:bg-dark-700/50 dark:text-gray-400">
          {{ t('admin.riskControl.preBlockAPIKeyLoadEmpty') }}
        </p>
      </div>
    </div>
  </div>

  <div v-if="showWorkerRuntimeCard" class="card">
    <div class="flex flex-col gap-4 border-b border-gray-100 px-6 py-4 dark:border-dark-700 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('admin.riskControl.workerStatus') }}</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ t('admin.riskControl.workerStatusHint') }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>{{ t('admin.riskControl.autoRefresh') }}</span>
        <span v-if="status?.last_cleanup_at">
          {{ t('admin.riskControl.lastCleanup', { time: formatDateTime(status.last_cleanup_at) }) }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[minmax(0,360px)_1fr]">
      <div class="space-y-4">
        <div class="rounded-lg border border-gray-100 p-4 dark:border-dark-700">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ t('admin.riskControl.queueUsage') }}</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ formatNumber(status?.queue_length ?? 0) }} / {{ formatNumber(status?.queue_size ?? props.queueSize) }}
              </p>
            </div>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ queueUsagePercent }}</span>
          </div>
          <div class="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-700">
            <div class="h-full rounded-full bg-primary-500 transition-all duration-300" :style="queueUsageStyle"></div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-lg bg-gray-50 p-4 dark:bg-dark-700/50">
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('admin.riskControl.activeWorkers') }}</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ status?.active_workers ?? 0 }}</p>
          </div>
          <div class="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/10">
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('admin.riskControl.idleWorkers') }}</p>
            <p class="mt-2 text-2xl font-semibold text-emerald-700 dark:text-emerald-300">{{ status?.idle_workers ?? props.workerCount }}</p>
          </div>
          <div class="rounded-lg bg-gray-50 p-4 dark:bg-dark-700/50">
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('admin.riskControl.processed') }}</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ formatNumber(status?.processed ?? 0) }}</p>
          </div>
          <div class="rounded-lg bg-gray-50 p-4 dark:bg-dark-700/50">
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('admin.riskControl.droppedErrors') }}</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ formatNumber((status?.dropped ?? 0) + (status?.errors ?? 0)) }}</p>
          </div>
        </div>
      </div>

      <div>
        <div class="mb-3 flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ t('admin.riskControl.workerPool') }}</p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ t('admin.riskControl.workerPoolMeta', { active: status?.active_workers ?? 0, idle: status?.idle_workers ?? props.workerCount, total: status?.worker_count ?? props.workerCount }) }}
            </p>
          </div>
          <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-dark-700 dark:text-gray-300">
            {{ modeLabel(status?.mode ?? props.mode) }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
          <div
            v-for="worker in workerSlots"
            :key="worker.id"
            class="flex h-12 items-center justify-between rounded-lg border px-3 transition-colors"
            :class="workerSlotClass(worker.state)"
            :title="worker.label"
          >
            <span class="text-sm font-semibold">#{{ worker.id }}</span>
            <span class="h-2.5 w-2.5 rounded-full" :class="workerDotClass(worker.state)"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
