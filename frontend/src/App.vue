<script setup lang="ts">
import { RouterView, useRouter, useRoute } from 'vue-router'
import { onMounted, onBeforeUnmount, watch } from 'vue'
import Toast from '@/common/widgets/feedback/Toast.vue'
import NavigationProgress from '@/common/widgets/feedback/NavigationProgress.vue'
import AdminComplianceDialog from '@/features/admin-settings/presentation/widgets/AdminComplianceDialog.vue'
import { resolveRouteDocumentTitle } from '@/core/routes/title'
import { useAppStore, useAuthStore, useAdminComplianceStore } from '@/stores'
import { getSetupStatus } from '@/features/setup/data/datasources/setupDatasource'
import { updateFavicon } from '@/core/services/branding'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const authStore = useAuthStore()
const adminComplianceStore = useAdminComplianceStore()

function updateDocumentTitle() {
  document.title = resolveRouteDocumentTitle(route, appStore.siteName)
}

// Watch for site settings changes and update favicon/title
watch(
  () => appStore.siteLogo,
  (newLogo) => {
    if (newLogo) {
      updateFavicon(newLogo)
    }
  },
  { immediate: true }
)

watch(
  [
    () => route.fullPath,
    () => route.meta.title,
    () => route.meta.titleKey,
    () => appStore.siteName,
  ],
  updateDocumentTitle,
  { deep: true }
)

function onAdminComplianceRequired(event: Event) {
  const detail = (event as CustomEvent<Record<string, string>>).detail || {}
  adminComplianceStore.requireAcknowledgement(detail)
}

async function logoutForAdminCompliance(): Promise<void> {
  await authStore.logout()
  window.location.href = '/login'
}

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      if (authStore.isAdmin) {
        adminComplianceStore.fetchStatus().catch((error) => {
          console.error('Failed to fetch admin compliance status:', error)
        })
      }

    } else {
      adminComplianceStore.reset()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  window.removeEventListener('admin-compliance-required', onAdminComplianceRequired)
})

onMounted(async () => {
  window.addEventListener('admin-compliance-required', onAdminComplianceRequired)

  // Check if setup is needed
  try {
    const status = await getSetupStatus()
    if (status.needs_setup && route.path !== '/setup') {
      await router.replace('/setup')
      return
    }
  } catch {
    // If setup endpoint fails, assume normal mode and continue
  }

  // Load public settings into appStore (will be cached for other components)
  await appStore.fetchPublicSettings()

  // Re-resolve document title now that site settings are available
  updateDocumentTitle()
})
</script>

<template>
  <NavigationProgress />
  <RouterView />
  <Toast />
  <AdminComplianceDialog
    :is-authenticated="authStore.isAuthenticated"
    :is-admin="authStore.isAdmin"
    @logout="logoutForAdminCompliance"
  />
</template>
