/* Feature barrel per spec §1. */
/* MUST only export: Page components + route fragment.                     */
/* MUST NOT export: store / composable / repository / datasource / widget. */
import type { RouteRecordRaw } from 'vue-router'

export { default as ChannelMonitorPage } from './presentation/pages/ChannelMonitorPage.vue'

export const adminChannelMonitorRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/channels/monitor',
    name: 'AdminChannelMonitor',
    component: () => import('@/features/admin-channel-monitor/presentation/pages/ChannelMonitorPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Channel Monitor',
      titleKey: 'admin.channelMonitor.title',
      descriptionKey: 'admin.channelMonitor.description',
    },
  },
]
