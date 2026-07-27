import type { Ref } from 'vue'

export interface UsageUserFilterLabelTarget {
  getUserSearchRevision?: () => number
  setUserKeyword?: (label: string) => void
}

interface UseRouteUserFilterLabelOptions {
  getUserId: () => number | undefined
  filterRef: Ref<UsageUserFilterLabelTarget | null>
  loadUser: (userId: number) => Promise<{ email?: string | null }>
}

export function useRouteUserFilterLabel(options: UseRouteUserFilterLabelOptions) {
  async function loadRouteUserFilterLabel(): Promise<void> {
    const requestedUserId = options.getUserId()
    if (!requestedUserId) return

    const userSearchRevision = options.filterRef.value?.getUserSearchRevision?.()
    const requestIsCurrent = () =>
      options.getUserId() === requestedUserId &&
      options.filterRef.value?.getUserSearchRevision?.() === userSearchRevision

    try {
      const user = await options.loadUser(requestedUserId)
      if (!requestIsCurrent()) return
      options.filterRef.value?.setUserKeyword?.(user.email || String(requestedUserId))
    } catch {
      if (!requestIsCurrent()) return
      options.filterRef.value?.setUserKeyword?.(String(requestedUserId))
    }
  }

  return { loadRouteUserFilterLabel }
}
