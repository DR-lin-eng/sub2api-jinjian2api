/* Feature barrel per spec §1. */
/* MUST only export: Page components + route fragment.                          */
/* MUST NOT export: store / composable / repository / datasource / widget.      */
import type { RouteRecordRaw } from 'vue-router'


export const adminAuditRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/audit-logs',
    name: 'AdminAuditLogs',
    component: () => import('@/features/admin-audit/presentation/pages/AuditLogPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Audit Logs',
      titleKey: 'admin.audit.title',
      descriptionKey: 'admin.audit.description',
    },
  },
]
