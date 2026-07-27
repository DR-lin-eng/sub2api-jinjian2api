<template>
  <ExportProgressDialog
    :show="show"
    :progress="progress"
    :current="current"
    :total="total"
    :estimated-time="estimatedTime"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
import ExportProgressDialog from '@/common/widgets/feedback/ExportProgressDialog.vue'
defineProps<{ show: boolean, progress: number, current: number, total: number, estimatedTime: string }>()
defineEmits(['cancel'])
</script>