<template>
  <section
    class="rounded-2xl border bg-white shadow-card dark:bg-dark-800/50"
    :class="[platformBorderStrongClass(group.platform)]"
  >
    <!-- 分组头部:名称/平台/倍率徽章/专属/订阅徽章 + 描述 -->
    <header class="border-b border-gray-100 px-5 py-4 dark:border-dark-700/60">
      <div class="flex flex-wrap items-center gap-2">
        <GroupBadge
          :name="group.name"
          :platform="group.platform as GroupPlatform"
          :subscription-type="(group.subscriptionType || 'standard') as SubscriptionType"
          :rate-multiplier="group.rateMultiplier"
          :user-rate-multiplier="group.userRateMultiplier ?? null"
          :peak-rate-enabled="group.peakRateEnabled"
          :peak-start="group.peakStart"
          :peak-end="group.peakEnd"
          :peak-rate-multiplier="group.peakRateMultiplier"
          always-show-rate
        />
        <span
          v-if="group.isExclusive"
          class="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
        >
          <Icon name="shield" size="xs" class="h-3 w-3" />
          {{ t('modelPlaza.badges.exclusive') }}
        </span>
        <span
          v-if="group.subscriptionType === 'subscription'"
          class="inline-flex items-center rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-600 dark:bg-violet-900/20 dark:text-violet-400"
        >
          {{ t('modelPlaza.badges.subscription') }}
        </span>
      </div>
      <p v-if="group.description" class="mt-2 text-sm text-gray-500 dark:text-dark-400">
        {{ group.description }}
      </p>
      <p
        v-if="peakNote"
        class="mt-1.5 inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400"
      >
        <Icon name="clock" size="xs" class="h-3 w-3" />
        {{ peakNote }}
      </p>
    </header>

    <!-- 模型价格表 -->
    <div class="px-5">
      <PlazaModelPricingTable
        v-if="group.models.length > 0"
        :models="group.models"
        :platform="group.platform"
        :rate-multiplier="group.rateMultiplier"
        :user-rate-multiplier="group.userRateMultiplier ?? null"
      />
      <p v-else class="py-4 text-center text-sm text-gray-400 dark:text-dark-500">
        {{ t('modelPlaza.detail.noModels') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/common/widgets/icons/Icon.vue'
import GroupBadge from '@/common/widgets/data/GroupBadge.vue'
import PlazaModelPricingTable from './PlazaModelPricingTable.vue'
import type { ModelPlazaGroup } from '@/features/model-plaza/domain/models/modelPlazaGroup'
import type { GroupPlatform, SubscriptionType } from '@/features/admin-groups/domain/models/adminGroups'
import { platformBorderStrongClass } from '@/core/utils/platformColors'
import { hasPeakRate, formatPeakRateWindow, serverTimezoneLabel } from '@/core/utils/peak-rate'
import { useAppStore } from '@/core/stores/appStore'

const props = defineProps<{
  group: ModelPlazaGroup
}>()

const { t } = useI18n()
const appStore = useAppStore()

const peakNote = computed(() => {
  if (!hasPeakRate(props.group)) return ''
  const window = formatPeakRateWindow(
    props.group,
    serverTimezoneLabel(appStore.cachedPublicSettings?.serverUtcOffset)
  )
  return t('modelPlaza.detail.peakNote', {
    window,
    multiplier: props.group.peakRateMultiplier
  })
})
</script>
