<template>
  <div data-testid="affiliate-invitation-field">
    <label for="affiliate_code" class="input-label">
      {{ t('auth.invitationCodeLabel') }}
      <span class="ml-1 text-xs font-normal text-gray-400 dark:text-dark-500">
        ({{ t('common.optional') }})
      </span>
    </label>
    <div class="relative">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <Icon name="key" size="md" class="text-gray-400 dark:text-dark-500" />
      </div>
      <input
        id="affiliate_code"
        :value="modelValue"
        type="text"
        :disabled="disabled"
        class="input pl-11"
        :placeholder="t('auth.invitationCodePlaceholder')"
        @input="emitValue"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Icon from '@/components/icons/Icon.vue'

defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const { t } = useI18n()

function emitValue(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>
