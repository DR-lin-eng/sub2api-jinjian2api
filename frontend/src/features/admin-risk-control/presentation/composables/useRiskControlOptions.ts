import { computed, type Ref } from 'vue'
import type { useI18n } from 'vue-i18n'
import type {
  ContentModerationModelFilterType,
  KeywordBlockingMode,
  ModerationMode,
} from '@/features/admin-risk-control/data/datasources/adminRiskControlDatasource'
import type { AdminGroup, SelectOption } from '@/types'

export type RiskControlSettingsTab =
  | 'basic'
  | 'scope'
  | 'runtime'
  | 'response'
  | 'riskThresholds'
  | 'retention'
  | 'keywords'

export function useRiskControlOptions(
  t: ReturnType<typeof useI18n>['t'],
  groups: Ref<AdminGroup[]>,
  config: {
    mode: ModerationMode
    keyword_blocking_mode: KeywordBlockingMode
  },
) {
  const settingsTabs = computed<Array<{ id: RiskControlSettingsTab; label: string }>>(() => [
    { id: 'basic', label: t('admin.riskControl.tabs.basic') },
    { id: 'scope', label: t('admin.riskControl.tabs.scope') },
    { id: 'runtime', label: t('admin.riskControl.tabs.runtime') },
    { id: 'response', label: t('admin.riskControl.tabs.response') },
    { id: 'riskThresholds', label: t('admin.riskControl.tabs.riskThresholds') },
    { id: 'keywords', label: t('admin.riskControl.tabs.keywords') },
    { id: 'retention', label: t('admin.riskControl.tabs.retention') },
  ])

  const modeOptions = computed<SelectOption[]>(() => [
    { value: 'pre_block', label: t('admin.riskControl.modePreBlock') },
    { value: 'observe', label: t('admin.riskControl.modeObserve') },
    { value: 'off', label: t('admin.riskControl.modeOff') },
  ])

  const keywordBlockingModeOptions = computed<Array<{
    value: KeywordBlockingMode
    label: string
    description: string
  }>>(() => [
    {
      value: 'keyword_and_api',
      label: t('admin.riskControl.keywordModeKeywordAndApi'),
      description: t('admin.riskControl.keywordModeKeywordAndApiDesc'),
    },
    {
      value: 'keyword_only',
      label: t('admin.riskControl.keywordModeKeywordOnly'),
      description: t('admin.riskControl.keywordModeKeywordOnlyDesc'),
    },
    {
      value: 'api_only',
      label: t('admin.riskControl.keywordModeApiOnly'),
      description: t('admin.riskControl.keywordModeApiOnlyDesc'),
    },
  ])

  const modelFilterOptions = computed<Array<{
    value: ContentModerationModelFilterType
    label: string
    description: string
  }>>(() => [
    {
      value: 'all',
      label: t('admin.riskControl.modelFilterAll'),
      description: t('admin.riskControl.modelFilterAllDesc'),
    },
    {
      value: 'include',
      label: t('admin.riskControl.modelFilterInclude'),
      description: t('admin.riskControl.modelFilterIncludeDesc'),
    },
    {
      value: 'exclude',
      label: t('admin.riskControl.modelFilterExclude'),
      description: t('admin.riskControl.modelFilterExcludeDesc'),
    },
  ])

  const resultOptions = computed<SelectOption[]>(() => [
    { value: '', label: t('admin.riskControl.result.all') },
    { value: 'hit', label: t('admin.riskControl.result.hit') },
    { value: 'blocked', label: t('admin.riskControl.result.blocked') },
    { value: 'pass', label: t('admin.riskControl.result.pass') },
    { value: 'error', label: t('admin.riskControl.result.error') },
  ])

  const endpointOptions = computed<SelectOption[]>(() => [
    { value: '', label: t('admin.riskControl.filters.allEndpoints') },
    { value: '/v1/messages', label: '/v1/messages' },
    { value: '/v1/responses', label: '/v1/responses' },
    { value: '/v1/chat/completions', label: '/v1/chat/completions' },
    { value: '/v1beta/models', label: '/v1beta/models' },
    { value: '/v1/images/generations', label: '/v1/images/generations' },
    { value: '/v1/images/edits', label: '/v1/images/edits' },
  ])

  const groupFilterOptions = computed<SelectOption[]>(() => [
    { value: 0, label: t('admin.riskControl.filters.allGroups') },
    ...groups.value.map((group) => ({
      value: group.id,
      label: `${group.name} (${group.platform})`,
    })),
  ])

  const keywordNoticeTones = {
    info: {
      icon: 'infoCircle' as const,
      toneClass: 'border-primary-100 bg-primary-50/60 dark:border-primary-900/40 dark:bg-primary-900/10',
      iconClass: 'mt-0.5 flex-shrink-0 text-primary-500 dark:text-primary-300',
      titleClass: 'text-primary-700 dark:text-primary-200',
    },
    warning: {
      icon: 'exclamationTriangle' as const,
      toneClass: 'border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20',
      iconClass: 'mt-0.5 flex-shrink-0 text-amber-500 dark:text-amber-300',
      titleClass: 'text-amber-700 dark:text-amber-200',
    },
  }

  const keywordNotice = computed(() => {
    const strategy = config.keyword_blocking_mode
    if (strategy === 'api_only') {
      return {
        ...keywordNoticeTones.info,
        title: t('admin.riskControl.keywordModeApiOnlyNotice'),
        description: t('admin.riskControl.keywordModeApiOnlyDesc'),
      }
    }
    if (config.mode !== 'pre_block') {
      const label = modeOptions.value.find((option) => option.value === config.mode)?.label ?? config.mode
      return {
        ...keywordNoticeTones.warning,
        title: t('admin.riskControl.blockedKeywordsModeWarning', { mode: label }),
        description: t('admin.riskControl.blockedKeywordsDescription'),
      }
    }
    if (strategy === 'keyword_only') {
      return {
        ...keywordNoticeTones.info,
        title: t('admin.riskControl.keywordModeKeywordOnlyNotice'),
        description: t('admin.riskControl.keywordModeKeywordOnlyDesc'),
      }
    }
    return {
      ...keywordNoticeTones.info,
      title: t('admin.riskControl.blockedKeywordsPreBlockHint'),
      description: t('admin.riskControl.blockedKeywordsDescription'),
    }
  })

  return {
    endpointOptions,
    groupFilterOptions,
    keywordBlockingModeOptions,
    keywordNotice,
    modeOptions,
    modelFilterOptions,
    resultOptions,
    settingsTabs,
  }
}
