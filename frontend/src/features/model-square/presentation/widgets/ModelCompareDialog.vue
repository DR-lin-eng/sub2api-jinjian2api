<template>
  <BaseDialog
    :show="show"
    :title="t('modelSquare.compare.title')"
    width="extra-wide"
    :close-on-click-outside="true"
    @close="emit('close')"
  >
    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-dark-700">
      <table class="w-full min-w-[760px] table-fixed text-sm">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50 dark:border-dark-700 dark:bg-dark-800">
            <th class="w-40 px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-dark-300">
              {{ t('modelSquare.compare.dimension') }}
            </th>
            <th v-for="model in models" :key="model.id" class="px-4 py-4 text-left align-top">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-dark-600 dark:bg-dark-900">
                  <ModelIcon :model="model.id" size="24px" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate font-semibold text-gray-950 dark:text-white">{{ model.name }}</p>
                  <p class="mt-1 truncate text-xs font-normal text-gray-500 dark:text-dark-400">{{ model.providerName }}</p>
                </div>
                <button
                  type="button"
                  class="btn-icon h-8 w-8 flex-none"
                  :title="t('modelSquare.compare.remove')"
                  :aria-label="t('modelSquare.compare.remove')"
                  @click="emit('remove', model.id)"
                >
                  <Icon name="x" size="sm" />
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-dark-700">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300">{{ t('modelSquare.fields.category') }}</th>
            <td v-for="model in models" :key="model.id" class="px-4 py-3 text-gray-800 dark:text-dark-100">
              {{ t(`modelSquare.categories.${model.category}`) }}
            </td>
          </tr>
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300">{{ t('modelSquare.fields.context') }}</th>
            <td v-for="model in models" :key="model.id" class="px-4 py-3 font-semibold text-gray-950 dark:text-white">{{ model.contextWindow }}</td>
          </tr>
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300">{{ t('modelSquare.fields.maxOutput') }}</th>
            <td v-for="model in models" :key="model.id" class="px-4 py-3 font-semibold text-gray-950 dark:text-white">{{ model.maxOutput }}</td>
          </tr>
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300">{{ t('modelSquare.fields.inputPrice') }}</th>
            <td v-for="model in models" :key="model.id" class="px-4 py-3 font-semibold text-gray-950 dark:text-white">{{ formatPrice(model.inputPrice) }}</td>
          </tr>
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300">{{ t('modelSquare.fields.outputPrice') }}</th>
            <td v-for="model in models" :key="model.id" class="px-4 py-3 font-semibold text-gray-950 dark:text-white">{{ formatPrice(model.outputPrice) }}</td>
          </tr>
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300">{{ t('modelSquare.fields.groupMultiplier') }}</th>
            <td v-for="model in models" :key="model.id" class="px-4 py-3 font-semibold text-primary-600 dark:text-primary-400">
              {{ getGroupRate(model).inputMultiplier }}x / {{ getGroupRate(model).outputMultiplier }}x
            </td>
          </tr>
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300">{{ t('modelSquare.detail.capabilities') }}</th>
            <td v-for="model in models" :key="model.id" class="px-4 py-3 align-top">
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="capability in model.capabilities"
                  :key="capability"
                  class="rounded-md bg-gray-100 px-2 py-1 text-[11px] text-gray-600 dark:bg-dark-800 dark:text-dark-200"
                >
                  {{ t(`modelSquare.capabilities.${capability}`) }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="mt-3 text-xs text-gray-500 dark:text-dark-400">
      {{ t('modelSquare.compare.groupHint', { group: t(`modelSquare.groups.${groupId}`) }) }}
    </p>

    <template #footer>
      <button type="button" class="btn btn-secondary" @click="emit('clear')">
        {{ t('modelSquare.compare.clear') }}
      </button>
      <button type="button" class="btn btn-primary" @click="emit('close')">
        {{ t('common.close') }}
      </button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseDialog from '@/common/widgets/feedback/BaseDialog.vue'
import Icon from '@/common/widgets/icons/Icon.vue'
import ModelIcon from '@/common/widgets/icons/ModelIcon.vue'
import type { ModelGroupRate, ModelSquareDisplayItem } from '@/features/model-square/presentation/utils/modelSquareMockData'

const props = defineProps<{
  show: boolean
  models: ModelSquareDisplayItem[]
  groupId: 'default' | 'developer' | 'vip'
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'clear'): void
  (event: 'remove', id: string): void
}>()

const { t } = useI18n()

function getGroupRate(model: ModelSquareDisplayItem): ModelGroupRate {
  return model.groupRates.find(rate => rate.groupId === props.groupId) ?? model.groupRates[0]
}

function formatPrice(value: number): string {
  if (value === 0) return '-'
  return `$${value < 1 ? value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '') : value.toFixed(2).replace(/\.00$/, '')}`
}
</script>
