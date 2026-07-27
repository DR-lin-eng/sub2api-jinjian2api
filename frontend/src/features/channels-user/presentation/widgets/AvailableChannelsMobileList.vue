<template>
  <div data-testid="mobile-channels" class="w-full min-w-0 overflow-x-hidden">
    <div v-if="loading" data-testid="mobile-loading" class="py-10 text-center">
      <Icon name="refresh" size="lg" class="inline-block animate-spin text-gray-400" />
    </div>
    <div v-else-if="rows.length === 0" data-testid="mobile-empty" class="py-12 text-center">
      <Icon name="inbox" size="xl" class="mx-auto mb-3 h-12 w-12 text-gray-400" />
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ emptyLabel }}</p>
    </div>
    <section
      v-for="(channel, channelIndex) in rows"
      v-else
      :key="`${channel.name}-${channelIndex}`"
      class="border-b-2 border-gray-200 px-4 py-4 last:border-b-0 dark:border-dark-600"
    >
      <header class="mb-3 min-w-0">
        <h3 class="break-words text-sm font-semibold text-gray-900 dark:text-white">
          {{ channel.name }}
        </h3>
        <p class="mt-1 break-words text-xs leading-5 text-gray-500 dark:text-gray-400">
          {{ channel.description || '-' }}
        </p>
      </header>

      <div class="divide-y divide-gray-100 dark:divide-dark-700/60">
        <div
          v-for="section in channel.platforms"
          :key="`${channel.name}-${section.platform}`"
          class="min-w-0 py-3 first:pt-0 last:pb-0"
        >
          <span
            :class="[
              'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase',
              platformBadgeClass(section.platform),
            ]"
          >
            <PlatformIcon :platform="section.platform as GroupPlatform" size="xs" />
            {{ section.platform }}
          </span>

          <dl class="mt-3 space-y-3">
            <div class="min-w-0">
              <dt class="mb-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                {{ columns.groups }}
              </dt>
              <dd class="flex min-w-0 flex-col gap-2">
                <div
                  v-if="exclusiveGroups(section).length > 0"
                  class="flex min-w-0 flex-wrap items-center gap-1.5"
                >
                  <span
                    class="inline-flex items-center gap-0.5 text-[10px] font-medium uppercase text-purple-600 dark:text-purple-400"
                    :title="t('availableChannels.exclusiveTooltip')"
                  >
                    <Icon name="shield" size="xs" class="h-3 w-3" />
                    {{ t('availableChannels.exclusive') }}
                  </span>
                  <div
                    v-for="group in exclusiveGroups(section)"
                    :key="`exclusive-${group.id}`"
                    class="inline-flex max-w-full min-w-0 flex-wrap items-center gap-1"
                  >
                    <GroupBadge
                      class="max-w-full"
                      :name="group.name"
                      :platform="group.platform as GroupPlatform"
                      :subscription-type="(group.subscription_type || 'standard') as SubscriptionType"
                      :rate-multiplier="group.rate_multiplier"
                      :user-rate-multiplier="userGroupRates[group.id] ?? null"
                      always-show-rate
                    />
                    <span
                      v-if="hasPeakRate(group)"
                      class="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                      :title="peakRateTitle(group)"
                    >
                      <Icon name="clock" size="xs" class="h-3 w-3" />
                      {{ peakRateLabel(group) }}
                    </span>
                  </div>
                </div>
                <div
                  v-if="publicGroups(section).length > 0"
                  class="flex min-w-0 flex-wrap items-center gap-1.5"
                >
                  <span
                    class="inline-flex items-center gap-0.5 text-[10px] font-medium uppercase text-gray-500 dark:text-gray-400"
                    :title="t('availableChannels.publicTooltip')"
                  >
                    <Icon name="globe" size="xs" class="h-3 w-3" />
                    {{ t('availableChannels.public') }}
                  </span>
                  <div
                    v-for="group in publicGroups(section)"
                    :key="`public-${group.id}`"
                    class="inline-flex max-w-full min-w-0 flex-wrap items-center gap-1"
                  >
                    <GroupBadge
                      class="max-w-full"
                      :name="group.name"
                      :platform="group.platform as GroupPlatform"
                      :subscription-type="(group.subscription_type || 'standard') as SubscriptionType"
                      :rate-multiplier="group.rate_multiplier"
                      :user-rate-multiplier="userGroupRates[group.id] ?? null"
                      always-show-rate
                    />
                    <span
                      v-if="hasPeakRate(group)"
                      class="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                      :title="peakRateTitle(group)"
                    >
                      <Icon name="clock" size="xs" class="h-3 w-3" />
                      {{ peakRateLabel(group) }}
                    </span>
                  </div>
                </div>
                <span v-if="section.groups.length === 0" class="text-xs text-gray-400">-</span>
              </dd>
            </div>

            <div class="min-w-0">
              <dt class="mb-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                {{ columns.supportedModels }}
              </dt>
              <dd class="flex min-w-0 flex-wrap gap-1">
                <SupportedModelChip
                  v-for="model in section.supported_models"
                  :key="`${section.platform}-${model.name}`"
                  class="max-w-full [&>span]:max-w-full [&>span]:truncate"
                  :model="model"
                  :pricing-key-prefix="pricingKeyPrefix"
                  :no-pricing-label="noPricingLabel"
                  :show-platform="false"
                  :platform-hint="section.platform"
                />
                <span v-if="section.supported_models.length === 0" class="text-xs text-gray-400">
                  {{ noModelsLabel }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Icon from '@/common/widgets/icons/Icon.vue'
import PlatformIcon from '@/common/widgets/icons/PlatformIcon.vue'
import GroupBadge from '@/common/widgets/data/GroupBadge.vue'
import SupportedModelChip from './SupportedModelChip.vue'
import type { UserAvailableChannel, UserAvailableGroup, UserChannelPlatformSection } from '@/features/channels-user/data/datasources/channelsUserDatasource'
import type { GroupPlatform, SubscriptionType } from '@/types'
import { platformBadgeClass } from '@/core/utils/platformColors'
import { useAppStore } from '@/core/stores/appStore'
import { hasPeakRate as groupHasPeakRate, formatPeakRateWindow, serverTimezoneLabel } from '@/core/utils/peak-rate'

defineProps<{
  columns: {
    groups: string
    supportedModels: string
  }
  rows: UserAvailableChannel[]
  loading: boolean
  pricingKeyPrefix: string
  noPricingLabel: string
  noModelsLabel: string
  emptyLabel: string
  userGroupRates: Record<number, number>
}>()

const { t } = useI18n()
const appStore = useAppStore()

function exclusiveGroups(section: UserChannelPlatformSection): UserAvailableGroup[] {
  return section.groups.filter((group) => group.is_exclusive)
}

function publicGroups(section: UserChannelPlatformSection): UserAvailableGroup[] {
  return section.groups.filter((group) => !group.is_exclusive)
}

function hasPeakRate(group: UserAvailableGroup): boolean {
  return groupHasPeakRate(group)
}

function peakRateLabel(group: UserAvailableGroup): string {
  return formatPeakRateWindow(
    group,
    serverTimezoneLabel(appStore.cachedPublicSettings?.server_utc_offset),
  )
}

function peakRateTitle(group: UserAvailableGroup): string {
  return t('common.peakRateTooltip', { window: peakRateLabel(group) }) + t('common.peakRateImageNote')
}
</script>
