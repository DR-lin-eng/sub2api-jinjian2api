import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSubscriptionStore } from '@/features/subscriptions/presentation/stores/subscriptionsStore'

const mockListActive = vi.fn()

vi.mock('@/features/subscriptions/data/repositories/subscriptionsQueryRepositoryImpl', () => ({
  subscriptionsQueryRepository: {
    listActive: (...args: unknown[]) => mockListActive(...args),
  },
}))

const fakeSubscriptions = [
  {
    id: 1,
    userId: 1,
    groupId: 1,
    status: 'active' as const,
    dailyUsageUsd: 5,
    weeklyUsageUsd: 20,
    monthlyUsageUsd: 50,
    dailyWindowStart: '',
    weeklyWindowStart: '',
    monthlyWindowStart: '',
    startsAt: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    revokedAt: '',
    expiresAt: '2025-01-01',
  },
  {
    id: 2,
    userId: 1,
    groupId: 2,
    status: 'active' as const,
    dailyUsageUsd: 10,
    weeklyUsageUsd: 40,
    monthlyUsageUsd: 100,
    dailyWindowStart: '',
    weeklyWindowStart: '',
    monthlyWindowStart: '',
    startsAt: '2024-02-01',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
    revokedAt: '',
    expiresAt: '2025-02-01',
  },
]

describe('useSubscriptionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('fetchActiveSubscriptions', () => {
    it('成功获取活跃订阅', async () => {
      mockListActive.mockResolvedValue(fakeSubscriptions)
      const store = useSubscriptionStore()

      const result = await store.fetchActiveSubscriptions()

      expect(result).toEqual(fakeSubscriptions)
      expect(store.activeSubscriptions).toEqual(fakeSubscriptions)
      expect(store.loading).toBe(false)
    })

    it('缓存有效时返回缓存数据', async () => {
      mockListActive.mockResolvedValue(fakeSubscriptions)
      const store = useSubscriptionStore()

      await store.fetchActiveSubscriptions()
      expect(mockListActive).toHaveBeenCalledTimes(1)

      const result = await store.fetchActiveSubscriptions()
      expect(mockListActive).toHaveBeenCalledTimes(1)
      expect(result).toEqual(fakeSubscriptions)
    })

    it('缓存过期后重新请求', async () => {
      mockListActive.mockResolvedValue(fakeSubscriptions)
      const store = useSubscriptionStore()

      await store.fetchActiveSubscriptions()
      expect(mockListActive).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(61_000)

      const updatedSubs = [fakeSubscriptions[0]]
      mockListActive.mockResolvedValue(updatedSubs)

      const result = await store.fetchActiveSubscriptions()
      expect(mockListActive).toHaveBeenCalledTimes(2)
      expect(result).toEqual(updatedSubs)
    })

    it('force=true 强制重新请求', async () => {
      mockListActive.mockResolvedValue(fakeSubscriptions)
      const store = useSubscriptionStore()

      await store.fetchActiveSubscriptions()

      const updatedSubs = [fakeSubscriptions[0]]
      mockListActive.mockResolvedValue(updatedSubs)

      const result = await store.fetchActiveSubscriptions(true)
      expect(mockListActive).toHaveBeenCalledTimes(2)
      expect(result).toEqual(updatedSubs)
    })

    it('并发请求共享同一个 Promise（去重）', async () => {
      let resolvePromise: (v: unknown) => void
      mockListActive.mockImplementation(
        () => new Promise((resolve) => { resolvePromise = resolve })
      )
      const store = useSubscriptionStore()

      const p1 = store.fetchActiveSubscriptions()
      const p2 = store.fetchActiveSubscriptions()

      expect(mockListActive).toHaveBeenCalledTimes(1)

      resolvePromise!(fakeSubscriptions)

      const [r1, r2] = await Promise.all([p1, p2])
      expect(r1).toEqual(fakeSubscriptions)
      expect(r2).toEqual(fakeSubscriptions)
    })

    it('API 错误时抛出异常', async () => {
      mockListActive.mockRejectedValue(new Error('Network error'))
      const store = useSubscriptionStore()

      await expect(store.fetchActiveSubscriptions()).rejects.toThrow('Network error')
    })
  })

  describe('hasActiveSubscriptions', () => {
    it('有订阅时返回 true', async () => {
      mockListActive.mockResolvedValue(fakeSubscriptions)
      const store = useSubscriptionStore()

      await store.fetchActiveSubscriptions()

      expect(store.hasActiveSubscriptions).toBe(true)
    })

    it('无订阅时返回 false', () => {
      const store = useSubscriptionStore()
      expect(store.hasActiveSubscriptions).toBe(false)
    })

    it('清除后返回 false', async () => {
      mockListActive.mockResolvedValue(fakeSubscriptions)
      const store = useSubscriptionStore()

      await store.fetchActiveSubscriptions()
      expect(store.hasActiveSubscriptions).toBe(true)

      store.clear()
      expect(store.hasActiveSubscriptions).toBe(false)
    })
  })

  describe('invalidateCache', () => {
    it('失效缓存后下次请求重新获取数据', async () => {
      mockListActive.mockResolvedValue(fakeSubscriptions)
      const store = useSubscriptionStore()

      await store.fetchActiveSubscriptions()
      expect(mockListActive).toHaveBeenCalledTimes(1)

      store.invalidateCache()

      await store.fetchActiveSubscriptions()
      expect(mockListActive).toHaveBeenCalledTimes(2)
    })
  })

  describe('clear', () => {
    it('清除所有订阅数据', async () => {
      mockListActive.mockResolvedValue(fakeSubscriptions)
      const store = useSubscriptionStore()

      await store.fetchActiveSubscriptions()
      expect(store.activeSubscriptions).toHaveLength(2)

      store.clear()

      expect(store.activeSubscriptions).toHaveLength(0)
      expect(store.hasActiveSubscriptions).toBe(false)
    })
  })

  describe('startPolling / stopPolling', () => {
    it('startPolling 不会创建重复 interval', () => {
      const store = useSubscriptionStore()
      mockListActive.mockResolvedValue([])

      store.startPolling()
      store.startPolling()

      vi.advanceTimersByTime(5 * 60 * 1000)
      expect(mockListActive).toHaveBeenCalledTimes(1)

      store.stopPolling()
    })

    it('stopPolling 停止定期刷新', () => {
      const store = useSubscriptionStore()
      mockListActive.mockResolvedValue([])

      store.startPolling()
      store.stopPolling()

      vi.advanceTimersByTime(10 * 60 * 1000)
      expect(mockListActive).not.toHaveBeenCalled()
    })
  })
})
