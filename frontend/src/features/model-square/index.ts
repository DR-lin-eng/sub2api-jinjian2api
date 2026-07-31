import type { RouteRecordRaw } from 'vue-router'

/* MUST only export: Page components + necessary domain types. */
/* MUST NOT export: store / composable / repository / datasource / widget. */

export const modelSquareRoutes: RouteRecordRaw[] = [
  {
    path: '/models',
    name: 'ModelSquare',
    component: () => import('@/features/model-square/presentation/pages/ModelSquarePage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
      title: 'Model Square',
      titleKey: 'modelSquare.title',
      descriptionKey: 'modelSquare.description',
    },
  },
]
