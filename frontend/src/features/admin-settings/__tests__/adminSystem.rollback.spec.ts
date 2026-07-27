import { beforeEach, describe, expect, it, vi } from 'vitest'

const { get, post } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}))

vi.mock('@/core/networks/client', () => ({
  apiClient: {
    get,
    post,
  },
}))

import {
  getRollbackVersions,
  performUpdate,
  restartService,
  rollback,
  type RollbackVersionInfo
} from '@/features/admin-settings/data/datasources/systemDatasource'

describe('admin system rollback API', () => {
  beforeEach(() => {
    get.mockReset()
    post.mockReset()
  })

  it('getRollbackVersions fetches the rollback version list', async () => {
    const versions: RollbackVersionInfo[] = [
      {
        version: '0.1.146',
        published_at: '2026-07-07T00:00:00Z',
        html_url: 'https://github.com/DR-lin-eng/sub2api-no2api/releases/tag/v0.1.146'
      }
    ]
    get.mockResolvedValue({ data: { versions } })

    const result = await getRollbackVersions()

    expect(get).toHaveBeenCalledWith('/admin/system/rollback-versions')
    expect(result.versions).toEqual(versions)
  })

  it('rollback posts the target version in the request body', async () => {
    post.mockResolvedValue({ data: { message: 'ok', need_restart: true } })

    const result = await rollback('0.1.146')

    expect(post).toHaveBeenCalledWith(
      '/admin/system/rollback',
      { version: '0.1.146', confirm: true },
      { timeout: 15 * 60 * 1000 }
    )
    expect(result.need_restart).toBe(true)
  })

  it('rollback without a version posts only the confirmation', async () => {
    post.mockResolvedValue({ data: { message: 'ok', need_restart: true } })

    await rollback()

    expect(post).toHaveBeenCalledWith('/admin/system/rollback', { confirm: true }, {
      timeout: 15 * 60 * 1000
    })
  })

  it('update and restart send the explicit backend confirmation', async () => {
    post.mockResolvedValue({ data: { message: 'ok', need_restart: true } })

    await performUpdate()
    await restartService()

    expect(post).toHaveBeenNthCalledWith(
      1,
      '/admin/system/update',
      { confirm: true },
      { timeout: 15 * 60 * 1000 }
    )
    expect(post).toHaveBeenNthCalledWith(2, '/admin/system/restart', { confirm: true })
  })
})
