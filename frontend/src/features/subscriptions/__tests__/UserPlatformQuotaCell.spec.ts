import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// t() 回显 key，便于断言文案键
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

import UserPlatformQuotaCell from '@/features/subscriptions/presentation/widgets/UserPlatformQuotaCell.vue'
import type { PlatformQuotaItem, PlatformQuotaPlatform } from '@/features/admin-users/domain/models/platformQuotaItem'
import { PlatformQuotaItem as PlatformQuotaItemClass } from '@/features/admin-users/domain/models/platformQuotaItem'

function item(over: Partial<PlatformQuotaItem> & { platform: PlatformQuotaPlatform }): PlatformQuotaItem {
  const entity = new PlatformQuotaItemClass()
  entity.platform = over.platform
  entity.dailyLimitUsd = over.dailyLimitUsd ?? null
  entity.weeklyLimitUsd = over.weeklyLimitUsd ?? null
  entity.monthlyLimitUsd = over.monthlyLimitUsd ?? null
  entity.dailyUsageUsd = over.dailyUsageUsd ?? 0
  entity.weeklyUsageUsd = over.weeklyUsageUsd ?? 0
  entity.monthlyUsageUsd = over.monthlyUsageUsd ?? 0
  entity.dailyWindowStart = over.dailyWindowStart ?? ''
  entity.weeklyWindowStart = over.weeklyWindowStart ?? ''
  entity.monthlyWindowStart = over.monthlyWindowStart ?? ''
  entity.dailyWindowResetsAt = over.dailyWindowResetsAt ?? ''
  entity.weeklyWindowResetsAt = over.weeklyWindowResetsAt ?? ''
  entity.monthlyWindowResetsAt = over.monthlyWindowResetsAt ?? ''
  return entity
}

describe('UserPlatformQuotaCell', () => {
  it('quotas 为 undefined 时渲染加载占位 …', () => {
    const w = mount(UserPlatformQuotaCell, { props: { quotas: undefined } })
    expect(w.text()).toContain('…')
    expect(w.html()).not.toContain('admin.users.platformQuota.cellNotConfigured')
  })

  it('空数组渲染「未配置」', () => {
    const w = mount(UserPlatformQuotaCell, { props: { quotas: [] } })
    expect(w.html()).toContain('admin.users.platformQuota.cellNotConfigured')
  })

  it('平台有记录但全部 limit 为 null 时视为未配置', () => {
    const w = mount(UserPlatformQuotaCell, {
      props: { quotas: [item({ platform: 'openai', dailyUsageUsd: 5 })] },
    })
    expect(w.html()).toContain('admin.users.platformQuota.cellNotConfigured')
  })

  it('已配置平台渲染 已用/限额，null 档显示 —，金额去尾零', () => {
    const w = mount(UserPlatformQuotaCell, {
      props: {
        quotas: [
          item({ platform: 'anthropic', dailyLimitUsd: 100, dailyUsageUsd: 30,
                 weeklyLimitUsd: null, weeklyUsageUsd: 0,
                 monthlyLimitUsd: 2000, monthlyUsageUsd: 90.5 }),
        ],
      },
    })
    const html = w.html()
    expect(html).toContain('anthropic')
    expect(html).toContain('30/100')
    expect(html).toContain('0/—')
    expect(html).toContain('90.5/2000')
  })

  it('多平台按 anthropic→openai→gemini→antigravity 顺序，仅展示有限额的', () => {
    const w = mount(UserPlatformQuotaCell, {
      props: {
        quotas: [
          item({ platform: 'gemini', monthlyLimitUsd: 50 }),
          item({ platform: 'anthropic', dailyLimitUsd: 10 }),
          item({ platform: 'openai', dailyUsageUsd: 9 }),
        ],
      },
    })
    const text = w.text()
    expect(text.indexOf('anthropic')).toBeLessThan(text.indexOf('gemini'))
    expect(text).not.toContain('openai')
  })
})
