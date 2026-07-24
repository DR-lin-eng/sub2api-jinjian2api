import type { RouteRecordRaw } from 'vue-router'


export const dashboardUserRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/features/dashboard-user/presentation/pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
      title: 'Dashboard',
      titleKey: 'dashboard.title',
      descriptionKey: 'dashboard.welcomeMessage',
    },
  },
]
