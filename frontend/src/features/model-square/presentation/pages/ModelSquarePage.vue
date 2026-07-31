<template>
  <AppLayout>
    <div class="mx-auto w-full min-w-0 max-w-[calc(100vw-2rem)] overflow-x-hidden pb-20 md:max-w-[1600px]">
      <section class="min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-dark-700 dark:bg-dark-900 sm:p-4">
        <div class="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_190px_190px_auto]">
          <SearchInput
            v-model="searchQuery"
            :placeholder="t('modelSquare.searchPlaceholder')"
            :debounce-ms="0"
          />
          <Select
            v-model="providerFilter"
            :options="providerOptions"
            :searchable="false"
            :aria-label="t('modelSquare.filters.provider')"
          />
          <Select
            v-model="groupFilter"
            :options="groupOptions"
            :searchable="false"
            :aria-label="t('modelSquare.filters.group')"
          />
          <button
            type="button"
            class="btn btn-secondary min-h-[42px] whitespace-nowrap"
            :class="favoriteOnly && 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300'"
            :aria-pressed="favoriteOnly"
            @click="favoriteOnly = !favoriteOnly"
          >
            <Icon name="heart" size="sm" :class="['mr-2', favoriteOnly && 'fill-current']" />
            {{ t('modelSquare.filters.favorites') }}
          </button>
        </div>

        <div class="mt-3 flex min-w-0 items-center gap-2 overflow-x-auto pb-1" role="tablist" :aria-label="t('modelSquare.filters.category')">
          <button
            v-for="category in categoryOptions"
            :key="category.value"
            type="button"
            role="tab"
            class="flex-none rounded-lg px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
            :class="categoryFilter === category.value
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 dark:text-dark-200 dark:hover:bg-dark-800'"
            :aria-selected="categoryFilter === category.value"
            @click="categoryFilter = category.value"
          >
            {{ category.label }}
          </button>
        </div>
      </section>

      <Transition name="compare-tray">
        <div
          v-if="comparedModels.length"
          class="sticky top-20 z-20 mx-auto mt-4 flex max-w-3xl flex-col gap-3 rounded-xl border border-gray-200 bg-white/95 p-3 shadow-xl shadow-gray-300/30 backdrop-blur sm:flex-row sm:items-center dark:border-dark-600 dark:bg-dark-900/95 dark:shadow-black/30"
        >
          <div class="flex min-w-0 flex-1 items-center gap-3">
            <div class="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-300">
              <Icon name="swap" size="md" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-gray-950 dark:text-white">
                {{ t('modelSquare.compare.selected', { count: comparedModels.length }) }}
              </p>
              <div class="mt-1 flex items-center gap-1.5 overflow-hidden">
                <span v-for="model in comparedModels" :key="model.id" class="truncate text-xs text-gray-500 dark:text-dark-300">
                  {{ model.name }}<span v-if="model.id !== comparedModels[comparedModels.length - 1].id"> ·</span>
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" class="btn btn-secondary flex-1 sm:flex-none" @click="compareIds = []">
              {{ t('modelSquare.compare.clear') }}
            </button>
            <button
              type="button"
              class="btn btn-primary flex-1 sm:flex-none"
              :disabled="comparedModels.length < 2"
              @click="showCompareDialog = true"
            >
              {{ t('modelSquare.compare.action') }}
            </button>
          </div>
        </div>
      </Transition>

      <div class="mt-6 flex items-center justify-between gap-4">
        <p class="text-sm font-medium text-gray-700 dark:text-dark-100">
          {{ t('modelSquare.resultCount', { count: filteredModels.length }) }}
        </p>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          @click="resetFilters"
        >
          <Icon name="refresh" size="xs" class="mr-1.5" />
          {{ t('modelSquare.filters.reset') }}
        </button>
      </div>

      <div
        v-if="filteredModels.length"
        class="mt-4 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5"
      >
        <ModelSquareCard
          v-for="model in filteredModels"
          :key="model.id"
          :model="model"
          :group-id="groupFilter"
          :is-favorite="favoriteIds.includes(model.id)"
          :is-compared="compareIds.includes(model.id)"
          :compare-disabled="compareIds.length >= 3"
          @toggle-favorite="toggleFavorite"
          @toggle-compare="toggleCompare"
          @copy="copyModelId"
          @view="openDetails"
        />
      </div>

      <EmptyState
        v-else
        class="mt-16"
        :title="t('modelSquare.empty.title')"
        :description="t('modelSquare.empty.description')"
        :action-text="t('modelSquare.filters.reset')"
        :action-icon="false"
        @action="resetFilters"
      >
        <template #icon>
          <Icon name="search" size="xl" />
        </template>
      </EmptyState>

    </div>

    <ModelDetailDialog
      :model="selectedModel"
      :group-id="groupFilter"
      :is-favorite="selectedModel ? favoriteIds.includes(selectedModel.id) : false"
      @close="selectedModel = null"
      @copy="copyModelId"
      @toggle-favorite="toggleFavorite"
    />

    <ModelCompareDialog
      :show="showCompareDialog"
      :models="comparedModels"
      :group-id="groupFilter"
      @close="showCompareDialog = false"
      @clear="clearComparison"
      @remove="toggleCompare"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/common/widgets/layout/AppLayout.vue'
import EmptyState from '@/common/widgets/feedback/EmptyState.vue'
import SearchInput from '@/common/widgets/forms/SearchInput.vue'
import Select from '@/common/widgets/forms/Select.vue'
import Icon from '@/common/widgets/icons/Icon.vue'
import { useClipboard } from '@/common/composables/useClipboard'
import { useAppStore } from '@/core/stores/appStore'
import ModelCompareDialog from '@/features/model-square/presentation/widgets/ModelCompareDialog.vue'
import ModelDetailDialog from '@/features/model-square/presentation/widgets/ModelDetailDialog.vue'
import ModelSquareCard from '@/features/model-square/presentation/widgets/ModelSquareCard.vue'
import {
  modelSquareMockData,
  type ModelCategory,
  type ModelSquareDisplayItem,
} from '@/features/model-square/presentation/utils/modelSquareMockData'

type GroupId = 'default' | 'developer' | 'vip'
type CategoryFilter = ModelCategory | 'all'

const { t } = useI18n()
const appStore = useAppStore()
const { copyToClipboard } = useClipboard()

const searchQuery = ref('')
const providerFilter = ref('all')
const groupFilter = ref<GroupId>('default')
const categoryFilter = ref<CategoryFilter>('all')
const favoriteOnly = ref(false)
const favoriteIds = ref<string[]>(['gpt-4.1', 'claude-sonnet-4'])
const compareIds = ref<string[]>([])
const selectedModel = ref<ModelSquareDisplayItem | null>(null)
const showCompareDialog = ref(false)

const providerOptions = computed(() => [
  { value: 'all', label: t('modelSquare.filters.allProviders') },
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'google', label: 'Google' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'alibaba', label: 'Alibaba Cloud' },
])

const groupOptions = computed(() => [
  { value: 'default', label: t('modelSquare.groups.default') },
  { value: 'developer', label: t('modelSquare.groups.developer') },
  { value: 'vip', label: t('modelSquare.groups.vip') },
])

const categoryOptions = computed<Array<{ value: CategoryFilter; label: string }>>(() => [
  { value: 'all', label: t('modelSquare.categories.all') },
  { value: 'chat', label: t('modelSquare.categories.chat') },
  { value: 'reasoning', label: t('modelSquare.categories.reasoning') },
  { value: 'image', label: t('modelSquare.categories.image') },
  { value: 'video', label: t('modelSquare.categories.video') },
  { value: 'embedding', label: t('modelSquare.categories.embedding') },
])

const filteredModels = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return modelSquareMockData.filter((model) => {
    if (providerFilter.value !== 'all' && model.providerId !== providerFilter.value) return false
    if (categoryFilter.value !== 'all' && model.category !== categoryFilter.value) return false
    if (favoriteOnly.value && !favoriteIds.value.includes(model.id)) return false
    if (!query) return true

    return [model.name, model.id, model.providerName, t(model.descriptionKey)]
      .some(value => String(value).toLowerCase().includes(query))
  })
})

const comparedModels = computed(() => (
  compareIds.value
    .map(id => modelSquareMockData.find(model => model.id === id))
    .filter((model): model is ModelSquareDisplayItem => Boolean(model))
))

const hasActiveFilters = computed(() => (
  Boolean(searchQuery.value)
  || providerFilter.value !== 'all'
  || groupFilter.value !== 'default'
  || categoryFilter.value !== 'all'
  || favoriteOnly.value
))

function resetFilters(): void {
  searchQuery.value = ''
  providerFilter.value = 'all'
  groupFilter.value = 'default'
  categoryFilter.value = 'all'
  favoriteOnly.value = false
}

function toggleFavorite(id: string): void {
  favoriteIds.value = favoriteIds.value.includes(id)
    ? favoriteIds.value.filter(item => item !== id)
    : [...favoriteIds.value, id]
}

function toggleCompare(id: string): void {
  if (compareIds.value.includes(id)) {
    compareIds.value = compareIds.value.filter(item => item !== id)
    if (compareIds.value.length < 2) showCompareDialog.value = false
    return
  }

  if (compareIds.value.length >= 3) {
    appStore.showError(t('modelSquare.compare.limit'))
    return
  }
  compareIds.value = [...compareIds.value, id]
}

function openDetails(model: ModelSquareDisplayItem): void {
  selectedModel.value = model
}

function clearComparison(): void {
  compareIds.value = []
  showCompareDialog.value = false
}

async function copyModelId(id: string): Promise<void> {
  await copyToClipboard(id, t('modelSquare.copySuccess', { id }))
}
</script>

<style scoped>
.compare-tray-enter-active,
.compare-tray-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.compare-tray-enter-from,
.compare-tray-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (prefers-reduced-motion: reduce) {
  .compare-tray-enter-active,
  .compare-tray-leave-active {
    transition: none;
  }
}
</style>
