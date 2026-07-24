import type { RouteRecordRaw } from 'vue-router'

export const commonRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/common/pages/HomePage.vue'),
    meta: {
      requiresAuth: false,
      title: 'Home',
      backendModePublic: true,
    },
  },
  {
    path: '/legal/:documentId',
    name: 'LegalDocument',
    component: () => import('@/common/pages/LegalDocumentPage.vue'),
    meta: {
      requiresAuth: false,
      title: 'Legal Document',
      backendModePublic: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/common/pages/NotFoundPage.vue'),
    meta: {
      title: '404 Not Found',
    },
  },
]
