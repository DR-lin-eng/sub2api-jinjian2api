import type { RouteRecordRaw } from 'vue-router'

export const announcementsRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/announcements',
    name: 'AdminAnnouncements',
    component: () => import('@/features/announcements/presentation/pages/AnnouncementsPage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Announcements', titleKey: 'admin.announcements.title', descriptionKey: 'admin.announcements.description' },
  },
]
