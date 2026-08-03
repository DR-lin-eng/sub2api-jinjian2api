import { readFileSync, readdirSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const currentDir = dirname(fileURLToPath(import.meta.url))
const featureDir = resolve(currentDir, '..')
const readFeatureSource = (relativePath: string) =>
  readFileSync(resolve(featureDir, relativePath), 'utf8')

const collectRuntimeSources = (directory: string): Array<{ path: string; source: string }> => {
  const sources: Array<{ path: string; source: string }> = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '__tests__') continue
    const absolutePath = join(directory, entry.name)
    if (entry.isDirectory()) {
      sources.push(...collectRuntimeSources(absolutePath))
      continue
    }
    if (extname(entry.name) !== '.ts' && extname(entry.name) !== '.vue') continue
    sources.push({
      path: relative(featureDir, absolutePath),
      source: readFileSync(absolutePath, 'utf8')
    })
  }
  return sources
}

const pageSource = readFeatureSource('presentation/pages/AccountsPage.vue')
const tableViewSource = readFeatureSource('presentation/widgets/AccountsTableView.vue')
const upstreamSource = readFeatureSource('presentation/composables/useAccountsUpstreamBilling.ts')
const bulkDialogSource = readFeatureSource('presentation/widgets/BulkEditAccountDialog.vue')
const usageCellSource = readFeatureSource('presentation/widgets/AccountUsageCell.vue')
const quotaNotifySource = readFeatureSource('presentation/composables/useQuotaNotifyState.ts')
const scheduledTestsSource = readFeatureSource('presentation/widgets/ScheduledTestsPanel.vue')
const maintenanceTargets = new Map([
  ['presentation/pages/AccountsPage.vue', 1550]
])

describe('admin accounts modularization', () => {
  it('keeps every feature runtime module within the maintenance target', () => {
    for (const runtime of collectRuntimeSources(featureDir)) {
      const target = maintenanceTargets.get(runtime.path) ?? 1500
      expect(runtime.source.split('\n').length, runtime.path).toBeLessThanOrEqual(target)
    }
  })

  it('keeps the table and field modules statically owned by the accounts route chunk', () => {
    expect(pageSource).toContain(
      "import AccountsTableView from '@/features/admin-accounts/presentation/widgets/AccountsTableView.vue'"
    )
    expect(pageSource).toContain('<AccountsTableView :context="accountTableViewContext" />')
    expect(bulkDialogSource).toContain("import BulkEditRoutingPolicyFields from './BulkEditRoutingPolicyFields.vue'")
    expect(usageCellSource).toContain("import AccountKeyUsageDetails from './AccountKeyUsageDetails.vue'")
    expect(tableViewSource).not.toContain('import(')
    expect(upstreamSource).not.toContain('import(')
  })

  it('keeps request lifecycle out of the table-only view', () => {
    expect(tableViewSource).not.toContain('adminAPI')
    expect(tableViewSource).not.toContain('watch(')
    expect(tableViewSource).not.toContain('setTimeout')
    expect(tableViewSource).not.toContain('useIntervalFn')
    expect(tableViewSource).not.toContain('useAppStore')
    expect(tableViewSource).not.toContain('useAuthStore')
  })

  it('routes page requests through feature owners instead of the admin compatibility barrel', () => {
    expect(pageSource).not.toContain("from '@/api/admin'")
    expect(pageSource).toContain("from '@/features/admin-accounts/data/datasources/adminAccountQueries'")
    expect(pageSource).toContain("from '@/features/admin-accounts/data/datasources/adminAccountActions'")
    expect(pageSource).toContain("from '@/features/admin-proxies/data/datasources/adminProxiesDatasource'")
    expect(pageSource).toContain("from '@/features/admin-groups/data/datasources/adminGroupsDatasource'")
  })

  it('routes bulk edit actions through the account action owner', () => {
    expect(bulkDialogSource).not.toContain("from '@/api/admin'")
    expect(bulkDialogSource).toContain(
      "from '@/features/admin-accounts/data/datasources/adminAccountActions'"
    )
  })

  it('reads the global quota notification switch from its settings owner', () => {
    expect(quotaNotifySource).not.toContain("from '@/api/admin'")
    expect(quotaNotifySource).toContain(
      "from '@/features/admin-settings/data/datasources/adminSettingsDatasource'"
    )
  })

  it('routes scheduled test lifecycle calls through their datasource owner', () => {
    expect(scheduledTestsSource).not.toContain("from '@/api/admin'")
    expect(scheduledTestsSource).toContain(
      "from '@/features/admin-accounts/data/datasources/scheduledTestsDatasource'"
    )
  })

  it('preserves quota hydration, bounded batches, feedback timing, and refresh cadence', () => {
    expect(pageSource.indexOf('registerQuotaHydrationWatch(accounts)')).toBeLessThan(
      pageSource.indexOf('useTableSelection<Account>')
    )
    expect(pageSource).toContain('5 * 60_000')
    expect(upstreamSource).toContain('const UPSTREAM_BILLING_PROBE_BATCH_SIZE = 20')
    expect(upstreamSource).toContain('const UPSTREAM_QUOTA_QUERY_BATCH_SIZE = 4')
    expect(upstreamSource).toContain('}, 1000))')
    expect(upstreamSource).toContain('{ immediate: true }')
  })
})
