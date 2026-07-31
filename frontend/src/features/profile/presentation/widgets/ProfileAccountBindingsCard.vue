<template>
  <ProfileIdentityBindingsSection
    :user="user"
    :linuxdo-enabled="linuxdoEnabled"
    :dingtalk-enabled="dingtalkEnabled"
    :oidc-enabled="oidcEnabled"
    :oidc-provider-name="oidcProviderName"
    :wechat-enabled="wechatEnabled"
    :wechat-open-enabled="wechatOpenEnabled"
    :wechat-mp-enabled="wechatMpEnabled"
  />
</template>

<script setup lang="ts">
import ProfileIdentityBindingsSection from '@/features/profile/presentation/widgets/ProfileIdentityBindingsSection.vue'
import type { User } from '@/core/models/domain/user'
withDefaults(
  defineProps<{
    user: User | null
    linuxdoEnabled?: boolean
    dingtalkEnabled?: boolean
    oidcEnabled?: boolean
    oidcProviderName?: string
    wechatEnabled?: boolean
    wechatOpenEnabled?: boolean
    wechatMpEnabled?: boolean
  }>(),
  {
    linuxdoEnabled: false,
    dingtalkEnabled: false,
    oidcEnabled: false,
    oidcProviderName: 'OIDC',
    wechatEnabled: false,
    wechatOpenEnabled: undefined,
    wechatMpEnabled: undefined
  }
)
</script>
