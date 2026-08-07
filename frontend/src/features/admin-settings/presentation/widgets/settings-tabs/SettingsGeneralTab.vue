<template>
  <div class="space-y-6">
    <section class="card">
      <header class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('admin.settings.site.title') }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t('admin.settings.site.description') }}
        </p>
      </header>

      <div class="space-y-6 p-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('admin.settings.site.siteName') }}
            </label>
            <input
              v-model="form.site_name"
              type="text"
              class="input"
              :placeholder="t('admin.settings.site.siteNamePlaceholder')"
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.site.siteNameHint') }}
            </p>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('admin.settings.site.apiBaseUrl') }}
            </label>
            <input
              v-model="form.api_base_url"
              type="url"
              class="input font-mono text-sm"
              :placeholder="t('admin.settings.site.apiBaseUrlPlaceholder')"
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.site.apiBaseUrlHint') }}
            </p>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('admin.settings.site.docUrl') }}
          </label>
          <input
            v-model="form.doc_url"
            type="url"
            class="input font-mono text-sm"
            :placeholder="t('admin.settings.site.docUrlPlaceholder')"
          />
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {{ t('admin.settings.site.docUrlHint') }}
          </p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('admin.settings.site.siteLogo') }}
          </label>
          <ImageUpload
            v-model="form.site_logo"
            mode="image"
            :upload-label="t('admin.settings.site.uploadImage')"
            :remove-label="t('admin.settings.site.remove')"
            :hint="t('admin.settings.site.logoHint')"
            :max-size="300 * 1024"
          />
        </div>

        <div class="border-t border-gray-100 pt-5 dark:border-dark-700">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">
            {{ t('admin.settings.site.tablePreferencesTitle') }}
          </h3>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ t('admin.settings.site.tablePreferencesDescription') }}
          </p>
          <div class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('admin.settings.site.tableDefaultPageSize') }}
              </label>
              <input
                v-model.number="form.table_default_page_size"
                type="number"
                min="5"
                max="1000"
                step="1"
                class="input w-40"
              />
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ t('admin.settings.site.tableDefaultPageSizeHint') }}
              </p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('admin.settings.site.tablePageSizeOptions') }}
              </label>
              <input
                v-model="tablePageSizeOptionsInput"
                type="text"
                class="input font-mono text-sm"
                :placeholder="t('admin.settings.site.tablePageSizeOptionsPlaceholder')"
              />
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ t('admin.settings.site.tablePageSizeOptionsHint') }}
              </p>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-5 dark:border-dark-700">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ t('admin.settings.site.customEndpoints.title') }}
              </h3>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ t('admin.settings.site.customEndpoints.description') }}
              </p>
            </div>
            <button type="button" class="btn btn-secondary" @click="addEndpoint">
              <Icon name="plus" size="sm" />
              {{ t('admin.settings.site.customEndpoints.add') }}
            </button>
          </div>

          <div v-if="form.custom_endpoints.length" class="mt-4 divide-y divide-gray-100 border-y border-gray-100 dark:divide-dark-700 dark:border-dark-700">
            <div
              v-for="(endpoint, index) in form.custom_endpoints"
              :key="index"
              class="grid grid-cols-1 gap-3 py-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)_minmax(0,1fr)_2.5rem] md:items-end"
            >
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  {{ t('admin.settings.site.customEndpoints.name') }}
                </label>
                <input
                  v-model="endpoint.name"
                  type="text"
                  class="input text-sm"
                  :placeholder="t('admin.settings.site.customEndpoints.namePlaceholder')"
                />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  {{ t('admin.settings.site.customEndpoints.endpointUrl') }}
                </label>
                <input
                  v-model="endpoint.endpoint"
                  type="url"
                  class="input font-mono text-sm"
                  :placeholder="t('admin.settings.site.customEndpoints.endpointUrlPlaceholder')"
                />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  {{ t('admin.settings.site.customEndpoints.descriptionLabel') }}
                </label>
                <input
                  v-model="endpoint.description"
                  type="text"
                  class="input text-sm"
                  :placeholder="t('admin.settings.site.customEndpoints.descriptionPlaceholder')"
                />
              </div>
              <button
                type="button"
                class="btn-ghost btn-icon text-red-500 hover:text-red-600"
                :title="t('admin.settings.site.remove')"
                @click="removeEndpoint(index)"
              >
                <Icon name="trash" size="sm" />
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between border-t border-gray-100 pt-5 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">
              {{ t('admin.settings.site.hideCcsImportButton') }}
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.site.hideCcsImportButtonHint') }}
            </p>
          </div>
          <Toggle v-model="form.hide_ccs_import_button" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/common/widgets/icons/Icon.vue'
import ImageUpload from '@/common/widgets/data/ImageUpload.vue'
import Toggle from '@/common/widgets/forms/Toggle.vue'
import { useSettingsPageContext } from '@/features/admin-settings/presentation/composables/settingsPageContext'

const { addEndpoint, form, removeEndpoint, t, tablePageSizeOptionsInput } = useSettingsPageContext()
</script>
