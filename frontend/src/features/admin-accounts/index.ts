/* Feature barrel per spec §6 R8. */
/* MUST only export: Page components + route fragment + necessary domain types. */
/* MUST NOT export: store / composable / repository / datasource / widget.      */
import type { RouteRecordRaw } from 'vue-router'

export { default as AccountsPage } from './presentation/pages/AccountsPage.vue'

export const adminAccountsRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/accounts',
    name: 'AdminAccounts',
    component: () => import('@/features/admin-accounts/presentation/pages/AccountsPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Account Management',
      titleKey: 'admin.accounts.title',
      descriptionKey: 'admin.accounts.description'
    }
  }
]
