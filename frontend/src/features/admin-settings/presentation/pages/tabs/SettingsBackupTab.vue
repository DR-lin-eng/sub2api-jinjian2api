<template>
  <div>
    <BackupSettings />
  </div>
</template>

<script setup lang="ts">
import BackupSettings from '@/features/admin-backup/presentation/pages/BackupPage.vue'

defineProps<{ form: Record<string, any>; saving: boolean }>()
defineEmits<{ (e: 'reload'): void }>()
</script>
