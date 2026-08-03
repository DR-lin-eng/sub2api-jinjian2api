<template>
  <form class="border-t border-gray-200 bg-white p-4 dark:border-dark-700 dark:bg-dark-900" @submit.prevent="submit">
    <transition name="support-panel">
      <div
        v-if="activePanel"
        class="mb-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-dark-700 dark:bg-dark-950/60"
        @click="closeQuickReplyMenu"
      >
        <div v-if="activePanel === 'tools'" class="flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="tool in toolActions"
            :key="tool.id"
            type="button"
            class="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-dark-700 dark:bg-dark-800 dark:text-dark-200 dark:hover:border-primary-700 dark:hover:bg-primary-900/20 dark:hover:text-primary-200"
            @click="insertSnippet(tool.template)"
          >
            <span class="text-base">{{ tool.icon }}</span>
            <span>{{ tool.label }}</span>
          </button>
        </div>

        <div v-else class="space-y-3">
          <div class="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              class="inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
              :class="oneClickReplyEnabled ? 'border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-700 dark:bg-primary-900/20 dark:text-primary-200' : 'border-gray-200 bg-white text-gray-700 dark:border-dark-700 dark:bg-dark-800 dark:text-dark-200'"
              @click.stop="toggleOneClickReply"
            >
              <span class="inline-flex h-5 w-9 items-center rounded-full transition-colors" :class="oneClickReplyEnabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'">
                <span class="ml-0.5 h-4 w-4 rounded-full bg-white transition-transform" :class="oneClickReplyEnabled ? 'translate-x-4' : 'translate-x-0'"></span>
              </span>
              <span>{{ t('supportChat.composer.oneClickReply') }}</span>
            </button>

            <div class="flex gap-2 overflow-x-auto pb-1">
              <div
                v-for="reply in allQuickReplies"
                :key="reply.id"
                class="quick-reply-chip group relative inline-flex shrink-0"
                @contextmenu.prevent.stop="reply.custom && openQuickReplyMenu(reply.id, $event)"
                @pointerdown="startLongPress(reply, $event)"
                @pointerup="cancelLongPress"
                @pointerleave="cancelLongPress"
                @pointercancel="cancelLongPress"
              >
                <button
                  type="button"
                  class="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-dark-700 dark:bg-dark-800 dark:text-dark-200 dark:hover:border-primary-700 dark:hover:bg-primary-900/20 dark:hover:text-primary-200"
                  :title="reply.custom ? t('supportChat.composer.customReplyHint') : undefined"
                  @click.stop="handleQuickReply(reply)"
                  @keydown.f2.prevent.stop="reply.custom && startEditReply(reply)"
                  @keydown.shift.f10.prevent.stop="reply.custom && openQuickReplyMenu(reply.id, $event)"
                >
                  <span class="max-w-40 truncate">{{ reply.title }}</span>
                </button>
              </div>
              <button
                type="button"
                class="inline-flex shrink-0 items-center gap-2 rounded-xl border border-dashed border-primary-300 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-700 dark:bg-primary-900/20 dark:text-primary-200"
                @click.stop="openCustomReplyEditor()"
              >
                <PlusMiniIcon />
                <span>{{ t('supportChat.composer.addCustomReply') }}</span>
              </button>
            </div>
          </div>
          <p v-if="customReplies.length" class="px-1 text-xs text-gray-500 dark:text-dark-400">
            {{ t('supportChat.composer.customReplyHint') }}
          </p>

          <div
            v-if="showReplyEditor"
            class="grid gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-dark-700 dark:bg-dark-800 lg:grid-cols-[220px_minmax(0,1fr)]"
            @click.stop
          >
            <input
              v-model="customReplyTitle"
              type="text"
              class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-dark-700 dark:bg-dark-900 dark:text-white"
              :placeholder="t('supportChat.composer.customReplyTitle')"
            />
            <textarea
              v-model="customReplyContent"
              class="min-h-[88px] resize-y rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-dark-700 dark:bg-dark-900 dark:text-white"
              :placeholder="t('supportChat.composer.customReplyHtml')"
            />
            <div class="lg:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0 flex-1 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-dark-900 dark:text-dark-200">
                <div class="mb-1 text-xs font-medium text-gray-500 dark:text-dark-400">
                  {{ t('supportChat.composer.htmlPreview') }}
                </div>
                <div class="support-chat-preview prose prose-sm max-w-none dark:prose-invert" v-html="customReplyPreview"></div>
              </div>
              <div class="flex shrink-0 gap-2">
                <button type="button" class="btn btn-secondary" @click="cancelReplyEdit">
                  {{ t('common.cancel') }}
                </button>
                <button type="button" class="btn btn-primary" :disabled="!canSaveCustomReply" @click="saveCustomReply">
                  {{ editingReplyId ? t('supportChat.composer.updateCustomReply') : t('supportChat.composer.saveCustomReply') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <label class="sr-only" for="support-chat-content">{{ t('supportChat.inputLabel') }}</label>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <textarea
        id="support-chat-content"
        v-model="draft"
        class="min-h-[108px] flex-1 resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-dark-700 dark:bg-dark-800 dark:text-white dark:placeholder:text-dark-400"
        :maxlength="maxLength"
        :placeholder="t('supportChat.inputPlaceholder')"
        :disabled="disabled || sending"
        @keydown.enter.exact.prevent="submit"
      />

      <div class="flex shrink-0 flex-row gap-2 sm:w-28 sm:flex-col">
        <div v-if="showAssistantTools" class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="composer-icon-button"
            :class="activePanel === 'tools' ? 'composer-icon-button-active' : ''"
            :title="t('supportChat.composer.moreActions')"
            @click="togglePanel('tools')"
          >
            <PlusIcon />
          </button>
          <button
            type="button"
            class="composer-icon-button"
            :class="activePanel === 'replies' ? 'composer-icon-button-active' : ''"
            :title="t('supportChat.composer.quickReplies')"
            @click="togglePanel('replies')"
          >
            <MessageIcon />
          </button>
        </div>
        <button
          type="submit"
          class="btn btn-primary flex-1 sm:min-h-[68px]"
          :class="{ 'sm:min-h-[108px]': !showAssistantTools }"
          :disabled="disabled || sending || !draft.trim()"
        >
          {{ sending ? t('common.submitting') : t('supportChat.send') }}
        </button>
      </div>
    </div>
    <div class="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-dark-400">
      <span>{{ t('supportChat.enterHint') }}</span>
      <span>{{ draft.length }}/{{ maxLength }}</span>
    </div>

    <Teleport to="body">
      <div
        v-if="quickReplyMenuReply"
        class="fixed z-[9999] w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-sm shadow-xl dark:border-dark-700 dark:bg-dark-800"
        :style="quickReplyMenuStyle"
        @click.stop
      >
        <div class="border-b border-gray-100 px-3 py-2 text-xs font-medium text-gray-500 dark:border-dark-700 dark:text-dark-400">
          <span class="block truncate">{{ quickReplyMenuReply.title }}</span>
        </div>
        <button type="button" class="quick-reply-menu-item" @click="startEditReply(quickReplyMenuReply)">
          <EditIcon />
          <span>{{ t('supportChat.composer.editReply') }}</span>
        </button>
        <button type="button" class="quick-reply-menu-item text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20" @click="deleteCustomReply(quickReplyMenuReply.id)">
          <TrashIcon />
          <span>{{ t('supportChat.composer.deleteReply') }}</span>
        </button>
      </div>
    </Teleport>
  </form>
</template>

<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { sanitizeChatHtml } from '@/features/support-chat/presentation/utils/sanitizeChatHtml'

interface QuickReply {
  id: string
  title: string
  content: string
  custom?: boolean
}

interface ToolAction {
  id: string
  label: string
  icon: string
  template: string
}

const props = withDefaults(defineProps<{
  sending?: boolean
  disabled?: boolean
  maxLength?: number
  showAssistantTools?: boolean
}>(), {
  sending: false,
  disabled: false,
  maxLength: 10000,
  showAssistantTools: false,
})

const emit = defineEmits<{
  submit: [content: string]
}>()

const { t } = useI18n()
const draft = ref('')
const activePanel = ref<'tools' | 'replies' | null>(null)
const oneClickReplyEnabled = ref(false)
const showReplyEditor = ref(false)
const editingReplyId = ref<string | null>(null)
const customReplyTitle = ref('')
const customReplyContent = ref('')
const customReplies = ref<QuickReply[]>([])
const openReplyMenuId = ref<string | null>(null)
const quickReplyMenuStyle = ref<Record<string, string>>({})
const customReplyStorageKey = 'support_chat_custom_replies_v1'
const oneClickReplyStorageKey = 'support_chat_one_click_reply_v1'
let longPressTimer: ReturnType<typeof setTimeout> | null = null
let suppressedReplyId: string | null = null

const PlusIcon = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.8' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 5v14m7-7H5' }),
  ]),
}

const PlusMiniIcon = {
  render: () => h('svg', { class: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.8' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 5v14m7-7H5' }),
  ]),
}

const MessageIcon = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.8' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' }),
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M21 12c0 4.556-4.03 8.25-9 8.25a9.77 9.77 0 01-2.555-.337A5.972 5.972 0 015.41 21a4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.253 3 14.224 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z' }),
  ]),
}

const EditIcon = {
  render: () => h('svg', { class: 'h-3.5 w-3.5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.8' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16.862 4.487l1.65-1.65a1.875 1.875 0 112.652 2.652L7.5 19.153l-4 1 1-4L16.862 4.487z' }),
  ]),
}

const TrashIcon = {
  render: () => h('svg', { class: 'h-3.5 w-3.5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.8' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.684.107 1.026.163m-1.026-.163L18.16 19.673a2.25 2.25 0 01-2.245 2.077H8.085a2.25 2.25 0 01-2.245-2.077L4.772 5.79m14.5 0a48.108 48.108 0 00-3.478-.397m-10.85.563c.34-.053.683-.11 1.026-.166m0 0a48.11 48.11 0 013.478-.397m7.372 0v-.526A2.25 2.25 0 0012 2.25h-3.75A2.25 2.25 0 006 4.5v.526m7.372 0a48.11 48.11 0 00-7.372 0' }),
  ]),
}

const toolActions = computed<ToolAction[]>(() => [
  { id: 'order-info', label: t('supportChat.composer.toolOrderInfo'), icon: '🧾', template: t('supportChat.composer.toolOrderInfoTemplate') },
  { id: 'api-key', label: t('supportChat.composer.toolApiKey'), icon: '🔑', template: t('supportChat.composer.toolApiKeyTemplate') },
  { id: 'usage-check', label: t('supportChat.composer.toolUsageCheck'), icon: '📊', template: t('supportChat.composer.toolUsageCheckTemplate') },
])

const builtinReplies = computed<QuickReply[]>(() => [
  { id: 'hello', title: t('supportChat.composer.replyHello'), content: t('supportChat.composer.replyHelloContent') },
  { id: 'need-more-info', title: t('supportChat.composer.replyNeedMoreInfo'), content: t('supportChat.composer.replyNeedMoreInfoContent') },
  { id: 'resolved', title: t('supportChat.composer.replyResolved'), content: t('supportChat.composer.replyResolvedContent') },
])

const allQuickReplies = computed(() => [...builtinReplies.value, ...customReplies.value])
const quickReplyMenuReply = computed(() => customReplies.value.find((reply) => reply.id === openReplyMenuId.value) ?? null)
const customReplyPreview = computed(() => sanitizeHtml(customReplyContent.value || t('supportChat.composer.emptyPreview')))
const canSaveCustomReply = computed(() => customReplyTitle.value.trim() !== '' && customReplyContent.value.trim() !== '')

function sanitizeHtml(content: string): string {
  return sanitizeChatHtml(content)
}

function togglePanel(panel: 'tools' | 'replies') {
  if (!props.showAssistantTools) return
  activePanel.value = activePanel.value === panel ? null : panel
  closeQuickReplyMenu()
  if (activePanel.value !== 'replies') {
    showReplyEditor.value = false
    editingReplyId.value = null
  }
}

function toggleOneClickReply() {
  if (!props.showAssistantTools) return
  oneClickReplyEnabled.value = !oneClickReplyEnabled.value
}

function insertSnippet(content: string) {
  const snippet = content.trim()
  if (!snippet) return
  draft.value = draft.value.trim() ? `${draft.value.trim()}\n${snippet}` : snippet
}

function replaceDraft(content: string) {
  draft.value = content.trim()
}

function sendContent(content: string) {
  const trimmed = content.trim()
  if (!trimmed || props.disabled || props.sending) return
  emit('submit', trimmed)
  activePanel.value = null
}

function handleQuickReply(reply: QuickReply) {
  if (suppressedReplyId === reply.id) {
    suppressedReplyId = null
    return
  }
  closeQuickReplyMenu()
  if (oneClickReplyEnabled.value) {
    sendContent(reply.content)
    return
  }
  replaceDraft(reply.content)
}

function openQuickReplyMenu(id: string, event?: MouseEvent | PointerEvent | KeyboardEvent) {
  cancelLongPress()
  quickReplyMenuStyle.value = getQuickReplyMenuStyle(event)
  openReplyMenuId.value = id
}

function closeQuickReplyMenu() {
  openReplyMenuId.value = null
}

function getQuickReplyMenuStyle(event?: MouseEvent | PointerEvent | KeyboardEvent): Record<string, string> {
  const menuWidth = 176
  const menuHeight = 132
  const viewportPadding = 8
  const gap = 8
  let left = viewportPadding
  let top = viewportPadding

  if (event && 'clientX' in event && event.clientX > 0 && event.clientY > 0 && event.type === 'contextmenu') {
    left = event.clientX
    top = event.clientY
  } else {
    const target = event?.currentTarget
    const anchor = target instanceof Element ? target.getBoundingClientRect() : null
    if (anchor) {
      left = anchor.left + anchor.width - menuWidth
      top = anchor.top - menuHeight - gap
      if (top < viewportPadding) top = anchor.bottom + gap
    }
  }

  left = Math.min(Math.max(left, viewportPadding), window.innerWidth - menuWidth - viewportPadding)
  top = Math.min(Math.max(top, viewportPadding), window.innerHeight - menuHeight - viewportPadding)

  return {
    left: `${left}px`,
    top: `${top}px`,
  }
}

function startLongPress(reply: QuickReply, event: PointerEvent) {
  cancelLongPress()
  if (!reply.custom || event.button !== 0) return
  const nextMenuStyle = getQuickReplyMenuStyle(event)
  longPressTimer = setTimeout(() => {
    suppressedReplyId = reply.id
    quickReplyMenuStyle.value = nextMenuStyle
    openReplyMenuId.value = reply.id
  }, 450)
}

function cancelLongPress() {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

function openCustomReplyEditor() {
  closeQuickReplyMenu()
  editingReplyId.value = null
  customReplyTitle.value = ''
  customReplyContent.value = ''
  showReplyEditor.value = true
  activePanel.value = 'replies'
}

function startEditReply(reply: QuickReply) {
  closeQuickReplyMenu()
  editingReplyId.value = reply.id
  customReplyTitle.value = reply.title
  customReplyContent.value = reply.content
  showReplyEditor.value = true
  activePanel.value = 'replies'
}

function cancelReplyEdit() {
  showReplyEditor.value = false
  editingReplyId.value = null
  customReplyTitle.value = ''
  customReplyContent.value = ''
}

function saveCustomReply() {
  if (!canSaveCustomReply.value) return
  const nextReply = { id: editingReplyId.value || `custom-${Date.now()}`, title: customReplyTitle.value.trim(), content: customReplyContent.value.trim(), custom: true }
  const existingIndex = customReplies.value.findIndex((reply) => reply.id === nextReply.id)
  if (existingIndex >= 0) customReplies.value.splice(existingIndex, 1, nextReply)
  else customReplies.value.push(nextReply)
  cancelReplyEdit()
}

function deleteCustomReply(id: string) {
  closeQuickReplyMenu()
  customReplies.value = customReplies.value.filter((reply) => reply.id !== id)
  if (editingReplyId.value === id) cancelReplyEdit()
}

function loadCustomReplies() {
  try {
    const raw = localStorage.getItem(customReplyStorageKey)
    if (raw) {
      const parsed = JSON.parse(raw) as QuickReply[]
      if (Array.isArray(parsed)) {
        customReplies.value = parsed.filter((item) => item && typeof item.title === 'string' && typeof item.content === 'string').slice(0, 20)
      }
    }
    const quickReplyMode = localStorage.getItem(oneClickReplyStorageKey)
    if (quickReplyMode !== null) oneClickReplyEnabled.value = quickReplyMode === 'true'
  } catch {
    customReplies.value = []
  }
}

function persistCustomReplies() {
  localStorage.setItem(customReplyStorageKey, JSON.stringify(customReplies.value))
}

function persistOneClickReply() {
  localStorage.setItem(oneClickReplyStorageKey, String(oneClickReplyEnabled.value))
}

function submit() {
  if (props.disabled || props.sending) return
  const content = draft.value.trim()
  if (!content) return
  emit('submit', content)
  draft.value = ''
}

function handleOutsideQuickReplyMenuClick() {
  closeQuickReplyMenu()
}

watch(customReplies, persistCustomReplies, { deep: true })
watch(oneClickReplyEnabled, persistOneClickReply)

onMounted(() => {
  loadCustomReplies()
  document.addEventListener('click', handleOutsideQuickReplyMenuClick)
  window.addEventListener('resize', closeQuickReplyMenu)
  window.addEventListener('scroll', closeQuickReplyMenu, true)
})

onBeforeUnmount(() => {
  cancelLongPress()
  document.removeEventListener('click', handleOutsideQuickReplyMenuClick)
  window.removeEventListener('resize', closeQuickReplyMenu)
  window.removeEventListener('scroll', closeQuickReplyMenu, true)
})
</script>

<style scoped>
.composer-icon-button {
  @apply flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-dark-700 dark:bg-dark-800 dark:text-dark-300 dark:hover:border-primary-700 dark:hover:bg-primary-900/20 dark:hover:text-primary-200;
}

.composer-icon-button :deep(svg) {
  @apply h-5 w-5;
}

.composer-icon-button-active {
  @apply border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-200;
}

.quick-reply-menu-item {
  @apply flex w-full items-center gap-2 px-3 py-2 text-left text-gray-700 transition-colors hover:bg-gray-50 dark:text-dark-100 dark:hover:bg-dark-700;
}

.support-panel-enter-active,
.support-panel-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.support-panel-enter-from,
.support-panel-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
