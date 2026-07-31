<template>
  <BaseDialog
    :show="Boolean(model)"
    :title="model?.name ?? t('modelSquare.detail.title')"
    width="wide"
    :close-on-click-outside="true"
    @close="emit('close')"
  >
    <div v-if="model" class="space-y-7">
      <section class="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-start dark:border-dark-700">
        <div class="flex h-14 w-14 flex-none items-center justify-center rounded-xl border border-gray-200 bg-gray-50 dark:border-dark-700 dark:bg-dark-800">
          <ModelIcon :model="model.id" size="32px" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-medium text-gray-700 dark:text-dark-100">{{ model.providerName }}</span>
            <span class="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-dark-800 dark:text-dark-200">
              {{ t(`modelSquare.categories.${model.category}`) }}
            </span>
            <span
              v-if="model.badge"
              class="rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-950/60 dark:text-primary-300"
            >
              {{ t(`modelSquare.badges.${model.badge}`) }}
            </span>
          </div>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-dark-200">
            {{ t(model.descriptionKey) }}
          </p>
          <div class="mt-3 flex min-w-0 items-center gap-2">
            <code class="min-w-0 truncate rounded-md bg-gray-100 px-2.5 py-1.5 text-xs text-gray-700 dark:bg-dark-800 dark:text-dark-100">
              {{ model.id }}
            </code>
            <button
              type="button"
              class="btn-icon h-8 w-8 flex-none"
              :title="t('modelSquare.actions.copyId')"
              :aria-label="t('modelSquare.actions.copyId')"
              @click="emit('copy', model.id)"
            >
              <Icon name="copy" size="sm" />
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 class="text-sm font-semibold text-gray-950 dark:text-white">{{ t('modelSquare.detail.parameters') }}</h3>
        <dl class="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-gray-100 py-4 sm:grid-cols-4 dark:border-dark-700">
          <div>
            <dt class="text-xs text-gray-500 dark:text-dark-400">{{ t('modelSquare.fields.context') }}</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ model.contextWindow }}</dd>
          </div>
          <div>
            <dt class="text-xs text-gray-500 dark:text-dark-400">{{ t('modelSquare.fields.maxOutput') }}</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ model.maxOutput }}</dd>
          </div>
          <div>
            <dt class="text-xs text-gray-500 dark:text-dark-400">{{ t('modelSquare.fields.inputPrice') }}</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ formatPrice(model.inputPrice) }}</dd>
          </div>
          <div>
            <dt class="text-xs text-gray-500 dark:text-dark-400">{{ t('modelSquare.fields.outputPrice') }}</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ formatPrice(model.outputPrice) }}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h3 class="text-sm font-semibold text-gray-950 dark:text-white">{{ t('modelSquare.detail.capabilities') }}</h3>
        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="capability in model.capabilities"
            :key="capability"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 dark:border-dark-700 dark:text-dark-100"
          >
            <Icon name="checkCircle" size="sm" class="text-primary-500" />
            {{ t(`modelSquare.capabilities.${capability}`) }}
          </span>
        </div>
      </section>

      <section>
        <div class="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 class="text-sm font-semibold text-gray-950 dark:text-white">{{ t('modelSquare.detail.groupRates') }}</h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-dark-400">{{ t('modelSquare.detail.groupRatesHint') }}</p>
          </div>
          <span class="text-xs text-gray-500 dark:text-dark-400">{{ t(priceUnitKey) }}</span>
        </div>

        <div class="mt-3 overflow-x-auto rounded-lg border border-gray-200 dark:border-dark-700">
          <table class="min-w-[640px] w-full text-left text-sm">
            <thead class="bg-gray-50 text-xs text-gray-500 dark:bg-dark-800 dark:text-dark-300">
              <tr>
                <th class="px-4 py-3 font-medium">{{ t('modelSquare.fields.group') }}</th>
                <th class="px-4 py-3 font-medium">{{ t('modelSquare.fields.inputMultiplier') }}</th>
                <th class="px-4 py-3 font-medium">{{ t('modelSquare.fields.outputMultiplier') }}</th>
                <th class="px-4 py-3 font-medium">{{ t('modelSquare.fields.effectiveInput') }}</th>
                <th class="px-4 py-3 font-medium">{{ t('modelSquare.fields.effectiveOutput') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-dark-700">
              <tr
                v-for="rate in model.groupRates"
                :key="rate.groupId"
                :class="rate.groupId === groupId && 'bg-primary-50/60 dark:bg-primary-950/20'"
              >
                <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  <span class="inline-flex items-center gap-2">
                    {{ t(`modelSquare.groups.${rate.groupId}`) }}
                    <span
                      v-if="rate.groupId === groupId"
                      class="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-medium text-primary-700 dark:bg-primary-900/60 dark:text-primary-300"
                    >
                      {{ t('modelSquare.detail.currentGroup') }}
                    </span>
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-dark-100">{{ rate.inputMultiplier }}x</td>
                <td class="px-4 py-3 text-gray-700 dark:text-dark-100">{{ rate.outputMultiplier }}x</td>
                <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {{ formatPrice(model.inputPrice * rate.inputMultiplier) }}
                </td>
                <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {{ formatPrice(model.outputPrice * rate.outputMultiplier) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <template #footer>
      <div class="flex w-full items-center justify-between gap-3">
        <button
          v-if="model"
          type="button"
          class="btn btn-secondary"
          :aria-pressed="isFavorite"
          @click="emit('toggle-favorite', model.id)"
        >
          <Icon name="heart" size="sm" :class="['mr-2', isFavorite && 'fill-current text-rose-500']" />
          {{ isFavorite ? t('modelSquare.actions.unfavorite') : t('modelSquare.actions.favorite') }}
        </button>
        <button type="button" class="btn btn-primary ml-auto" @click="emit('close')">
          {{ t('common.close') }}
        </button>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseDialog from '@/common/widgets/feedback/BaseDialog.vue'
import Icon from '@/common/widgets/icons/Icon.vue'
import ModelIcon from '@/common/widgets/icons/ModelIcon.vue'
import type { ModelSquareDisplayItem } from '@/features/model-square/presentation/utils/modelSquareMockData'

const props = defineProps<{
  model: ModelSquareDisplayItem | null
  groupId: 'default' | 'developer' | 'vip'
  isFavorite: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'copy', id: string): void
  (event: 'toggle-favorite', id: string): void
}>()

const { t } = useI18n()

const priceUnitKey = computed(() => {
  if (props.model?.category === 'image') return 'modelSquare.units.perImage'
  if (props.model?.category === 'video') return 'modelSquare.units.perSecond'
  return 'modelSquare.units.perMillionTokens'
})

function formatPrice(value: number): string {
  if (value === 0) return '-'
  return `$${value < 1 ? value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '') : value.toFixed(2).replace(/\.00$/, '')}`
}
</script>
