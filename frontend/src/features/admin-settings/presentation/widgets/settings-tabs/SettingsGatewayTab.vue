<template>
  <div class="space-y-6">
    <SettingsGatewayResiliencePanel />
    <SettingsGatewaySchedulingPanel />
    <SettingsGatewayForwardingPanel />
  </div>
</template>

<script setup lang="ts">
import SettingsGatewayResiliencePanel from './SettingsGatewayResiliencePanel.vue'
import SettingsGatewaySchedulingPanel from './SettingsGatewaySchedulingPanel.vue'
import SettingsGatewayForwardingPanel from './SettingsGatewayForwardingPanel.vue'
</script>
