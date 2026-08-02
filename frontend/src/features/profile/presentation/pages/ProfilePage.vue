<template>
  <AppLayout>
    <div
      data-testid="profile-shell"
      class="mx-auto max-w-[950px] space-y-6"
    >
      <ProfileInfoCard
        :user="user"
        :linuxdo-enabled="linuxdoOAuthEnabled"
        :dingtalk-enabled="dingtalkOAuthEnabled"
        :oidc-enabled="oidcOAuthEnabled"
        :oidc-provider-name="oidcOAuthProviderName"
        :wechat-enabled="wechatOAuthEnabled"
        :wechat-open-enabled="wechatOAuthOpenEnabled"
        :wechat-mp-enabled="wechatOAuthMPEnabled"
      />

      <div
        v-if="contactInfo"
        class="card border-primary-200 bg-primary-50 p-6 dark:bg-primary-900/20"
      >
        <div class="flex items-center gap-4">
          <div class="rounded-xl bg-primary-100 p-3 text-primary-600">
            <Icon name="chat" size="lg" />
          </div>
          <div>
            <h3 class="font-semibold text-primary-800 dark:text-primary-200">
              {{ t('common.contactSupport') }}
            </h3>
            <p class="text-sm font-medium">{{ contactInfo }}</p>
          </div>
        </div>
      </div>

      <ProfilePasswordForm />

      <ProfileBalanceNotifyCard
        v-if="user && balanceLowNotifyEnabled"
        :enabled="user.balanceNotifyEnabled ?? true"
        :threshold="user.balanceNotifyThreshold ?? null"
        :extra-emails="user.balanceNotifyExtraEmails ?? []"
        :system-default-threshold="systemDefaultThreshold"
        :user-email="user.email"
      />

      <ProfileTotpCard />

      <ProfilePasskeyCard :enabled="passkeyEnabled" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@/common/widgets/icons'
import AppLayout from '@/common/widgets/layout/AppLayout.vue'
import ProfileBalanceNotifyCard from '@/features/profile/presentation/widgets/ProfileBalanceNotifyCard.vue'
import ProfileInfoCard from '@/features/profile/presentation/widgets/ProfileInfoCard.vue'
import ProfilePasswordForm from '@/features/profile/presentation/widgets/ProfilePasswordForm.vue'
import ProfileTotpCard from '@/features/profile/presentation/widgets/ProfileTotpCard.vue'
import ProfilePasskeyCard from '@/features/passkeys/presentation/widgets/ProfilePasskeyCard.vue'
import { isWeChatWebOAuthEnabled } from '@/core/utils/wechatOAuthResolver'
import { useAppStore } from '@/core/stores/appStore'
import { useAuthStore } from '@/features/auth/presentation/stores/authStore'

const { t } = useI18n()
const appStore = useAppStore()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const contactInfo = ref('')
const balanceLowNotifyEnabled = ref(false)
const systemDefaultThreshold = ref(0)
const linuxdoOAuthEnabled = ref(false)
const dingtalkOAuthEnabled = ref(false)
const wechatOAuthEnabled = ref(false)
const wechatOAuthOpenEnabled = ref<boolean | undefined>(undefined)
const wechatOAuthMPEnabled = ref<boolean | undefined>(undefined)
const oidcOAuthEnabled = ref(false)
const oidcOAuthProviderName = ref('OIDC')
const passkeyEnabled = ref(false)

onMounted(async () => {
  const profileRefresh = authStore.refreshUser().catch((error: unknown) => {
    console.error('Failed to refresh profile:', error)
  })

  const settingsLoad = appStore.fetchPublicSettings()
    .then((settings: Awaited<ReturnType<typeof appStore.fetchPublicSettings>>) => {
      if (!settings) {
        return
      }
      contactInfo.value = settings.contactInfo || ''
      balanceLowNotifyEnabled.value = settings.balanceLowNotifyEnabled ?? false
      systemDefaultThreshold.value = settings.balanceLowNotifyThreshold ?? 0
      linuxdoOAuthEnabled.value = settings.linuxdoOauthEnabled ?? false
      dingtalkOAuthEnabled.value = settings.dingtalkOauthEnabled ?? false
      wechatOAuthEnabled.value = isWeChatWebOAuthEnabled(settings)
      wechatOAuthOpenEnabled.value = typeof settings.wechatOauthOpenEnabled === 'boolean'
        ? settings.wechatOauthOpenEnabled
        : undefined
      wechatOAuthMPEnabled.value = typeof settings.wechatOauthMpEnabled === 'boolean'
        ? settings.wechatOauthMpEnabled
        : undefined
      oidcOAuthEnabled.value = settings.oidcOauthEnabled ?? false
      oidcOAuthProviderName.value = settings.oidcOauthProviderName || 'OIDC'
      passkeyEnabled.value = settings.passkeyEnabled === true
    })
    .catch((error: unknown) => {
      console.error('Failed to load settings:', error)
    })

  await Promise.all([profileRefresh, settingsLoad])
})
</script>
