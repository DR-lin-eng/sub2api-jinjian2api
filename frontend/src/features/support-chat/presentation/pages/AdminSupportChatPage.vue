<template>
  <AppLayout>
    <section class="grid h-[calc(100vh-8rem)] gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
      <AdminConversationList
        v-model:search="search"
        v-model:unread-only="unreadOnly"
        :conversations="conversations"
        :selected-id="selectedConversationID"
        :loading="conversationsLoading"
        :total="conversationTotal"
        @select="selectConversation"
        @refresh="loadConversations"
      />

      <div class="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-dark-700 dark:bg-dark-900">
        <header class="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-dark-700">
          <div class="min-w-0">
            <h1 class="truncate text-lg font-semibold text-gray-900 dark:text-white">
              {{ selectedConversation ? displayUser(selectedConversation) : t('supportChat.adminTitle') }}
            </h1>
            <p class="truncate text-sm text-gray-500 dark:text-dark-400">
              {{ selectedConversation ? selectedConversation.user_email || `#${selectedConversation.user_id}` : t('supportChat.adminDescription') }}
            </p>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium" :class="socketConnected ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' : 'bg-gray-100 text-gray-600 dark:bg-dark-800 dark:text-dark-300'">
              <span class="h-2 w-2 rounded-full" :class="socketConnected ? 'bg-emerald-500' : 'bg-gray-400'"></span>
              {{ socketConnected ? t('supportChat.connected') : t('supportChat.offline') }}
            </span>
            <button type="button" class="btn btn-secondary btn-sm" :disabled="messagesLoading || !selectedConversationID" @click="reloadSelectedMessages">
              {{ t('common.refresh') }}
            </button>
          </div>
        </header>

        <div ref="messagePaneRef" class="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-5 dark:bg-dark-950/60">
          <div v-if="!selectedConversationID" class="flex h-full flex-col items-center justify-center text-center text-gray-500 dark:text-dark-400">
            <div class="mb-3 rounded-2xl bg-primary-50 p-4 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
              <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12c0 4.556-4.03 8.25-9 8.25a9.77 9.77 0 01-2.555-.337A5.972 5.972 0 015.41 21a5.969 5.969 0 01-.474-.018 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.253 3 14.224 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <p class="text-sm font-medium text-gray-700 dark:text-dark-200">{{ t('supportChat.selectConversationTitle') }}</p>
            <p class="mt-1 text-sm">{{ t('supportChat.selectConversationDescription') }}</p>
          </div>
          <div v-else-if="messagesLoading && messages.length === 0" class="flex h-full items-center justify-center text-sm text-gray-500 dark:text-dark-400">
            {{ t('common.loading') }}
          </div>
          <div v-else-if="messages.length === 0" class="flex h-full items-center justify-center text-sm text-gray-500 dark:text-dark-400">
            {{ t('supportChat.noMessagesYet') }}
          </div>
          <SupportMessageList v-else :messages="messages" own-sender="admin" />
        </div>

        <SupportMessageComposer
          :sending="sending"
          :disabled="!selectedConversationID || messagesLoading"
          @submit="handleSend"
        />
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/common/widgets/layout/AppLayout.vue'
import { useAppStore } from '@/core/stores/appStore'
import {
  listAdminChatConversations,
  listAdminChatMessages,
  markAdminChatRead,
  sendAdminChatMessage,
  type ChatConversation,
  type ChatMessage,
} from '@/features/support-chat/data/datasources/supportChatDatasource'
import { useSupportChatSocket } from '@/features/support-chat/presentation/composables/useSupportChatSocket'
import AdminConversationList from '@/features/support-chat/presentation/widgets/AdminConversationList.vue'
import SupportMessageComposer from '@/features/support-chat/presentation/widgets/SupportMessageComposer.vue'
import SupportMessageList from '@/features/support-chat/presentation/widgets/SupportMessageList.vue'

const { t } = useI18n()
const appStore = useAppStore()
const conversations = ref<ChatConversation[]>([])
const conversationTotal = ref(0)
const conversationsLoading = ref(false)
const selectedConversationID = ref<number | null>(null)
const messages = ref<ChatMessage[]>([])
const messagesLoading = ref(false)
const sending = ref(false)
const search = ref('')
const unreadOnly = ref(false)
const socketConnected = ref(false)
const messagePaneRef = ref<HTMLElement | null>(null)
let searchTimer: ReturnType<typeof setTimeout> | null = null
let fallbackPollTimer: ReturnType<typeof setInterval> | null = null

const selectedConversation = computed(() => {
  if (!selectedConversationID.value) return null
  return conversations.value.find((item) => item.id === selectedConversationID.value) ?? null
})

const socket = useSupportChatSocket({
  scope: 'admin',
  onStatusChange: (connected) => {
    socketConnected.value = connected
  },
  onMessage: async (message) => {
    upsertConversationActivity(message)
    if (selectedConversationID.value === message.conversation_id) {
      appendMessage(message)
      await markSelectedRead()
      await scrollToBottom()
    }
  },
})

function appendMessage(message: ChatMessage) {
  if (messages.value.some((item) => item.id === message.id)) return
  messages.value.push(message)
}

function messageScrollSignature(): string {
  return messages.value.map((message) => `${message.id}:${message.created_at}`).join('|')
}

function displayUser(conversation: ChatConversation): string {
  return conversation.user_username || conversation.user_email || t('supportChat.unknownUser')
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) return message
  }
  return fallback
}

function upsertConversationActivity(message: ChatMessage) {
  const existing = conversations.value.find((item) => item.id === message.conversation_id)
  if (!existing) {
    void loadConversations()
    return
  }
  existing.last_message_at = message.created_at
  if (message.sender_type === 'user' && selectedConversationID.value !== existing.id) {
    existing.unread_by_admin += 1
  }
  conversations.value = [...conversations.value].sort((a, b) => {
    const at = Date.parse(a.last_message_at || a.updated_at) || 0
    const bt = Date.parse(b.last_message_at || b.updated_at) || 0
    if (at !== bt) return bt - at
    return b.id - a.id
  })
}

async function scrollToBottom() {
  await nextTick()
  const pane = messagePaneRef.value
  if (pane) pane.scrollTop = pane.scrollHeight
}

async function loadConversations() {
  if (conversationsLoading.value) return
  conversationsLoading.value = true
  try {
    const page = await listAdminChatConversations({
      page: 1,
      page_size: 100,
      unread_only: unreadOnly.value,
      search: search.value.trim() || undefined,
    })
    conversations.value = page.items
    conversationTotal.value = page.total
    if (selectedConversationID.value && !conversations.value.some((item) => item.id === selectedConversationID.value)) {
      selectedConversationID.value = null
      messages.value = []
    }
  } catch (error) {
    appStore.showError(errorMessage(error, t('supportChat.loadFailed')))
  } finally {
    conversationsLoading.value = false
  }
}

async function selectConversation(conversationID: number) {
  if (selectedConversationID.value === conversationID) return
  selectedConversationID.value = conversationID
  messages.value = []
  await reloadSelectedMessages()
}

async function reloadSelectedMessages() {
  if (!selectedConversationID.value || messagesLoading.value) return
  messagesLoading.value = true
  try {
    const page = await listAdminChatMessages(selectedConversationID.value, { page: 1, page_size: 100 })
    messages.value = page.items
    await markSelectedRead()
    await scrollToBottom()
  } catch (error) {
    appStore.showError(errorMessage(error, t('supportChat.loadFailed')))
  } finally {
    messagesLoading.value = false
  }
}

async function markSelectedRead() {
  if (!selectedConversationID.value) return
  await markAdminChatRead(selectedConversationID.value)
  const existing = conversations.value.find((item) => item.id === selectedConversationID.value)
  if (existing) existing.unread_by_admin = 0
}

async function handleSend(content: string) {
  if (!selectedConversationID.value) return
  sending.value = true
  try {
    const message = await sendAdminChatMessage(selectedConversationID.value, content)
    appendMessage(message)
    upsertConversationActivity(message)
    await scrollToBottom()
  } catch (error) {
    appStore.showError(errorMessage(error, t('supportChat.sendFailed')))
  } finally {
    sending.value = false
  }
}

async function pollWhenOffline() {
  if (socketConnected.value || sending.value) return
  await loadConversations()
  if (selectedConversationID.value) {
    await reloadSelectedMessages()
  }
}

watch([search, unreadOnly], () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    void loadConversations()
  }, 250)
})

watch(messageScrollSignature, () => {
  void scrollToBottom()
}, { flush: 'post' })

onMounted(async () => {
  await loadConversations()
  socket.connect()
  fallbackPollTimer = setInterval(() => {
    void pollWhenOffline()
  }, 5000)
})

onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer)
    searchTimer = null
  }
  if (fallbackPollTimer) {
    clearInterval(fallbackPollTimer)
    fallbackPollTimer = null
  }
})
</script>

