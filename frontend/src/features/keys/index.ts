/* Feature barrel per spec §6 R8. */
/* MUST only export: Page components + route fragment + necessary domain types. */
/* MUST NOT export: store / composable / repository / datasource / widget.      */
import type { RouteRecordRaw } from 'vue-router'

export { default as KeysPage } from './presentation/pages/KeysPage.vue'
export { default as KeyUsagePage } from './presentation/pages/KeyUsagePage.vue'

export const keysRoutes: RouteRecordRaw[] = [
  {
    path: '/keys',
    name: 'Keys',
    component: () => import('@/features/keys/presentation/pages/KeysPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
      title: 'API Keys',
      titleKey: 'keys.title',
      descriptionKey: 'keys.description',
    },
  },
  {
    path: '/key-usage',
    name: 'KeyUsage',
    component: () => import('@/features/keys/presentation/pages/KeyUsagePage.vue'),
    meta: {
      requiresAuth: false,
      title: 'Key Usage',
    },
  },
]
