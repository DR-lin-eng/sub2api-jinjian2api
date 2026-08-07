<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
      badgeClass
    ]"
  >
    <PlatformIcon v-if="platform" :platform="platform" size="sm" />
    <span class="truncate">{{ name }}</span>
    <span
      v-if="showRate && rateMultiplier !== undefined"
      class="rounded bg-black/10 px-1.5 py-0.5 text-[10px] font-semibold dark:bg-white/10"
    >
      {{ rateMultiplier }}x
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PlatformIcon from '@/common/widgets/icons/PlatformIcon.vue'
import type { GroupPlatform } from '@/types'

const props = withDefaults(defineProps<{
  name: string
  platform?: GroupPlatform
  rateMultiplier?: number
  showRate?: boolean
}>(), {
  showRate: true
})

const badgeClass = computed(() => {
  switch (props.platform) {
    case 'anthropic':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    case 'openai':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'gemini':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'antigravity':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    case 'grok':
      return 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100'
    case 'composite':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
})
</script>
