<template>
  <div class="space-y-4">
    <div
      v-for="message in orderedMessages"
      :key="message.id"
      class="flex"
      :class="message.sender_type === ownSender ? 'justify-end' : 'justify-start'"
    >
      <div class="max-w-[82%] sm:max-w-[70%]">
        <div
          class="mb-1 flex items-center gap-2 text-xs text-gray-500 dark:text-dark-400"
          :class="message.sender_type === ownSender ? 'justify-end' : 'justify-start'"
        >
          <span>{{ senderLabel(message.sender_type) }}</span>
          <span>·</span>
          <time :datetime="message.created_at">{{ formatTime(message.created_at) }}</time>
        </div>
        <div
          class="whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm"
          :class="message.sender_type === ownSender
            ? 'bg-primary-600 text-white dark:bg-primary-500'
            : 'border border-gray-200 bg-white text-gray-900 dark:border-dark-700 dark:bg-dark-800 dark:text-white'"
        >
          {{ message.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ChatMessage, ChatSenderType } from '@/features/support-chat/data/datasources/supportChatDatasource'

const props = defineProps<{
  messages: ChatMessage[]
  ownSender: ChatSenderType
}>()

const { t, locale } = useI18n()

const orderedMessages = computed(() => {
  return [...props.messages].sort((a, b) => {
    const at = Date.parse(a.created_at) || 0
    const bt = Date.parse(b.created_at) || 0
    if (at !== bt) return at - bt
    return a.id - b.id
  })
})

function senderLabel(sender: ChatSenderType): string {
  return sender === 'admin' ? t('supportChat.supportAgent') : t('supportChat.user')
}

function formatTime(value: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale.value, {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>
