<template>
  <AppLayout>
    <div data-testid="profile-shell" class="mx-auto max-w-[880px] space-y-6">
      <ProfileInfoCard :user="user" />
      <ProfilePasswordForm />
      <ProfileTotpCard />
      <ProfilePasskeyCard :enabled="passkeyEnabled" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppLayout from '@/common/widgets/layout/AppLayout.vue'
import { useAppStore } from '@/core/stores/appStore'
import { useAuthStore } from '@/features/auth/presentation/stores/authStore'
import ProfilePasskeyCard from '@/features/passkeys/presentation/widgets/ProfilePasskeyCard.vue'
import ProfileInfoCard from '@/features/profile/presentation/widgets/ProfileInfoCard.vue'
import ProfilePasswordForm from '@/features/profile/presentation/widgets/ProfilePasswordForm.vue'
import ProfileTotpCard from '@/features/profile/presentation/widgets/ProfileTotpCard.vue'

const appStore = useAppStore()
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const passkeyEnabled = ref(false)

onMounted(async () => {
  const profileRefresh = authStore.refreshUser().catch((error) => {
    console.error('Failed to refresh administrator profile:', error)
  })
  const settingsLoad = appStore.fetchPublicSettings()
    .then((settings) => {
      passkeyEnabled.value = settings?.passkey_enabled === true
    })
    .catch((error) => {
      console.error('Failed to load public settings:', error)
    })

  await Promise.all([profileRefresh, settingsLoad])
})
</script>
