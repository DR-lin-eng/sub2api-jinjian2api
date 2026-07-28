<template>
  <div class="flex flex-wrap items-center gap-3">
    <div class="flex flex-1 flex-wrap items-center gap-3">
      <div class="relative w-full md:w-64">
        <Icon
          name="search"
          size="md"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          :value="searchQuery"
          type="text"
          :placeholder="t('admin.users.searchUsers')"
          class="input pl-10"
          @input="handleSearchInput"
        />
      </div>

      <div v-if="visibleFilters.has('role')" class="w-full sm:w-32">
        <Select
          :model-value="filters.role"
          :options="[
            { value: '', label: t('admin.users.allRoles') },
            { value: 'admin', label: t('admin.users.admin') },
            { value: 'user', label: t('admin.users.user') }
          ]"
          @update:model-value="emit('update-role', String($event ?? ''))"
          @change="emit('apply-filter')"
        />
      </div>

      <div v-if="visibleFilters.has('schedulingTier')" class="w-full sm:w-36">
        <Select
          :model-value="filters.schedulingTier"
          :options="[
            { value: null, label: t('admin.users.allSchedulingTiers') },
            { value: 0, label: t('admin.users.schedulingTiers.priority') },
            { value: 1, label: t('admin.users.schedulingTiers.normal') },
            { value: 2, label: t('admin.users.schedulingTiers.low') }
          ]"
          @update:model-value="emit('update-scheduling-tier', toSchedulingTier($event))"
          @change="emit('apply-filter')"
        />
      </div>

      <div v-if="visibleFilters.has('status')" class="w-full sm:w-32">
        <Select
          :model-value="filters.status"
          :options="[
            { value: '', label: t('admin.users.allStatus') },
            { value: 'active', label: t('common.active') },
            { value: 'disabled', label: t('admin.users.disabled') }
          ]"
          @update:model-value="emit('update-status', String($event ?? ''))"
          @change="emit('apply-filter')"
        />
      </div>

      <div v-if="visibleFilters.has('group')" class="w-full sm:w-44">
        <Select
          :model-value="filters.group"
          :options="groupFilterOptions"
          searchable
          creatable
          :creatable-prefix="t('admin.users.fuzzySearch')"
          :search-placeholder="t('admin.users.searchAuthorizedGroups')"
          @update:model-value="emit('update-group', String($event ?? ''))"
          @change="emit('apply-filter')"
        />
      </div>

      <div v-if="visibleFilters.has('apiKeyGroup')" class="w-full sm:w-44">
        <Select
          :model-value="filters.apiKeyGroup"
          :options="apiKeyGroupFilterOptions"
          searchable
          :search-placeholder="t('admin.users.searchApiKeyGroups')"
          @update:model-value="emit('update-api-key-group', toNullableNumber($event))"
          @change="emit('apply-filter')"
        />
      </div>

      <template v-for="(value, attrId) in activeAttributeFilters" :key="attrId">
        <div
          v-if="visibleFilters.has(`attr_${attrId}`)"
          class="relative w-full sm:w-36"
        >
          <input
            v-if="['text', 'textarea', 'email', 'url', 'date'].includes(getAttributeDefinition(Number(attrId))?.type || 'text')"
            :value="value"
            :placeholder="getAttributeDefinitionName(Number(attrId))"
            class="input w-full"
            @input="handleAttributeInput(Number(attrId), $event)"
            @keyup.enter="emit('apply-filter')"
          />
          <input
            v-else-if="getAttributeDefinition(Number(attrId))?.type === 'number'"
            :value="value"
            type="number"
            :placeholder="getAttributeDefinitionName(Number(attrId))"
            class="input w-full"
            @input="handleAttributeInput(Number(attrId), $event)"
            @keyup.enter="emit('apply-filter')"
          />
          <div
            v-else-if="['select', 'multi_select'].includes(getAttributeDefinition(Number(attrId))?.type || '')"
            class="w-full"
          >
            <Select
              :model-value="value"
              :options="[
                { value: '', label: getAttributeDefinitionName(Number(attrId)) },
                ...(getAttributeDefinition(Number(attrId))?.options || [])
              ]"
              @update:model-value="handleAttributeSelect(Number(attrId), $event)"
            />
          </div>
          <input
            v-else
            :value="value"
            :placeholder="getAttributeDefinitionName(Number(attrId))"
            class="input w-full"
            @input="handleAttributeInput(Number(attrId), $event)"
            @keyup.enter="emit('apply-filter')"
          />
        </div>
      </template>
    </div>

    <div class="flex flex-wrap items-center justify-end gap-2">
      <div class="flex items-center gap-2 md:contents">
        <button
          class="btn btn-secondary px-2 md:px-3"
          :disabled="loading"
          :title="t('common.refresh')"
          @click="emit('refresh')"
        >
          <Icon name="refresh" size="md" :class="loading ? 'animate-spin' : ''" />
        </button>

        <div ref="filterDropdownRef" class="relative">
          <button
            class="btn btn-secondary px-2 md:px-3"
            :title="t('admin.users.filterSettings')"
            @click="showFilterDropdown = !showFilterDropdown"
          >
            <Icon name="filter" size="sm" class="md:mr-1.5" />
            <span class="hidden md:inline">{{ t('admin.users.filterSettings') }}</span>
          </button>
          <div
            v-if="showFilterDropdown"
            class="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-dark-600 dark:bg-dark-800"
          >
            <button
              v-for="filter in builtInFilters"
              :key="filter.key"
              class="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700"
              @click="emit('toggle-built-in-filter', filter.key)"
            >
              <span>{{ filter.name }}</span>
              <Icon
                v-if="visibleFilters.has(filter.key)"
                name="check"
                size="sm"
                class="text-primary-500"
                :stroke-width="2"
              />
            </button>
            <div
              v-if="filterableAttributes.length > 0"
              class="my-1 border-t border-gray-100 dark:border-dark-700"
            ></div>
            <button
              v-for="attr in filterableAttributes"
              :key="attr.id"
              class="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700"
              @click="emit('toggle-attribute-filter', attr)"
            >
              <span>{{ attr.name }}</span>
              <Icon
                v-if="visibleFilters.has(`attr_${attr.id}`)"
                name="check"
                size="sm"
                class="text-primary-500"
                :stroke-width="2"
              />
            </button>
          </div>
        </div>

        <div ref="columnDropdownRef" class="relative">
          <button
            class="btn btn-secondary px-2 md:px-3"
            :title="t('admin.users.columnSettings')"
            @click="showColumnDropdown = !showColumnDropdown"
          >
            <svg class="h-4 w-4 md:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <span class="hidden md:inline">{{ t('admin.users.columnSettings') }}</span>
          </button>
          <div
            v-if="showColumnDropdown"
            class="absolute right-0 top-full z-50 mt-1 max-h-80 w-48 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-dark-600 dark:bg-dark-800"
          >
            <button
              v-for="col in toggleableColumns"
              :key="col.key"
              :disabled="isForcedVisibleColumn(col.key)"
              :class="[
                'flex w-full items-center justify-between px-4 py-2 text-left text-sm',
                isForcedVisibleColumn(col.key)
                  ? 'cursor-not-allowed text-gray-400 dark:text-gray-500'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700'
              ]"
              :title="isForcedVisibleColumn(col.key) ? t('admin.users.columnAlwaysVisible') : ''"
              @click="emit('toggle-column', col.key)"
            >
              <span>{{ col.label }}</span>
              <Icon
                v-if="isColumnVisible(col.key)"
                name="check"
                size="sm"
                :class="isForcedVisibleColumn(col.key) ? 'text-gray-400 dark:text-gray-500' : 'text-primary-500'"
                :stroke-width="2"
              />
            </button>
          </div>
        </div>

        <button
          class="btn btn-secondary px-2 md:px-3"
          :title="t('admin.users.attributes.configButton')"
          @click="emit('open-attributes')"
        >
          <Icon name="cog" size="sm" class="md:mr-1.5" />
          <span class="hidden md:inline">{{ t('admin.users.attributes.configButton') }}</span>
        </button>
      </div>

      <button
        v-if="selectedCount > 0"
        class="btn btn-secondary flex-1 md:flex-initial"
        data-test="bulk-edit-limits"
        @click="emit('open-bulk-edit')"
      >
        <Icon name="users" size="md" class="mr-2" />
        {{ t('admin.users.bulkLimits.action', { count: selectedCount }) }}
      </button>

      <button class="btn btn-primary flex-1 md:flex-initial" @click="emit('open-create')">
        <Icon name="plus" size="md" class="mr-2" />
        {{ t('admin.users.createUser') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Column } from '@/common/types/uiTypes'
import type { SelectOption } from '@/common/widgets/forms/Select.vue'
import Icon from '@/common/widgets/icons/Icon.vue'
import Select from '@/common/widgets/forms/Select.vue'
import type { UserAttributeDefinition } from '@/types/usage'

type SchedulingTier = 0 | 1 | 2

interface UsersTableFilters {
  role: string
  schedulingTier: SchedulingTier | null
  status: string
  group: string
  apiKeyGroup: number | null
}

interface Props {
  searchQuery: string
  loading: boolean
  selectedCount: number
  filters: UsersTableFilters
  visibleFilters: Set<string>
  activeAttributeFilters: Record<number, string>
  attributeDefinitions: UserAttributeDefinition[]
  groupFilterOptions: SelectOption[]
  apiKeyGroupFilterOptions: SelectOption[]
  toggleableColumns: Column[]
  hiddenColumns: Set<string>
  forcedVisibleColumns: Set<string>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update-search-query': [value: string]
  'update-role': [value: string]
  'update-scheduling-tier': [value: SchedulingTier | null]
  'update-status': [value: string]
  'update-group': [value: string]
  'update-api-key-group': [value: number | null]
  'update-attribute-filter': [attrId: number, value: string]
  'search': []
  'apply-filter': []
  'refresh': []
  'toggle-built-in-filter': [key: string]
  'toggle-attribute-filter': [attribute: UserAttributeDefinition]
  'toggle-column': [key: string]
  'open-attributes': []
  'open-bulk-edit': []
  'open-create': []
}>()

const { t } = useI18n()
const showFilterDropdown = ref(false)
const showColumnDropdown = ref(false)
const filterDropdownRef = ref<HTMLElement | null>(null)
const columnDropdownRef = ref<HTMLElement | null>(null)

const builtInFilters = computed(() => [
  { key: 'role', name: t('admin.users.columns.role') },
  { key: 'schedulingTier', name: t('admin.users.columns.schedulingTier') },
  { key: 'status', name: t('admin.users.columns.status') },
  { key: 'group', name: t('admin.users.authorizedGroupFilter') },
  { key: 'apiKeyGroup', name: t('admin.users.apiKeyGroupFilter') }
])

const filterableAttributes = computed(() =>
  props.attributeDefinitions.filter(definition => definition.enabled)
)

const getAttributeDefinition = (attrId: number) =>
  props.attributeDefinitions.find(definition => definition.id === attrId)

const getAttributeDefinitionName = (attrId: number) =>
  getAttributeDefinition(attrId)?.name || String(attrId)

const isForcedVisibleColumn = (key: string) => props.forcedVisibleColumns.has(key)
const isColumnVisible = (key: string) => !props.hiddenColumns.has(key)
const toNullableNumber = (value: string | number | boolean | null): number | null =>
  typeof value === 'number' ? value : null
const toSchedulingTier = (
  value: string | number | boolean | null
): SchedulingTier | null => {
  if (value === 0 || value === 1 || value === 2) return value
  return null
}

const handleSearchInput = (event: Event) => {
  emit('update-search-query', (event.target as HTMLInputElement).value)
  emit('search')
}

const handleAttributeInput = (attrId: number, event: Event) => {
  emit('update-attribute-filter', attrId, (event.target as HTMLInputElement).value)
}

const handleAttributeSelect = (
  attrId: number,
  value: string | number | boolean | null
) => {
  emit('update-attribute-filter', attrId, String(value ?? ''))
  emit('apply-filter')
}

const closeDropdownsOnOutsideClick = (target: HTMLElement) => {
  if (filterDropdownRef.value && !filterDropdownRef.value.contains(target)) {
    showFilterDropdown.value = false
  }
  if (columnDropdownRef.value && !columnDropdownRef.value.contains(target)) {
    showColumnDropdown.value = false
  }
}

defineExpose({ closeDropdownsOnOutsideClick })
</script>
