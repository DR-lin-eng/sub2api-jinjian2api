<template>
  <div class="space-y-6">
    <SettingsSecurityApiKeysPanel />
    <SettingsSecurityAccessPanel />
    <SettingsSecurityIdentityProvidersPanel />
  </div>
</template>

<script setup lang="ts">
import SettingsSecurityApiKeysPanel from './SettingsSecurityApiKeysPanel.vue'
import SettingsSecurityAccessPanel from './SettingsSecurityAccessPanel.vue'
import SettingsSecurityIdentityProvidersPanel from './SettingsSecurityIdentityProvidersPanel.vue'
</script>
