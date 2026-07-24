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

import { systemQueryDatasource } from '@/features/admin-settings/data/datasources/systemQueryDatasource'
import { systemActionDatasource } from '@/features/admin-settings/data/datasources/systemActionDatasource'
import type { RollbackVersionInfo } from '@/features/admin-settings/domain/models/rollbackVersionInfo'

describe('admin system rollback API', () => {
  beforeEach(() => {
    get.mockReset()
    post.mockReset()
  })

  it('getRollbackVersions fetches the rollback version list', async () => {
    get.mockResolvedValue({
      data: {
        versions: [
          {
            version: '0.1.146',
            published_at: '2026-07-07T00:00:00Z',
            html_url: 'https://github.com/Wei-Shaw/sub2api/releases/tag/v0.1.146',
          },
        ],
      },
    })

    const result = await systemQueryDatasource.getRollbackVersions()

    expect(get).toHaveBeenCalledWith('/admin/system/rollback-versions')
    expect(result).toHaveLength(1)
    expect(result[0].version).toBe('0.1.146')
  })

  it('getRollbackVersions toEntity maps to camelCase domain model', async () => {
    get.mockResolvedValue({
      data: {
        versions: [
          {
            version: '0.1.146',
            published_at: '2026-07-07T00:00:00Z',
            html_url: 'https://github.com/Wei-Shaw/sub2api/releases/tag/v0.1.146',
          },
        ],
      },
    })

    const dtos = await systemQueryDatasource.getRollbackVersions()
    const entities: RollbackVersionInfo[] = dtos.map(dto => dto.toEntity())

    expect(entities[0].publishedAt).toBe('2026-07-07T00:00:00Z')
    expect(entities[0].htmlUrl).toContain('v0.1.146')
  })

  it('rollback posts the target version in the request body', async () => {
    post.mockResolvedValue({ data: { message: 'ok', need_restart: true } })

    const dto = await systemActionDatasource.rollback('0.1.146')
    const result = dto.toEntity()

    expect(post).toHaveBeenCalledWith(
      '/admin/system/rollback',
      { version: '0.1.146' },
      { timeout: 15 * 60 * 1000 }
    )
    expect(result.needRestart).toBe(true)
  })

  it('rollback without a version posts no body (legacy backup rollback)', async () => {
    post.mockResolvedValue({ data: { message: 'ok', need_restart: false } })

    await systemActionDatasource.rollback()

    expect(post).toHaveBeenCalledWith('/admin/system/rollback', undefined, {
      timeout: 15 * 60 * 1000,
    })
  })
})
