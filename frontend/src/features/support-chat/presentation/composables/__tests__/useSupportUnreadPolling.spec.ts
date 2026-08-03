import { defineComponent, nextTick } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAppStore } from '@/core/stores/appStore'
import {
  SUPPORT_UNREAD_POLL_MS,
  useSupportUnreadPolling,
} from '@/features/support-chat/presentation/composables/useSupportUnreadPolling'
import {
  getAdminChatUnreadCount,
  getUserChatUnreadCount,
} from '@/features/support-chat/data/datasources/supportChatDatasource'

vi.mock('@/features/support-chat/data/datasources/supportChatDatasource', () => ({
  getAdminChatUnreadCount: vi.fn(),
  getUserChatUnreadCount: vi.fn(),
}))

const Harness = defineComponent({
  setup() {
    useSupportUnreadPolling({
      isAuthenticated: () => authState.isAuthenticated,
      isAdmin: () => authState.isAdmin,
    })
    return () => null
  },
})

const authState = {
  isAuthenticated: false,
  isAdmin: false,
}

describe('useSupportUnreadPolling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
    vi.mocked(getAdminChatUnreadCount).mockReset().mockResolvedValue(0)
    vi.mocked(getUserChatUnreadCount).mockReset().mockResolvedValue(1)
    authState.isAuthenticated = false
    authState.isAdmin = false
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('polls every minute, skips hidden intervals, and stops when disabled', async () => {
    const appStore = useAppStore()
    appStore.publicSettingsLoaded = true
    appStore.cachedPublicSettings = {
      support_chat_enabled: true,
      backend_mode_enabled: false,
    } as typeof appStore.cachedPublicSettings
    authState.isAuthenticated = true

    const wrapper = mount(Harness)
    await flushPromises()
    expect(getUserChatUnreadCount).toHaveBeenCalledTimes(1)
    expect(appStore.supportUserHasUnread).toBe(true)

    await vi.advanceTimersByTimeAsync(SUPPORT_UNREAD_POLL_MS)
    expect(getUserChatUnreadCount).toHaveBeenCalledTimes(2)

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'hidden',
    })
    await vi.advanceTimersByTimeAsync(SUPPORT_UNREAD_POLL_MS)
    expect(getUserChatUnreadCount).toHaveBeenCalledTimes(2)

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    })
    document.dispatchEvent(new Event('visibilitychange'))
    await flushPromises()
    expect(getUserChatUnreadCount).toHaveBeenCalledTimes(3)

    appStore.cachedPublicSettings.support_chat_enabled = false
    await nextTick()
    expect(appStore.supportUserHasUnread).toBe(false)
    await vi.advanceTimersByTimeAsync(SUPPORT_UNREAD_POLL_MS)
    expect(getUserChatUnreadCount).toHaveBeenCalledTimes(3)

    wrapper.unmount()
  })
})
