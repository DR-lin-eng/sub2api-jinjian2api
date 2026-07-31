import type { RouteRecordRaw } from 'vue-router'

/* MUST only export: Page components + necessary domain types. */
/* MUST NOT export: store / composable / repository / datasource / widget. */

export const mediaStudioRoutes: RouteRecordRaw[] = [
  {
    path: '/media-studio',
    name: 'MediaStudio',
    component: () => import('@/features/media-studio/presentation/pages/MediaStudioPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
      title: 'Media Studio',
      titleKey: 'mediaStudio.title',
      descriptionKey: 'mediaStudio.description',
    },
  },
]
