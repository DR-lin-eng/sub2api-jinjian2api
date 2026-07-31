<template>
  <article
    class="group flex min-h-[360px] min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-200/40 transition duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-500/5 dark:border-dark-700 dark:bg-dark-900 dark:shadow-black/20 dark:hover:border-primary-700"
  >
    <div class="flex items-start gap-4 p-5 pb-4">
      <div class="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-gray-100 bg-gray-50 dark:border-dark-700 dark:bg-dark-800">
        <ModelIcon :model="model.id" size="28px" />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex min-w-0 items-center gap-2">
          <h2 class="truncate text-base font-semibold text-gray-950 dark:text-white">
            {{ model.name }}
          </h2>
          <button
            type="button"
            class="btn-icon h-7 w-7 flex-none"
            :title="t('modelSquare.actions.copyId')"
            :aria-label="t('modelSquare.actions.copyId')"
            @click="emit('copy', model.id)"
          >
            <Icon name="copy" size="xs" />
          </button>
          <span
            v-if="model.badge"
            class="flex-none rounded-md bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700 dark:bg-primary-950/60 dark:text-primary-300"
          >
            {{ t(`modelSquare.badges.${model.badge}`) }}
          </span>
        </div>
        <p class="mt-1 truncate text-xs text-gray-500 dark:text-dark-300">
          {{ model.providerName }} · {{ t(`modelSquare.categories.${model.category}`) }}
        </p>
      </div>

      <button
        type="button"
        class="btn-icon -mr-1 -mt-1 h-9 w-9 flex-none"
        :class="isFavorite ? 'text-rose-500 hover:text-rose-600' : 'text-gray-400 hover:text-gray-700 dark:text-dark-400 dark:hover:text-dark-100'"
        :title="isFavorite ? t('modelSquare.actions.unfavorite') : t('modelSquare.actions.favorite')"
        :aria-label="isFavorite ? t('modelSquare.actions.unfavorite') : t('modelSquare.actions.favorite')"
        :aria-pressed="isFavorite"
        @click="emit('toggle-favorite', model.id)"
      >
        <Icon name="heart" size="md" :class="isFavorite && 'fill-current'" />
      </button>
    </div>

    <div class="flex flex-1 flex-col px-5">
      <p class="line-clamp-2 min-h-[42px] text-sm leading-5 text-gray-600 dark:text-dark-200">
        {{ t(model.descriptionKey) }}
      </p>

      <div class="mt-4 grid grid-cols-2 gap-2">
        <div class="rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-dark-800/80">
          <p class="text-[11px] text-gray-500 dark:text-dark-400">{{ t('modelSquare.fields.context') }}</p>
          <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ model.contextWindow }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-dark-800/80">
          <p class="text-[11px] text-gray-500 dark:text-dark-400">{{ t('modelSquare.fields.maxOutput') }}</p>
          <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ model.maxOutput }}</p>
        </div>
      </div>

      <div class="mt-4 flex min-w-0 items-center gap-1.5 overflow-hidden">
        <span
          v-for="capability in model.capabilities.slice(0, 3)"
          :key="capability"
          class="truncate rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-600 dark:border-dark-700 dark:text-dark-200"
        >
          {{ t(`modelSquare.capabilities.${capability}`) }}
        </span>
        <span v-if="model.capabilities.length > 3" class="flex-none text-xs text-gray-400 dark:text-dark-400">
          +{{ model.capabilities.length - 3 }}
        </span>
      </div>

      <div class="mt-5 border-t border-gray-100 pt-4 dark:border-dark-700">
        <div class="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
          <div>
            <p class="text-[11px] text-gray-500 dark:text-dark-400">{{ t('modelSquare.fields.inputPrice') }}</p>
            <p class="mt-1 text-sm font-semibold text-gray-950 dark:text-white">
              {{ formatPrice(model.inputPrice) }}
            </p>
          </div>
          <div>
            <p class="text-[11px] text-gray-500 dark:text-dark-400">{{ t('modelSquare.fields.outputPrice') }}</p>
            <p class="mt-1 text-sm font-semibold text-gray-950 dark:text-white">
              {{ formatPrice(model.outputPrice) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-[11px] text-gray-500 dark:text-dark-400">{{ t('modelSquare.fields.multiplier') }}</p>
            <p class="mt-1 text-sm font-semibold text-primary-600 dark:text-primary-400">
              {{ activeRate.inputMultiplier }}x
            </p>
          </div>
        </div>
        <p class="mt-1.5 text-[10px] text-gray-400 dark:text-dark-500">
          {{ t(priceUnitKey) }}
        </p>
      </div>
    </div>

    <div class="mt-5 flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-5 py-3 dark:border-dark-700 dark:bg-dark-800/50">
      <label class="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-600 dark:text-dark-200">
        <input
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-600 dark:bg-dark-800"
          :checked="isCompared"
          :disabled="compareDisabled && !isCompared"
          @change="emit('toggle-compare', model.id)"
        />
        {{ t('modelSquare.actions.compare') }}
      </label>

      <div class="flex items-center gap-1">
        <button type="button" class="btn btn-secondary px-3 py-1.5 text-xs" @click="emit('view', model)">
          {{ t('modelSquare.actions.details') }}
          <Icon name="chevronRight" size="xs" class="ml-1" />
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/common/widgets/icons/Icon.vue'
import ModelIcon from '@/common/widgets/icons/ModelIcon.vue'
import type { ModelSquareDisplayItem } from '@/features/model-square/presentation/utils/modelSquareMockData'

const props = defineProps<{
  model: ModelSquareDisplayItem
  groupId: 'default' | 'developer' | 'vip'
  isFavorite: boolean
  isCompared: boolean
  compareDisabled: boolean
}>()

const emit = defineEmits<{
  (event: 'toggle-favorite', id: string): void
  (event: 'toggle-compare', id: string): void
  (event: 'copy', id: string): void
  (event: 'view', model: ModelSquareDisplayItem): void
}>()

const { t } = useI18n()

const activeRate = computed(() => (
  props.model.groupRates.find(rate => rate.groupId === props.groupId) ?? props.model.groupRates[0]
))

const priceUnitKey = computed(() => {
  if (props.model.category === 'image') return 'modelSquare.units.perImage'
  if (props.model.category === 'video') return 'modelSquare.units.perSecond'
  return 'modelSquare.units.perMillionTokens'
})

function formatPrice(value: number): string {
  if (value === 0) return '-'
  return `$${value < 1 ? value.toFixed(2) : value.toFixed(2).replace(/\.00$/, '')}`
}
</script>
