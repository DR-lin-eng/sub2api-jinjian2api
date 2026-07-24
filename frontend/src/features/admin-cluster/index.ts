/* Feature barrel per spec §6 R8. */
/* MUST only export: Page components + route fragment.                    */
/* MUST NOT export: store / composable / repository / datasource / widget */
import type { RouteRecordRaw } from 'vue-router'


export const adminClusterRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/multi-instance',
    name: 'AdminMultiInstance',
    component: () => import('@/features/admin-cluster/presentation/pages/MultiInstancePage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Multi-instance Deployment',
      titleKey: 'admin.cluster.title',
      descriptionKey: 'admin.cluster.description',
    },
  },
]
