import { beforeEach, describe, expect, it, vi } from 'vitest'

const { get, post, deleteRequest } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  deleteRequest: vi.fn()
}))

vi.mock('@/core/networks/client', () => ({
  apiClient: { get, post, delete: deleteRequest }
}))

import accountsAPI from '@/features/admin-accounts/data/datasources/adminAccountsDatasource'
import {
  batchRefresh,
  bulkUpdate,
  checkMixedChannelRisk,
  deleteAccount,
  exportData
} from '@/features/admin-accounts/data/datasources/adminAccountActions'

describe('admin account actions', () => {
  beforeEach(() => {
    get.mockReset()
    post.mockReset()
    deleteRequest.mockReset()
  })

  it('keeps bulk-update and delete payloads compatible', async () => {
    const result = { success: 2, failed: 0, success_ids: [7, 11], results: [] }
    post.mockResolvedValueOnce({ data: result })
    deleteRequest.mockResolvedValueOnce({ data: { message: 'deleted' } })

    await expect(bulkUpdate([7, 11], { schedulable: false })).resolves.toEqual(result)
    await expect(deleteAccount(7)).resolves.toEqual({ message: 'deleted' })

    expect(post).toHaveBeenCalledWith('/admin/accounts/bulk-update', {
      account_ids: [7, 11],
      schedulable: false
    })
    expect(deleteRequest).toHaveBeenCalledWith('/admin/accounts/7')
  })

  it('preserves batch-refresh timeout and export filter encoding', async () => {
    const batchResult = { total: 2, success: 2, failed: 0 }
    const exportResult = { accounts: [] }
    post.mockResolvedValueOnce({ data: batchResult })
    get.mockResolvedValueOnce({ data: exportResult })

    await expect(batchRefresh([7, 11])).resolves.toEqual(batchResult)
    await expect(exportData({
      filters: { platform: 'openai', status: 'active', sort_by: 'name', sort_order: 'asc' },
      includeProxies: false
    })).resolves.toEqual(exportResult)

    expect(post).toHaveBeenCalledWith('/admin/accounts/batch-refresh', {
      account_ids: [7, 11]
    }, {
      timeout: 120000
    })
    expect(get).toHaveBeenCalledWith('/admin/accounts/data', {
      params: {
        platform: 'openai',
        status: 'active',
        sort_by: 'name',
        sort_order: 'asc',
        include_proxies: 'false'
      }
    })
  })

  it('keeps mixed-channel risk payload compatible', async () => {
    const result = { has_risk: true, message: 'mixed channel risk' }
    post.mockResolvedValueOnce({ data: result })

    await expect(checkMixedChannelRisk({
      platform: 'antigravity',
      group_ids: [3, 5]
    })).resolves.toEqual(result)

    expect(post).toHaveBeenCalledWith('/admin/accounts/check-mixed-channel', {
      platform: 'antigravity',
      group_ids: [3, 5]
    })
  })

  it('keeps the compatibility datasource wired to the same owner functions', () => {
    expect(accountsAPI.bulkUpdate).toBe(bulkUpdate)
    expect(accountsAPI.checkMixedChannelRisk).toBe(checkMixedChannelRisk)
    expect(accountsAPI.batchRefresh).toBe(batchRefresh)
    expect(accountsAPI.exportData).toBe(exportData)
    expect(accountsAPI.delete).toBe(deleteAccount)
  })
})
