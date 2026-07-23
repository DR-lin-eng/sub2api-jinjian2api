/* Feature barrel per spec §1. */
/* MUST only export: Page components + route fragment.                    */
/* MUST NOT export: store / composable / repository / datasource / widget. */
import type { RouteRecordRaw } from 'vue-router'

export { default as ChannelsPage } from './presentation/pages/ChannelsPage.vue'

export const adminChannelsRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/channels',
    redirect: '/admin/channels/pricing',
  },
  {
    path: '/admin/channels/pricing',
    name: 'AdminChannels',
    component: () => import('@/features/admin-channels/presentation/pages/ChannelsPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Channel Management',
      titleKey: 'admin.channels.title',
      descriptionKey: 'admin.channels.description',
    },
  },
]
