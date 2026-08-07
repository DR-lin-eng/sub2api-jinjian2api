import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useNavigationLoadingState } from '@/common/composables/useNavigationLoading'
import { useRoutePrefetch } from '@/common/composables/useRoutePrefetch'
import { useAppStore } from '@/core/stores/appStore'
import { useAdminComplianceStore } from '@/features/admin-settings/presentation/stores/adminComplianceStore'
import { useAuthStore } from '@/features/auth/presentation/stores/authStore'
import { getSetupStatus } from '@/features/setup/data/datasources/setupDatasource'
import { resolveRouteDocumentTitle } from './title'

const routes: RouteRecordRaw[] = [
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('@/features/setup/presentation/pages/SetupWizardPage.vue'),
    meta: { requiresAuth: false, title: 'Setup' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/auth/presentation/pages/LoginPage.vue'),
    meta: { requiresAuth: false, title: 'Login', titleKey: 'auth.signIn' }
  },
  {
    path: '/',
    redirect: '/admin/accounts'
  },
  {
    path: '/keys',
    name: 'Keys',
    component: () => import('@/features/keys/presentation/pages/KeysPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'API Keys',
      titleKey: 'keys.title',
      descriptionKey: 'keys.description'
    }
  },
  {
    path: '/usage',
    name: 'Usage',
    component: () => import('@/features/usage/presentation/pages/UsagePage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Usage Records',
      titleKey: 'usage.title',
      descriptionKey: 'usage.description'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/features/profile/presentation/pages/ProfilePage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Profile',
      titleKey: 'profile.title',
      descriptionKey: 'profile.description'
    }
  },
  {
    path: '/admin',
    redirect: '/admin/accounts'
  },
  {
    path: '/admin/dashboard',
    redirect: '/admin/accounts'
  },
  {
    path: '/admin/accounts',
    name: 'AdminAccounts',
    component: () => import('@/features/admin-accounts/presentation/pages/AccountsPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Account Management',
      titleKey: 'admin.accounts.title',
      descriptionKey: 'admin.accounts.description'
    }
  },
  {
    path: '/admin/groups',
    name: 'AdminGroups',
    component: () => import('@/features/admin-groups/presentation/pages/GroupsPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Group Management',
      titleKey: 'admin.groups.title',
      descriptionKey: 'admin.groups.description'
    }
  },
  {
    path: '/admin/channels',
    redirect: '/admin/channels/pricing'
  },
  {
    path: '/admin/channels/pricing',
    name: 'AdminChannels',
    component: () => import('@/features/admin-channels/presentation/pages/ChannelsPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Channel Management',
      titleKey: 'admin.channels.title',
      descriptionKey: 'admin.channels.description'
    }
  },
  {
    path: '/admin/channels/monitor',
    name: 'AdminChannelMonitor',
    component: () => import('@/features/admin-channel-monitor/presentation/pages/ChannelMonitorPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Channel Monitor',
      titleKey: 'admin.channelMonitor.title',
      descriptionKey: 'admin.channelMonitor.description'
    }
  },
  {
    path: '/admin/proxies',
    name: 'AdminProxies',
    component: () => import('@/features/admin-proxies/presentation/pages/ProxiesPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Proxy Management',
      titleKey: 'admin.proxies.title',
      descriptionKey: 'admin.proxies.description'
    }
  },
  {
    path: '/admin/ops',
    name: 'AdminOps',
    component: () => import('@/features/admin-ops/presentation/pages/OpsDashboardPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Ops Monitoring',
      titleKey: 'admin.ops.title',
      descriptionKey: 'admin.ops.description'
    }
  },
  {
    path: '/admin/audit-logs',
    name: 'AdminAuditLogs',
    component: () => import('@/features/admin-audit/presentation/pages/AuditLogPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Audit Logs',
      titleKey: 'admin.audit.title',
      descriptionKey: 'admin.audit.description'
    }
  },
  {
    path: '/admin/multi-instance',
    name: 'AdminMultiInstance',
    component: () => import('@/features/admin-cluster/presentation/pages/MultiInstancePage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Multi-instance Deployment',
      titleKey: 'admin.cluster.title',
      descriptionKey: 'admin.cluster.description'
    }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: () => import('@/features/admin-settings/presentation/pages/SettingsPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'System Settings',
      titleKey: 'admin.settings.title',
      descriptionKey: 'admin.settings.description'
    }
  },
  {
    path: '/admin/security-audit/ingress',
    name: 'AdminIngressRisk',
    component: () => import('@/features/admin-risk-control/presentation/pages/IngressRiskPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Ingress Protection',
      titleKey: 'admin.ingressRisk.title',
      descriptionKey: 'admin.ingressRisk.description'
    }
  },
  {
    path: '/admin/risk-control',
    name: 'AdminRiskControl',
    component: () => import('@/features/admin-risk-control/presentation/pages/RiskControlPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Risk Control',
      titleKey: 'admin.riskControl.title',
      descriptionKey: 'admin.riskControl.description'
    }
  },
  {
    path: '/admin/prompt-audit',
    name: 'AdminPromptAudit',
    component: () => import('@/features/prompt-audit/presentation/pages/PromptAuditPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Prompt Audit',
      titleKey: 'admin.promptAudit.title',
      descriptionKey: 'admin.promptAudit.description'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/common/pages/NotFoundPage.vue'),
    meta: { requiresAuth: false, title: '404 Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  }
})

let authInitialized = false
const navigationLoading = useNavigationLoadingState()
let routePrefetch: ReturnType<typeof useRoutePrefetch> | null = null

router.beforeEach(async (to) => {
  navigationLoading.startNavigation()

  const authStore = useAuthStore()
  if (!authInitialized) {
    await authStore.checkAuth()
    authInitialized = true
  }

  const appStore = useAppStore()
  document.title = resolveRouteDocumentTitle(to, appStore.siteName)

  if (to.path === '/setup') {
    try {
      const status = await getSetupStatus()
      if (!status.needs_setup) {
        return authStore.isAuthenticated && authStore.isAdmin ? '/admin/accounts' : '/login'
      }
    } catch {
      // Keep setup reachable when its status cannot be determined.
    }
    return true
  }

  if (to.path === '/login') {
    return authStore.isAuthenticated && authStore.isAdmin ? '/admin/accounts' : true
  }

  if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin === true && !authStore.isAdmin) {
    return '/login'
  }

  if (authStore.isAdmin) {
    const complianceStore = useAdminComplianceStore()
    if (!complianceStore.initialized) {
      try {
        await complianceStore.fetchStatus()
      } catch (error) {
        const err = error as { status?: number; code?: string; metadata?: Record<string, string> }
        if (err.status === 423 && err.code === 'ADMIN_COMPLIANCE_ACK_REQUIRED') {
          complianceStore.requireAcknowledgement(err.metadata)
        }
      }
    }
  }

  return true
})

router.afterEach((to) => {
  navigationLoading.endNavigation()
  routePrefetch ??= useRoutePrefetch(router)
  routePrefetch.triggerPrefetch(to)
})

router.onError((error) => {
  const isChunkLoadError =
    error.message?.includes('Failed to fetch dynamically imported module') ||
    error.message?.includes('Loading chunk') ||
    error.message?.includes('Loading CSS chunk') ||
    error.name === 'ChunkLoadError'

  if (!isChunkLoadError) return
  const reloadKey = 'chunk_reload_attempted'
  const lastReload = Number(sessionStorage.getItem(reloadKey) ?? 0)
  if (Date.now() - lastReload > 10000) {
    sessionStorage.setItem(reloadKey, Date.now().toString())
    window.location.reload()
  }
})

export default router
