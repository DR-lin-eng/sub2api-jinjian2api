import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const currentDir = dirname(fileURLToPath(import.meta.url))
const readFeatureSource = (relativePath: string) =>
  readFileSync(resolve(currentDir, relativePath), 'utf8')

const runtimeSources = {
  page: readFeatureSource('../presentation/pages/KeysPage.vue'),
  table: readFeatureSource('../presentation/widgets/KeysTable.vue'),
  editor: readFeatureSource('../presentation/widgets/KeyEditorDialog.vue'),
  useKeyDialog: readFeatureSource('../presentation/widgets/UseKeyDialog.vue'),
  openCodeResolver: readFeatureSource('../presentation/resolvers/openCodeConfigResolver.ts'),
  openCodeCatalogs: readFeatureSource('../presentation/resolvers/openCodeModelCatalogs.ts'),
  context: readFeatureSource('../presentation/keysPageContext.ts')
}

describe('keys page modularization', () => {
  it('keeps each modularized runtime file within the maintenance target', () => {
    for (const source of Object.values(runtimeSources)) {
      expect(source.split('\n').length).toBeLessThanOrEqual(1500)
    }
  })

  it('uses static typed widgets without introducing a store or dynamic boundary', () => {
    expect(runtimeSources.page).toContain("import KeysTable from '@/features/keys/presentation/widgets/KeysTable.vue'")
    expect(runtimeSources.page).toContain("import KeyEditorDialog from '@/features/keys/presentation/widgets/KeyEditorDialog.vue'")
    expect(runtimeSources.page).toContain('<KeysTable :context="keysTableContext" />')
    expect(runtimeSources.page).toContain('<KeyEditorDialog :context="keyEditorDialogContext" />')
    expect(runtimeSources.table).toContain('context: KeysTableContext')
    expect(runtimeSources.editor).toContain('context: KeyEditorDialogContext')
    expect(runtimeSources.useKeyDialog).toContain(
      "from '@/features/keys/presentation/resolvers/openCodeConfigResolver'"
    )
    expect(runtimeSources.openCodeResolver).toContain(
      "from '@/features/keys/presentation/resolvers/openCodeModelCatalogs'"
    )
    expect(runtimeSources.useKeyDialog).not.toContain('function generateOpenCodeConfig')

    for (const source of Object.values(runtimeSources)) {
      expect(source).not.toContain('import(')
    }
    expect(runtimeSources.table).not.toContain('useStore')
    expect(runtimeSources.editor).not.toContain('useStore')
  })

  it('keeps polling, visibility, request cancellation, and storage in the page owner', () => {
    expect(runtimeSources.page).toContain('const ACTIVE_PENDING_REFRESH_MS = 5000')
    expect(runtimeSources.page).toContain('const IDLE_PENDING_REFRESH_MS = 60000')
    expect(runtimeSources.page).toContain('const FULL_USAGE_REFRESH_MS = 60000')
    expect(runtimeSources.page).toContain("document.addEventListener('visibilitychange', handleUsageVisibilityChange)")
    expect(runtimeSources.page).toContain("document.removeEventListener('visibilitychange', handleUsageVisibilityChange)")
    expect(runtimeSources.page).toContain('usageRefreshAbortController?.abort()')
    expect(runtimeSources.page).toContain('abortController?.abort()')
    expect(runtimeSources.page).toContain("const HIDDEN_COLUMNS_KEY = 'api-key-hidden-columns'")
    expect(runtimeSources.table).not.toContain('setTimeout')
    expect(runtimeSources.editor).not.toContain('setTimeout')
  })

  it('preserves editor and table interaction entry points', () => {
    expect(runtimeSources.editor).toContain('id="key-form"')
    expect(runtimeSources.editor).toContain('@submit.prevent="handleSubmit"')
    expect(runtimeSources.editor).toContain('data-tour="key-form-submit"')
    expect(runtimeSources.table).toContain('@sort="handleSort"')
    expect(runtimeSources.table).toContain('@click="importToCcswitch(row)"')
    expect(runtimeSources.table).toContain('@click.stop="confirmResetRateLimitFromTable(row)"')
  })
})
