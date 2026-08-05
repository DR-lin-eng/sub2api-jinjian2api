<template>
  <div v-if="sceneId && prefix" class="aliyun-captcha-wrapper">
    <button
      :id="buttonId"
      ref="buttonRef"
      type="button"
      class="aliyun-captcha-button"
      :class="{ 'aliyun-captcha-button--verified': state === 'verified' }"
      :disabled="state === 'loading' || state === 'verified'"
      @click="beginVerification"
    >
      <Icon
        :name="state === 'verified' ? 'checkCircle' : state === 'loading' ? 'refresh' : 'shield'"
        size="sm"
        :class="{ 'animate-spin': state === 'loading' }"
      />
      <span>{{ buttonText }}</span>
    </button>
    <div :id="elementId"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/common/widgets/icons/Icon.vue'
import {
  loadAliyunCaptcha,
  type AliyunCaptchaInitOptions,
  type AliyunCaptchaRegion
} from '@/core/services/humanVerification'

const props = withDefaults(defineProps<{
  sceneId: string
  prefix: string
  region?: AliyunCaptchaRegion
}>(), {
  region: 'cn'
})

const emit = defineEmits<{
  verify: [token: string]
  expire: []
  error: []
}>()

const { t, locale } = useI18n()
const uid = Math.random().toString(36).slice(2, 10)
const buttonId = `aliyun-captcha-button-${uid}`
const elementId = `aliyun-captcha-element-${uid}`
const popupId = 'aliyunCaptcha-window-popup'
const maskId = 'aliyunCaptcha-mask'
const openTimeoutMs = 10_000
const initTimeoutMs = 15_000

const buttonRef = ref<HTMLButtonElement | null>(null)
const state = ref<'loading' | 'idle' | 'verifying' | 'verified'>('idle')
const buttonText = computed(() => {
  if (state.value === 'loading') return t('auth.captchaLoading')
  if (state.value === 'verified') return t('auth.captchaVerified')
  if (state.value === 'verifying') return t('auth.captchaVerifying')
  return t('auth.captchaClickToVerify')
})

let cachedToken = ''
let readyPromise: Promise<void> | null = null
let verificationPromise: Promise<string | null> | null = null
let pendingVerification: {
  resolve: (value: string | null) => void
  reject: (reason?: unknown) => void
} | null = null
let popupObserver: MutationObserver | null = null
let popupSeen = false
let popupTimeout: ReturnType<typeof setTimeout> | null = null
let mounted = false
let ready = false

function isPopupVisible(): boolean {
  const popup = document.getElementById(popupId)
  if (!popup || !popup.isConnected) return false
  const style = window.getComputedStyle(popup)
  return style.display !== 'none' && style.visibility !== 'hidden'
}

function stopPopupObservation(): void {
  popupObserver?.disconnect()
  popupObserver = null
  popupSeen = false
  if (popupTimeout) {
    clearTimeout(popupTimeout)
    popupTimeout = null
  }
}

function finishVerification(value: string | null, error?: unknown): void {
  stopPopupObservation()
  const pending = pendingVerification
  pendingVerification = null
  verificationPromise = null
  if (error !== undefined) {
    pending?.reject(error)
    return
  }
  pending?.resolve(value)
}

function handlePopupMutation(): void {
  const visible = isPopupVisible()
  if (visible) {
    popupSeen = true
    if (popupTimeout) {
      clearTimeout(popupTimeout)
      popupTimeout = null
    }
    return
  }
  if (popupSeen && state.value === 'verifying') {
    state.value = 'idle'
    finishVerification(null)
  }
}

function observePopup(): void {
  stopPopupObservation()
  popupSeen = isPopupVisible()
  popupObserver = new MutationObserver(handlePopupMutation)
  popupObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden']
  })
  if (!popupSeen) {
    popupTimeout = setTimeout(() => {
      if (state.value !== 'verifying') return
      state.value = 'idle'
      finishVerification(null)
    }, openTimeoutMs)
  }
}

function beginVerification(): void {
  if (state.value === 'loading' || state.value === 'verifying' || state.value === 'verified') return
  if (!ready) {
    state.value = 'loading'
    void initialize().then(() => {
      if (mounted && buttonRef.value) buttonRef.value.click()
    }).catch(() => {
      // initialize() restores the idle state and emits the component error.
    })
    return
  }
  state.value = 'verifying'
  observePopup()
}

function onCaptchaToken(token: string): { captchaResult: boolean } {
  if (state.value !== 'verifying') return { captchaResult: false }
  const normalized = token.trim()
  if (!normalized) {
    state.value = 'idle'
    finishVerification(null)
    emit('error')
    return { captchaResult: false }
  }
  cachedToken = normalized
  state.value = 'verified'
  emit('verify', normalized)
  finishVerification(normalized)
  return { captchaResult: true }
}

function initialize(): Promise<void> {
  if (readyPromise) return readyPromise

  readyPromise = loadAliyunCaptcha(props.prefix, props.region).then((initializeCaptcha) => {
    return new Promise<void>((resolve, reject) => {
      let settled = false
      const timeout = setTimeout(() => {
        if (settled) return
        settled = true
        reject(new Error('Timed out initializing Aliyun Captcha'))
      }, initTimeoutMs)
      const finish = (): void => {
        if (settled) return
        settled = true
        clearTimeout(timeout)
        resolve()
      }
      const options: AliyunCaptchaInitOptions = {
        SceneId: props.sceneId,
        prefix: props.prefix,
        mode: 'popup',
        element: `#${elementId}`,
        button: `#${buttonId}`,
        captchaVerifyCallback: onCaptchaToken,
        onBizResultCallback: () => {},
        getInstance: finish,
        slideStyle: { width: 360, height: 40 },
        language: locale.value.toLowerCase().startsWith('zh') ? 'cn' : 'en'
      }

      Promise.resolve(initializeCaptcha(options)).catch((error: unknown) => {
        if (settled) return
        settled = true
        clearTimeout(timeout)
        reject(error)
      })
    })
  }).then(() => {
    ready = true
    if (mounted && state.value === 'loading') state.value = 'idle'
  }).catch((error: unknown) => {
    readyPromise = null
    ready = false
    if (mounted) {
      state.value = 'idle'
      emit('error')
    }
    throw error
  })

  return readyPromise
}

function verifyAliyun(): Promise<string | null> {
  if (cachedToken) return Promise.resolve(cachedToken)
  if (verificationPromise) return verificationPromise
  if (!ready) state.value = 'loading'

  verificationPromise = new Promise<string | null>((resolve, reject) => {
    pendingVerification = { resolve, reject }
    void initialize().then(() => {
      if (!pendingVerification) return
      if (!mounted || !buttonRef.value) {
        finishVerification(null)
        return
      }
      buttonRef.value.click()
    }).catch((error: unknown) => {
      if (pendingVerification) finishVerification(null, error)
    })
  })
  return verificationPromise
}

function reset(): void {
  finishVerification(null)
  cachedToken = ''
  if (mounted) state.value = ready ? 'idle' : 'loading'
}

onMounted(() => {
  mounted = true
})

onUnmounted(() => {
  mounted = false
  finishVerification(null)
  document.getElementById(maskId)?.remove()
  document.getElementById(popupId)?.remove()
})

defineExpose({ reset, verifyAliyun })
</script>

<style scoped>
.aliyun-captcha-wrapper {
  width: 100%;
}

.aliyun-captcha-button {
  display: flex;
  min-height: 44px;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid rgb(209 213 219);
  border-radius: 0.375rem;
  background: rgb(249 250 251);
  padding: 0.5rem 0.75rem;
  color: rgb(55 65 81);
  font-size: 0.875rem;
  font-weight: 500;
  transition: border-color 0.15s, background-color 0.15s, color 0.15s;
}

.aliyun-captcha-button:hover:not(:disabled) {
  border-color: rgb(156 163 175);
  background: rgb(243 244 246);
}

.aliyun-captcha-button:disabled {
  cursor: default;
}

.aliyun-captcha-button--verified {
  border-color: rgb(34 197 94);
  background: rgb(240 253 244);
  color: rgb(21 128 61);
}

.dark .aliyun-captcha-button {
  border-color: rgb(55 65 81);
  background: rgb(31 41 55);
  color: rgb(209 213 219);
}

.dark .aliyun-captcha-button:hover:not(:disabled) {
  border-color: rgb(75 85 99);
  background: rgb(55 65 81);
}

.dark .aliyun-captcha-button--verified {
  border-color: rgb(34 197 94);
  background: rgb(20 83 45 / 0.3);
  color: rgb(134 239 172);
}
</style>
