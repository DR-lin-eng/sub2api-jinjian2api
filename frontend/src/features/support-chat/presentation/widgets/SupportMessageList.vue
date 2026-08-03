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
          class="rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm"
          :class="message.sender_type === ownSender
            ? 'bg-primary-600 text-white dark:bg-primary-500'
            : 'border border-gray-200 bg-white text-gray-900 dark:border-dark-700 dark:bg-dark-800 dark:text-white'"
        >
          <div class="support-chat-message-content" v-html="renderMessageContent(message.content)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ChatMessage, ChatSenderType } from '@/features/support-chat/data/datasources/supportChatDatasource'
import { sanitizeChatHtml } from '@/features/support-chat/presentation/utils/sanitizeChatHtml'

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

function renderMessageContent(content: string): string {
  return sanitizeChatHtml(content)
}
</script>

<style scoped>
.support-chat-message-content {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.support-chat-message-content :deep(a) {
  text-decoration: underline;
}

.support-chat-message-content :deep(p),
.support-chat-message-content :deep(div) {
  margin: 0.25rem 0;
}

.support-chat-message-content :deep(p:first-child),
.support-chat-message-content :deep(div:first-child),
.support-chat-message-content :deep(ul:first-child),
.support-chat-message-content :deep(ol:first-child),
.support-chat-message-content :deep(pre:first-child) {
  margin-top: 0;
}

.support-chat-message-content :deep(p:last-child),
.support-chat-message-content :deep(div:last-child),
.support-chat-message-content :deep(ul:last-child),
.support-chat-message-content :deep(ol:last-child),
.support-chat-message-content :deep(pre:last-child) {
  margin-bottom: 0;
}

.support-chat-message-content :deep(ul),
.support-chat-message-content :deep(ol) {
  margin: 0.35rem 0;
  padding-left: 1.25rem;
}

.support-chat-message-content :deep(ul) {
  list-style: disc;
}

.support-chat-message-content :deep(ol) {
  list-style: decimal;
}

.support-chat-message-content :deep(pre) {
  max-width: 100%;
  overflow-x: auto;
  border-radius: 0.75rem;
  margin: 0.5rem 0;
  padding: 0.75rem;
  background: rgb(17 24 39 / 0.12);
  white-space: pre;
}

.support-chat-message-content :deep(code) {
  border-radius: 0.375rem;
  padding: 0.1rem 0.25rem;
  background: rgb(17 24 39 / 0.12);
}
</style>
