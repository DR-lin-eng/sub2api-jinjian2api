import type { RouteRecordRaw } from 'vue-router'

export const modelPlazaRoutes: RouteRecordRaw[] = [
  {
    path: '/model-plaza',
    name: 'ModelPlaza',
    component: () => import('@/features/model-plaza/presentation/pages/ModelPlazaPage.vue'),
    meta: {
      requiresAuth: false,
      requiresModelPlaza: true,
      backendModePublic: true,
      title: 'Model Plaza',
      titleKey: 'modelPlaza.title',
    },
  },
]
