<template>
  <BatchImageGuideWorkspace :context="context" />
</template>

<script setup lang="ts">
import { useBatchImageGuideController } from '@/features/batch-image/presentation/composables/useBatchImageGuideController'
import BatchImageGuideWorkspace from '@/features/batch-image/presentation/widgets/BatchImageGuideWorkspace.vue'

const context = useBatchImageGuideController()
</script>
