<template>
  <form class="border-t border-gray-200 bg-white p-4 dark:border-dark-700 dark:bg-dark-900" @submit.prevent="submit">
    <label class="sr-only" for="support-chat-content">{{ t('supportChat.inputLabel') }}</label>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
      <textarea
        id="support-chat-content"
        v-model="draft"
        class="min-h-[84px] flex-1 resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-dark-700 dark:bg-dark-800 dark:text-white dark:placeholder:text-dark-400"
        :maxlength="maxLength"
        :placeholder="t('supportChat.inputPlaceholder')"
        :disabled="disabled || sending"
        @keydown.enter.exact.prevent="submit"
      />
      <button
        type="submit"
        class="btn btn-primary min-w-28"
        :disabled="disabled || sending || !draft.trim()"
      >
        {{ sending ? t('common.submitting') : t('supportChat.send') }}
      </button>
    </div>
    <div class="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-dark-400">
      <span>{{ t('supportChat.enterHint') }}</span>
      <span>{{ draft.length }}/{{ maxLength }}</span>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<{
  sending?: boolean
  disabled?: boolean
  maxLength?: number
}>(), {
  sending: false,
  disabled: false,
  maxLength: 10000,
})

const emit = defineEmits<{
  submit: [content: string]
}>()

const { t } = useI18n()
const draft = ref('')

function submit() {
  if (props.disabled || props.sending) return
  const content = draft.value.trim()
  if (!content) return
  emit('submit', content)
  draft.value = ''
}
</script>
