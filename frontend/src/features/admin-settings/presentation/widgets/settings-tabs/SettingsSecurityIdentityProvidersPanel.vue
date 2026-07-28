<template>
<div class="space-y-6">
  <!-- LinuxDo Connect OAuth 登录 -->
  <SettingsIdentityLinuxDoCard />

  <!-- GitHub / Google 邮箱快捷登录 -->
  <SettingsIdentityEmailOAuthCard />

  <!-- WeChat Connect OAuth 登录 -->
  <SettingsIdentityWeChatCard />

  <!-- DingTalk Connect OAuth 登录 -->
  <SettingsIdentityDingTalkCard />

  <!-- Generic OIDC OAuth 登录 -->
  <SettingsIdentityOIDCCard />
</div>
</template>

<script setup lang="ts">
import SettingsIdentityLinuxDoCard from './identity-providers/SettingsIdentityLinuxDoCard.vue'
import SettingsIdentityEmailOAuthCard from './identity-providers/SettingsIdentityEmailOAuthCard.vue'
import SettingsIdentityWeChatCard from './identity-providers/SettingsIdentityWeChatCard.vue'
import SettingsIdentityDingTalkCard from './identity-providers/SettingsIdentityDingTalkCard.vue'
import SettingsIdentityOIDCCard from './identity-providers/SettingsIdentityOIDCCard.vue'
</script>
