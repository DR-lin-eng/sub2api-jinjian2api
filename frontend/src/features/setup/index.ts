import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/core/stores/authStore'
import { useSetupQueryStore } from '@/features/setup/presentation/stores/setupQueryStore'

export const setupRoutes: RouteRecordRaw[] = [
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('@/features/setup/presentation/pages/SetupWizardPage.vue'),
    meta: { requiresAuth: false, title: 'Setup' },
    async beforeEnter(_to, _from, next) {
      try {
        const store = useSetupQueryStore()
        await store.getSetupStatus()
        if (!store.setupStatus?.needsSetup) {
          const authStore = useAuthStore()
          const redirectPath = !authStore.isAuthenticated ? '/login' : authStore.isAdmin ? '/admin/dashboard' : '/dashboard'
          next(redirectPath)
          return
        }
      } catch {
        // cannot determine setup status — allow through
      }
      next()
    },
  },
]
