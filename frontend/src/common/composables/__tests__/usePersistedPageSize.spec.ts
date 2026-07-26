import { afterEach, describe, expect, it } from 'vitest'

import { getPersistedPageSize } from '@/common/composables/usePersistedPageSize'

describe('usePersistedPageSize', () => {
  afterEach(() => {
    localStorage.clear()
    delete window.__APP_CONFIG__
  })

  it('uses the system table default instead of stale localStorage state', () => {
    window.__APP_CONFIG__ = {
      tableDefaultPageSize: 1000,
      tablePageSizeOptions: [20, 50, 1000]
    } as any
    localStorage.setItem('table-page-size', '50')
    localStorage.setItem('table-page-size-source', 'user')

    expect(getPersistedPageSize()).toBe(1000)
  })
})
