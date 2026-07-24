import type { RouteRecordRaw } from 'vue-router'

export const adminPromoRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/promo-codes',
    name: 'AdminPromoCodes',
    component: () => import('@/features/admin-promo/presentation/pages/PromoCodesPage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Promo Code Management', titleKey: 'admin.promo.title', descriptionKey: 'admin.promo.description' },
  },
]
