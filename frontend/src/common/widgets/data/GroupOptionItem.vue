<template>
  <div class="flex min-w-0 flex-1 items-start justify-between gap-3">
    <div class="flex min-w-0 flex-1 flex-col items-start" :title="description || undefined">
      <GroupBadge :name="name" :platform="platform" :show-rate="false" class="groupOptionItemBadge" />
      <span
        v-if="description"
        class="mt-1.5 w-full whitespace-pre-line text-left text-xs leading-relaxed text-gray-500 [overflow-wrap:anywhere] line-clamp-3 dark:text-gray-400"
      >
        {{ description }}
      </span>
    </div>

    <div class="flex shrink-0 items-center gap-2 pt-0.5">
      <span
        v-if="rateMultiplier !== undefined"
        :class="['inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold', ratePillClass]"
      >
        {{ rateMultiplier }}x {{ t('admin.groups.rateLabel') }}
      </span>
      <svg
        v-if="showCheckmark && selected"
        class="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GroupPlatform } from '@/types'
import GroupBadge from './GroupBadge.vue'

const props = withDefaults(defineProps<{
  name: string
  platform: GroupPlatform
  rateMultiplier?: number
  description?: string | null
  selected?: boolean
  showCheckmark?: boolean
}>(), {
  selected: false,
  showCheckmark: true
})

const { t } = useI18n()

const ratePillClass = computed(() => {
  switch (props.platform) {
    case 'anthropic':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
    case 'openai':
      return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
    case 'gemini':
      return 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400'
    default:
      return 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400'
  }
})
</script>

<style scoped>
.groupOptionItemBadge :deep(span.truncate) {
  font-weight: 600;
}
</style>
