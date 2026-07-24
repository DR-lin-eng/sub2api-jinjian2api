import type { RouteRecordRaw } from 'vue-router'

export const adminProxiesRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/proxies',
    name: 'AdminProxies',
    component: () => import('@/features/admin-proxies/presentation/pages/ProxiesPage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Proxy Management', titleKey: 'admin.proxies.title', descriptionKey: 'admin.proxies.description' },
  },
]
