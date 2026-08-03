import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useAppStore } from '@/core/stores/appStore'
import {
  getAdminChatUnreadCount,
  getUserChatUnreadCount,
} from '@/features/support-chat/data/datasources/supportChatDatasource'

export const SUPPORT_UNREAD_POLL_MS = 60_000

interface SupportUnreadPollingOptions {
  isAuthenticated: () => boolean
  isAdmin: () => boolean
}

export function useSupportUnreadPolling(options: SupportUnreadPollingOptions): void {
  const appStore = useAppStore()
  let timer: ReturnType<typeof setInterval> | null = null
  let request: Promise<void> | null = null

  function enabled(): boolean {
    return options.isAuthenticated()
      && appStore.publicSettingsLoaded
      && appStore.cachedPublicSettings?.support_chat_enabled === true
  }

  async function refresh(): Promise<void> {
    if (request) return request
    if (!enabled()) {
      appStore.resetSupportUnread()
      return
    }

    const adminRequest = options.isAdmin()
    request = (async () => {
      if (adminRequest) {
        const count = await getAdminChatUnreadCount()
        if (!enabled() || !options.isAdmin()) return
        appStore.setSupportInboxUnread(count > 0)
        appStore.setSupportUserUnread(false)
        return
      }

      if (appStore.backendModeEnabled) {
        appStore.setSupportUserUnread(false)
        appStore.setSupportInboxUnread(false)
        return
      }
      const count = await getUserChatUnreadCount()
      if (!enabled() || options.isAdmin() || appStore.backendModeEnabled) return
      appStore.setSupportUserUnread(count > 0)
      appStore.setSupportInboxUnread(false)
    })()
      .catch((error) => {
        console.error('Failed to refresh support chat unread indicator:', error)
      })
      .finally(() => {
        request = null
      })

    return request
  }

  function stop(): void {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function restart(): void {
    stop()
    if (!enabled()) {
      appStore.resetSupportUnread()
      return
    }
    void refresh()
    timer = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      void refresh()
    }, SUPPORT_UNREAD_POLL_MS)
  }

  function onVisibilityChange(): void {
    if (document.visibilityState === 'visible') void refresh()
  }

  const stopWatch = watch(
    [
      options.isAuthenticated,
      options.isAdmin,
      () => appStore.publicSettingsLoaded,
      () => appStore.cachedPublicSettings?.support_chat_enabled,
      () => appStore.backendModeEnabled,
    ],
    restart,
    { immediate: true },
  )

  onMounted(() => {
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('focus', refresh)
  })

  onBeforeUnmount(() => {
    stopWatch()
    stop()
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('focus', refresh)
    appStore.resetSupportUnread()
  })
}
