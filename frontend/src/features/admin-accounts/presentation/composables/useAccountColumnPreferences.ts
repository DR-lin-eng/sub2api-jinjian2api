import { reactive } from 'vue'

const DEFAULT_HIDDEN_COLUMNS = [
  'today_stats',
  'hourly_usage',
  'proxy',
  'notes',
  'priority',
  'scheduler_score',
  'rate_multiplier'
]
const HIDDEN_COLUMNS_KEY = 'account-hidden-columns'
const HIDDEN_COLUMNS_VERSION_KEY = 'account-hidden-columns-version'
const HIDDEN_COLUMNS_CURRENT_VERSION = 'scheduler-score-hidden-by-default'
const HOURLY_USAGE_COLUMN_VERSION_KEY = 'account-hourly-usage-column-version'
const HOURLY_USAGE_COLUMN_CURRENT_VERSION = 'hidden-by-default-v1'

interface AccountColumnPreferencesOptions {
  getParams: () => Record<string, unknown>
  refreshTodayStats: () => Promise<void>
  reloadAccounts: () => Promise<void>
}

export function useAccountColumnPreferences(options: AccountColumnPreferencesOptions) {
  const hiddenColumns = reactive<Set<string>>(new Set())

  const loadSavedColumns = () => {
    try {
      const saved = localStorage.getItem(HIDDEN_COLUMNS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        parsed.forEach(key => hiddenColumns.add(key))
        if (localStorage.getItem(HIDDEN_COLUMNS_VERSION_KEY) !== HIDDEN_COLUMNS_CURRENT_VERSION) {
          hiddenColumns.add('scheduler_score')
          localStorage.setItem(HIDDEN_COLUMNS_KEY, JSON.stringify([...hiddenColumns]))
          localStorage.setItem(HIDDEN_COLUMNS_VERSION_KEY, HIDDEN_COLUMNS_CURRENT_VERSION)
        }
        if (localStorage.getItem(HOURLY_USAGE_COLUMN_VERSION_KEY) !== HOURLY_USAGE_COLUMN_CURRENT_VERSION) {
          hiddenColumns.add('hourly_usage')
          localStorage.setItem(HIDDEN_COLUMNS_KEY, JSON.stringify([...hiddenColumns]))
          localStorage.setItem(HOURLY_USAGE_COLUMN_VERSION_KEY, HOURLY_USAGE_COLUMN_CURRENT_VERSION)
        }
      } else {
        DEFAULT_HIDDEN_COLUMNS.forEach(key => hiddenColumns.add(key))
        localStorage.setItem(HIDDEN_COLUMNS_VERSION_KEY, HIDDEN_COLUMNS_CURRENT_VERSION)
        localStorage.setItem(HOURLY_USAGE_COLUMN_VERSION_KEY, HOURLY_USAGE_COLUMN_CURRENT_VERSION)
      }
    } catch (error) {
      console.error('Failed to load saved columns:', error)
      DEFAULT_HIDDEN_COLUMNS.forEach(key => hiddenColumns.add(key))
    }
  }

  const saveColumnsToStorage = () => {
    try {
      localStorage.setItem(HIDDEN_COLUMNS_KEY, JSON.stringify([...hiddenColumns]))
      localStorage.setItem(HIDDEN_COLUMNS_VERSION_KEY, HIDDEN_COLUMNS_CURRENT_VERSION)
      localStorage.setItem(HOURLY_USAGE_COLUMN_VERSION_KEY, HOURLY_USAGE_COLUMN_CURRENT_VERSION)
    } catch (error) {
      console.error('Failed to save columns:', error)
    }
  }

  const isColumnVisible = (key: string) => !hiddenColumns.has(key)
  const shouldIncludeSchedulerScore = () => isColumnVisible('scheduler_score')
  const shouldIncludeHourlyUsage = () => isColumnVisible('hourly_usage')

  const syncAccountListDerivedParams = () => {
    const requestParams = options.getParams()
    requestParams.include_scheduler_score = shouldIncludeSchedulerScore() ? '1' : '0'
    requestParams.include_hourly_usage = shouldIncludeHourlyUsage() ? '1' : '0'
  }

  const toggleColumn = (key: string) => {
    const wasHidden = hiddenColumns.has(key)
    if (wasHidden) hiddenColumns.delete(key)
    else hiddenColumns.add(key)
    saveColumnsToStorage()
    if ((key === 'today_stats' || key === 'usage') && wasHidden) {
      options.refreshTodayStats().catch(error => {
        console.error('Failed to load account today stats after showing column:', error)
      })
    }
    if (key === 'scheduler_score' || key === 'hourly_usage') {
      syncAccountListDerivedParams()
      options.reloadAccounts().catch(error => {
        console.error('Failed to reload accounts after toggling a server-backed column:', error)
      })
    }
  }

  return {
    hiddenColumns,
    loadSavedColumns,
    toggleColumn,
    isColumnVisible,
    shouldIncludeSchedulerScore,
    shouldIncludeHourlyUsage,
    syncAccountListDerivedParams
  }
}
