import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ProfilePasskeyCard from '@/features/passkeys/presentation/widgets/ProfilePasskeyCard.vue'

const { list, isSupported, showError } = vi.hoisted(() => ({
  list: vi.fn(),
  isSupported: vi.fn(() => true),
  showError: vi.fn(),
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('@/core/stores/appStore', () => ({
  useAppStore: () => ({
    showError,
    showSuccess: vi.fn(),
  }),
}))

vi.mock('@/features/passkeys/data/repositories/passkeysQueryRepositoryImpl', () => ({
  passkeysQueryRepository: {
    isSupported,
    list,
  },
}))

vi.mock('@/features/passkeys/data/repositories/passkeysActionRepositoryImpl', () => ({
  passkeysActionRepository: {
    register: vi.fn(),
    rename: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('ProfilePasskeyCard', () => {
  it('禁用 passkey 时不加载凭据也不弹错误', async () => {
    mount(ProfilePasskeyCard, {
      props: { enabled: false },
      global: { stubs: { Icon: true } },
    })

    await flushPromises()

    expect(list).not.toHaveBeenCalled()
    expect(showError).not.toHaveBeenCalled()
  })

  it('后端竞态返回 PASSKEY_DISABLED 时静默处理', async () => {
    list.mockRejectedValueOnce({ reason: 'PASSKEY_DISABLED' })

    mount(ProfilePasskeyCard, {
      props: { enabled: true },
      global: { stubs: { Icon: true } },
    })

    await flushPromises()

    expect(list).toHaveBeenCalledTimes(1)
    expect(showError).not.toHaveBeenCalled()
  })
})
