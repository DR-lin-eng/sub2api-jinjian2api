import type { RouteRecordRaw } from 'vue-router'

export const profileRoutes: RouteRecordRaw[] = [
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/features/profile/presentation/pages/ProfilePage.vue'),
    meta: { requiresAuth: true, requiresAdmin: false, title: 'Profile', titleKey: 'profile.title', descriptionKey: 'profile.description' },
  },
]
