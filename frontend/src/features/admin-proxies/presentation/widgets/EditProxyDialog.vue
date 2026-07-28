<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseDialog from '@/common/widgets/feedback/BaseDialog.vue'
import Select from '@/common/widgets/forms/Select.vue'
import Icon from '@/common/widgets/icons/Icon.vue'
import type { EditProxyDialogContext } from '../proxyPageContext'

const props = defineProps<{
  context: EditProxyDialogContext
}>()

const { t } = useI18n()
const {
  EXPIRY_PRESETS,
  addDaysToBase,
  backupProxyOptions,
  closeEditModal,
  editBaseDate,
  editExpiresDays,
  editForm,
  editPasswordDirty,
  editPasswordVisible,
  editStatusOptions,
  editingProxy,
  handleUpdateProxy,
  protocolSelectOptions,
  showEditModal,
  submitting
} = props.context
</script>

<template>
  <BaseDialog
    :show="showEditModal"
    :title="t('admin.proxies.editProxy')"
    width="normal"
    @close="closeEditModal"
  >
    <form
      v-if="editingProxy"
      id="edit-proxy-form"
      @submit.prevent="handleUpdateProxy"
      class="space-y-5"
    >
      <div>
        <label class="input-label">{{ t('admin.proxies.name') }}</label>
        <input v-model="editForm.name" type="text" required class="input" />
      </div>
      <div>
        <label class="input-label">{{ t('admin.proxies.protocol') }}</label>
        <Select v-model="editForm.protocol" :options="protocolSelectOptions" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="input-label">{{ t('admin.proxies.host') }}</label>
          <input v-model="editForm.host" type="text" required class="input" />
        </div>
        <div>
          <label class="input-label">{{ t('admin.proxies.port') }}</label>
          <input
            v-model.number="editForm.port"
            type="number"
            required
            min="1"
            max="65535"
            class="input"
          />
        </div>
      </div>
      <div>
        <label class="input-label">{{ t('admin.proxies.username') }}</label>
        <input v-model="editForm.username" type="text" class="input" />
      </div>
      <div>
        <label class="input-label">{{ t('admin.proxies.password') }}</label>
        <div class="relative">
          <input
            v-model="editForm.password"
            :type="editPasswordVisible ? 'text' : 'password'"
            :placeholder="t('admin.proxies.leaveEmptyToKeep')"
            class="input pr-10"
            @input="editPasswordDirty = true"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            @click="editPasswordVisible = !editPasswordVisible"
          >
            <Icon :name="editPasswordVisible ? 'eyeOff' : 'eye'" size="md" />
          </button>
        </div>
      </div>
      <div>
        <label class="input-label">{{ t('admin.proxies.status') }}</label>
        <Select v-model="editForm.status" :options="editStatusOptions" />
      </div>
      <div>
        <label class="input-label">{{ t('admin.proxies.expiresAt') }}</label>
        <div class="mb-2 flex flex-wrap gap-2">
          <button
            v-for="d in EXPIRY_PRESETS"
            :key="d"
            type="button"
            class="btn btn-sm"
            :class="editForm.expires_at === addDaysToBase(editBaseDate, d) ? 'btn-primary' : 'btn-secondary'"
            @click="editExpiresDays = d"
          >
            {{ t('admin.proxies.nDays', { days: d }) }}
          </button>
        </div>
        <input
          v-model.number="editExpiresDays"
          type="number"
          min="0"
          class="input mb-2"
          :placeholder="t('admin.proxies.expiryDaysPlaceholder')"
        />
        <input v-model="editForm.expires_at" type="date" class="input" />
      </div>
      <div>
        <label class="input-label">{{ t('admin.proxies.fallbackMode') }}</label>
        <Select v-model="editForm.fallback_mode" :options="[
          { label: t('admin.proxies.fallbackNone'), value: 'none' },
          { label: t('admin.proxies.fallbackProxy'), value: 'proxy' },
          { label: t('admin.proxies.fallbackDirect'), value: 'direct' },
        ]" />
      </div>
      <div v-if="editForm.fallback_mode === 'proxy'">
        <label class="input-label">{{ t('admin.proxies.backupProxy') }}</label>
        <Select v-model="editForm.backup_proxy_id" :options="backupProxyOptions(editingProxy?.id)" />
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button @click="closeEditModal" type="button" class="btn btn-secondary">
          {{ t('common.cancel') }}
        </button>
        <button
          v-if="editingProxy"
          type="submit"
          form="edit-proxy-form"
          :disabled="submitting"
          class="btn btn-primary"
        >
          <svg
            v-if="submitting"
            class="-ml-1 mr-2 h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ submitting ? t('admin.proxies.updating') : t('common.update') }}
        </button>
      </div>
    </template>
  </BaseDialog>
</template>
