import type { OpsRequestDetailsParams } from '@/features/admin-ops/data/datasources/adminOpsDatasource'

// Ops 前端视图层的共享类型（与后端 DTO 解耦）。

export type ChartState = 'loading' | 'empty' | 'ready'

export interface OpsRequestDetailsPreset {
  title: string
  kind?: OpsRequestDetailsParams['kind']
  sort?: OpsRequestDetailsParams['sort']
  min_duration_ms?: number
  max_duration_ms?: number
  ttft_only?: boolean
}

// Re-export ops alert/settings types so view components can import from a single place
// while keeping the API contract centralized in `@/features/admin-ops/data/datasources/adminOpsDatasource`.
export type {
  AlertRule,
  AlertEvent,
  AlertSeverity,
  ThresholdMode,
  MetricType,
  Operator,
  EmailNotificationConfig,
  OpsAlertRuntimeSettings,
  OpsMetricThresholds,
  OpsAdvancedSettings,
  OpsDataRetentionSettings,
  OpsAggregationSettings,
  OpsRuntimeLogConfig,
  OpsSystemLog,
  OpsSystemLogSinkHealth
} from '@/features/admin-ops/data/datasources/adminOpsDatasource'
