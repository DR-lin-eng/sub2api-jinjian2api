import type { RouteRecordRaw } from 'vue-router'

export const promptAuditRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/prompt-audit',
    name: 'AdminPromptAudit',
    component: () => import('@/features/prompt-audit/presentation/pages/PromptAuditPage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Prompt Audit', titleKey: 'admin.promptAudit.title', descriptionKey: 'admin.promptAudit.description', requiresRiskControl: true },
  },
]
