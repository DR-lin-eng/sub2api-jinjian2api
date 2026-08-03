import { beforeEach, describe, expect, it, vi } from 'vitest'

const { get, post, put, deleteRequest } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  deleteRequest: vi.fn()
}))

vi.mock('@/core/networks/client', () => ({
  apiClient: { get, post, put, delete: deleteRequest }
}))

import {
  create,
  deletePlan,
  listByAccount,
  listResults,
  scheduledTestsAPI,
  update
} from '@/features/admin-accounts/data/datasources/scheduledTestsDatasource'

describe('scheduled tests datasource', () => {
  beforeEach(() => {
    get.mockReset()
    post.mockReset()
    put.mockReset()
    deleteRequest.mockReset()
  })

  it('preserves account-plan and result list endpoints with empty fallbacks', async () => {
    get.mockResolvedValueOnce({ data: null }).mockResolvedValueOnce({ data: null })

    await expect(listByAccount(7)).resolves.toEqual([])
    await expect(listResults(13, 20)).resolves.toEqual([])

    expect(get).toHaveBeenNthCalledWith(1, '/admin/accounts/7/scheduled-test-plans')
    expect(get).toHaveBeenNthCalledWith(2, '/admin/scheduled-test-plans/13/results', {
      params: { limit: 20 }
    })
  })

  it('preserves create, update, and delete request payloads', async () => {
    const created = { id: 13, account_id: 7, enabled: true }
    const updated = { ...created, enabled: false }
    post.mockResolvedValueOnce({ data: created })
    put.mockResolvedValueOnce({ data: updated })
    deleteRequest.mockResolvedValueOnce({})

    await expect(create({
      account_id: 7,
      model_id: 'gpt-5.4',
      cron_expression: '0 * * * *',
      max_results: 100,
      enabled: true,
      auto_recover: false
    })).resolves.toEqual(created)
    await expect(update(13, { enabled: false })).resolves.toEqual(updated)
    await expect(deletePlan(13)).resolves.toBeUndefined()

    expect(post).toHaveBeenCalledWith('/admin/scheduled-test-plans', {
      account_id: 7,
      model_id: 'gpt-5.4',
      cron_expression: '0 * * * *',
      max_results: 100,
      enabled: true,
      auto_recover: false
    })
    expect(put).toHaveBeenCalledWith('/admin/scheduled-test-plans/13', { enabled: false })
    expect(deleteRequest).toHaveBeenCalledWith('/admin/scheduled-test-plans/13')
  })

  it('keeps the compatibility object wired to the owner functions', () => {
    expect(scheduledTestsAPI.listByAccount).toBe(listByAccount)
    expect(scheduledTestsAPI.create).toBe(create)
    expect(scheduledTestsAPI.update).toBe(update)
    expect(scheduledTestsAPI.delete).toBe(deletePlan)
    expect(scheduledTestsAPI.listResults).toBe(listResults)
  })
})
