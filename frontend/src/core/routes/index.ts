import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/features/auth/presentation/stores/authStore'
import { useAppStore } from '@/core/stores/appStore'
import { useAdminSettingsStore } from '@/features/admin-settings/presentation/stores/adminSettingsStore'
import { useAdminComplianceStore } from '@/features/admin-settings/presentation/stores/adminComplianceStore'
import { useNavigationLoadingState } from '@/core/routes/composables/useNavigationLoading'
import { useRoutePrefetch } from '@/core/routes/composables/useRoutePrefetch'
import { resolveRouteDocumentTitle } from './title'
import { commonRoutes } from './commonRoutes'
import { setupRoutes } from '@/features/setup'
import { authRoutes } from '@/features/auth'
import { keysRoutes } from '@/features/keys'
import { dashboardUserRoutes } from '@/features/dashboard-user'
import { batchImageRoutes } from '@/features/batch-image'
import { usageRoutes } from '@/features/usage'
import { billingRoutes } from '@/features/billing'
import { affiliateRoutes } from '@/features/affiliate'
import { channelsUserRoutes } from '@/features/channels-user'
import { profileRoutes } from '@/features/profile'
import { subscriptionsRoutes } from '@/features/subscriptions'
import { adminDashboardRoutes } from '@/features/admin-dashboard'
import { adminOpsRoutes } from '@/features/admin-ops'
import { adminAuditRoutes } from '@/features/admin-audit'
import { adminClusterRoutes } from '@/features/admin-cluster'
import { adminUsersRoutes } from '@/features/admin-users'
import { adminGroupsRoutes } from '@/features/admin-groups'
import { adminChannelsRoutes } from '@/features/admin-channels'
import { adminChannelMonitorRoutes } from '@/features/admin-channel-monitor'
import { adminSubscriptionsRoutes } from '@/features/admin-subscriptions'
import { adminAccountsRoutes } from '@/features/admin-accounts'
import { announcementsRoutes } from '@/features/announcements'
import { adminProxiesRoutes } from '@/features/admin-proxies'
import { adminRedeemRoutes } from '@/features/admin-redeem'
import { adminPromoRoutes } from '@/features/admin-promo'
import { adminSettingsRoutes } from '@/features/admin-settings'
import { adminRiskControlRoutes } from '@/features/admin-risk-control'
import { promptAuditRoutes } from '@/features/prompt-audit'
import { adminUsageRoutes } from '@/features/admin-usage'
import { adminOrdersRoutes } from '@/features/admin-orders'
import { adminBackupRoutes } from '@/features/admin-backup'

const routes: RouteRecordRaw[] = [
  // ==================== Common Routes ====================
  ...commonRoutes,

  // ==================== Feature Routes ====================
  ...setupRoutes,
  ...authRoutes,
  ...keysRoutes,
  ...dashboardUserRoutes,
  ...batchImageRoutes,
  ...usageRoutes,
  ...billingRoutes,
  ...affiliateRoutes,
  ...channelsUserRoutes,
  ...profileRoutes,
  ...subscriptionsRoutes,

  // ==================== Admin Routes ====================
  ...adminDashboardRoutes,
  ...adminOpsRoutes,
  ...adminAuditRoutes,
  ...adminClusterRoutes,
  ...adminUsersRoutes,
  ...adminGroupsRoutes,
  ...adminChannelsRoutes,
  ...adminChannelMonitorRoutes,
  ...adminSubscriptionsRoutes,
  ...adminAccountsRoutes,
  ...announcementsRoutes,
  ...adminProxiesRoutes,
  ...adminRedeemRoutes,
  ...adminPromoRoutes,
  ...adminSettingsRoutes,
  ...adminRiskControlRoutes,
  ...promptAuditRoutes,
  ...adminUsageRoutes,
  ...adminOrdersRoutes,
  ...adminBackupRoutes,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

let authInitialized = false

const navigationLoading = useNavigationLoadingState()
let routePrefetch: ReturnType<typeof useRoutePrefetch> | null = null

function isBackendModePublicRouteAllowed(to: { meta: Record<string, unknown> }, hasPendingAuthSession: boolean): boolean {
  if (to.meta.backendModePublic) return true
  if (to.meta.backendModeCallback) return true
  return !!(hasPendingAuthSession && to.meta.backendModePendingAuth);

}

router.beforeEach(async (to, _from, next) => {
  navigationLoading.startNavigation()

  const authStore = useAuthStore()

  if (!authInitialized) {
    await authStore.checkAuth()
    authInitialized = true
  }

  const appStore = useAppStore()
  const adminSettingsStore = useAdminSettingsStore()
  const customMenuItems = [
    ...(appStore.cachedPublicSettings?.customMenuItems ?? []),
    ...(authStore.isAdmin ? adminSettingsStore.customMenuItems : []),
  ]
  document.title = resolveRouteDocumentTitle(to, appStore.siteName, customMenuItems)

  const requiresAuth = to.meta.requiresAuth !== false
  const requiresAdmin = to.meta.requiresAdmin === true

  if (!requiresAuth) {
    if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
      if (appStore.backendModeEnabled && !authStore.isAdmin) {
        next()
        return
      }
      next(authStore.isAdmin ? '/admin/dashboard' : '/dashboard')
      return
    }
    if (appStore.backendModeEnabled && !authStore.isAuthenticated) {
      const isAllowed = isBackendModePublicRouteAllowed(to, authStore.hasPendingAuthSession)
      if (!isAllowed) {
        next('/login')
        return
      }
    }
    next()
    return
  }

  if (!authStore.isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  if (requiresAdmin && !authStore.isAdmin) {
    next('/dashboard')
    return
  }

  if (requiresAdmin && authStore.isAdmin) {
    const adminComplianceStore = useAdminComplianceStore()
    if (!adminComplianceStore.initialized) {
      try {
        await adminComplianceStore.fetchStatus()
      } catch (error) {
        const err = error as { status?: number; code?: string; metadata?: Record<string, string> }
        if (err.status === 423 && err.code === 'ADMIN_COMPLIANCE_ACK_REQUIRED') {
          adminComplianceStore.requireAcknowledgement(err.metadata)
        }
      }
    }
  }

  if ((to.meta.requiresPayment || to.meta.requiresRiskControl) && !appStore.publicSettingsLoaded) {
    try {
      await appStore.fetchPublicSettings()
    } catch (error) {
      console.warn('Failed to load public settings in route guard', error)
    }
  }

  if (
    to.meta.requiresPayment &&
    appStore.publicSettingsLoaded &&
    appStore.cachedPublicSettings?.paymentEnabled === false
  ) {
    next(authStore.isAdmin ? '/admin/dashboard' : '/dashboard')
    return
  }

  if (
    to.meta.requiresRiskControl &&
    appStore.publicSettingsLoaded &&
    appStore.cachedPublicSettings?.riskControlEnabled === false
  ) {
    next(authStore.isAdmin ? '/admin/settings' : '/dashboard')
    return
  }

  if (authStore.isSimpleMode) {
    if (to.meta.simpleModeRestricted) {
      next(authStore.isAdmin ? '/admin/dashboard' : '/dashboard')
      return
    }
  }

  if (appStore.backendModeEnabled) {
    if (authStore.isAuthenticated && authStore.isAdmin) {
      next()
      return
    }
    const isAllowed = isBackendModePublicRouteAllowed(to, authStore.hasPendingAuthSession)
    if (!isAllowed) {
      next('/login')
      return
    }
  }

  next()
})

router.afterEach((to) => {
  navigationLoading.endNavigation()

  if (!routePrefetch) {
    routePrefetch = useRoutePrefetch(router)
  }
  routePrefetch.triggerPrefetch(to)
})

router.onError((error) => {
  console.error('Router error:', error)

  const isChunkLoadError =
    error.message?.includes('Failed to fetch dynamically imported module') ||
    error.message?.includes('Loading chunk') ||
    error.message?.includes('Loading CSS chunk') ||
    error.name === 'ChunkLoadError'

  if (isChunkLoadError) {
    const reloadKey = 'chunk_reload_attempted'
    const lastReload = sessionStorage.getItem(reloadKey)
    const now = Date.now()

    if (!lastReload || now - parseInt(lastReload) > 10000) {
      sessionStorage.setItem(reloadKey, now.toString())
      console.warn('Chunk load error detected, reloading page to fetch latest version...')
      window.location.reload()
    } else {
      console.error('Chunk load error persists after reload. Please clear browser cache.')
    }
  }
})

export default router
