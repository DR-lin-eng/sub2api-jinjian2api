import { beforeEach, describe, expect, it, vi } from 'vitest'

const { post } = vi.hoisted(() => ({
  post: vi.fn(),
}))

vi.mock('@/core/networks/client', () => ({
  apiClient: {
    post,
  },
}))

import { adminUsersActionDatasource } from '@/features/admin-users/data/datasources/adminUsersActionDatasource'
import type { BindAdminAuthIdentityRequest } from '@/features/admin-users/data/requests_models/bindAdminAuthIdentityRequest'
import type { BatchUpdateUserLimitsRequest } from '@/features/admin-users/data/requests_models/batchUpdateUserLimitsRequest'
import type { AdminBoundAuthIdentity } from '@/features/admin-users/domain/models/adminBoundAuthIdentity'

describe('admin users api auth identity binding', () => {
  beforeEach(() => {
    post.mockReset()
  })

  it('posts the backend-compatible auth identity bind payload and returns the backend response shape', async () => {
    const payload: BindAdminAuthIdentityRequest = {
      provider_type: 'wechat',
      provider_key: 'wechat-main',
      provider_subject: 'union-123',
      metadata: { source: 'admin-repair' },
      channel: {
        channel: 'open',
        channel_app_id: 'wx-open',
        channel_subject: 'openid-123',
        metadata: { scene: 'migration' },
      },
    }

    const rawResponse = {
      user_id: 9,
      provider_type: 'wechat',
      provider_key: 'wechat-main',
      provider_subject: 'union-123',
      verified_at: '2026-04-22T00:00:00Z',
      issuer: null,
      metadata: { source: 'admin-repair' },
      created_at: '2026-04-22T00:00:00Z',
      updated_at: '2026-04-22T00:00:00Z',
      channel: {
        channel: 'open',
        channel_app_id: 'wx-open',
        channel_subject: 'openid-123',
        metadata: { scene: 'migration' },
        created_at: '2026-04-22T00:00:00Z',
        updated_at: '2026-04-22T00:00:00Z',
      },
    }
    post.mockResolvedValue({ data: rawResponse })

    const result = await adminUsersActionDatasource.bindUserAuthIdentity(9, payload)
    const entity: AdminBoundAuthIdentity = result.toEntity()

    expect(post).toHaveBeenCalledWith('/admin/users/9/auth-identities', payload)
    expect(entity.userId).toBe(9)
    expect(entity.providerType).toBe('wechat')
    expect(entity.channel?.channelAppId).toBe('wx-open')
  })

  it('posts batch limit updates once with only the supplied limit fields', async () => {
    const request: BatchUpdateUserLimitsRequest = {
      user_ids: [4, 7],
      all: false,
      rpm_limit: 0,
    }
    post.mockResolvedValue({ data: { affected: 2 } })

    const result = await adminUsersActionDatasource.batchUpdateLimits(request)

    expect(post).toHaveBeenCalledWith('/admin/users/batch-limits', request)
    expect(result).toEqual({ affected: 2 })
  })
})
