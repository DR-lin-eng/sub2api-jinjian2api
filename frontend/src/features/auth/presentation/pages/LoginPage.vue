<template>
  <main class="min-h-screen bg-gray-50 px-4 py-10 dark:bg-dark-950 sm:py-16">
    <section class="mx-auto w-full max-w-sm">
      <div class="mb-8 flex flex-col items-center text-center">
        <img :src="siteLogo" :alt="siteName" class="h-14 w-14 object-contain" />
        <h1 class="mt-4 text-2xl font-semibold text-gray-950 dark:text-white">{{ siteName }}</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-dark-400">{{ t('auth.signIn') }}</p>
      </div>

      <form class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-700 dark:bg-dark-900" @submit.prevent="submit">
        <div v-if="stage === 'credentials'" class="space-y-4">
          <div>
            <label for="admin-email" class="input-label">{{ t('auth.email') }}</label>
            <input
              id="admin-email"
              v-model.trim="email"
              type="email"
              autocomplete="username"
              required
              class="input mt-1 w-full"
            />
          </div>

          <div>
            <label for="admin-password" class="input-label">{{ t('auth.password') }}</label>
            <input
              id="admin-password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="input mt-1 w-full"
            />
          </div>
        </div>

        <div v-else>
          <label for="admin-totp" class="input-label">{{ t('profile.totp.enterCode') }}</label>
          <input
            id="admin-totp"
            v-model.trim="totpCode"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="8"
            required
            autofocus
            class="input mt-1 w-full text-center font-mono text-lg tracking-widest"
          />
        </div>

        <p v-if="errorMessage" role="alert" class="mt-4 text-sm text-red-600 dark:text-red-400">
          {{ errorMessage }}
        </p>

        <button type="submit" class="btn-primary mt-6 w-full" :disabled="loading">
          <span v-if="loading" class="inline-flex items-center gap-2">
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
            {{ t('common.loading') }}
          </span>
          <span v-else>{{ stage === 'credentials' ? t('auth.signIn') : t('common.confirm') }}</span>
        </button>

        <button
          v-if="stage === 'credentials'"
          type="button"
          class="btn-secondary mt-3 w-full"
          :disabled="loading"
          @click="loginWithPasskey"
        >
          {{ t('auth.passkeySignIn') }}
        </button>

        <button
          v-else
          type="button"
          class="btn-ghost mt-3 w-full"
          :disabled="loading"
          @click="resetCredentials"
        >
          {{ t('common.back') }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/core/stores/appStore'
import { isTotp2FARequired } from '@/features/auth/data/datasources/authDatasource'
import { useAuthStore } from '@/features/auth/presentation/stores/authStore'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const totpCode = ref('')
const tempToken = ref('')
const stage = ref<'credentials' | 'totp'>('credentials')
const loading = ref(false)
const errorMessage = ref('')

const siteName = computed(() => appStore.siteName || 'Sub2API')
const siteLogo = computed(() => appStore.siteLogo || '/logo.svg')

function destination(): string {
  const requested = typeof route.query.redirect === 'string' ? route.query.redirect : ''
  return requested.startsWith('/') && !requested.startsWith('//') ? requested : '/admin/accounts'
}

function describeError(error: unknown): string {
  if (error && typeof error === 'object') {
    const candidate = error as { message?: string; response?: { data?: { message?: string } } }
    return candidate.response?.data?.message || candidate.message || t('common.error')
  }
  return t('common.error')
}

async function submit() {
  errorMessage.value = ''
  loading.value = true
  try {
    if (stage.value === 'totp') {
      await authStore.login2FA(tempToken.value, totpCode.value)
      await router.replace(destination())
      return
    }

    const response = await authStore.login({ email: email.value, password: password.value })
    if (isTotp2FARequired(response)) {
      if (!response.temp_token) {
        throw new Error(t('common.error'))
      }
      tempToken.value = response.temp_token
      stage.value = 'totp'
      return
    }
    await router.replace(destination())
  } catch (error) {
    errorMessage.value = describeError(error)
  } finally {
    loading.value = false
  }
}

async function loginWithPasskey() {
  errorMessage.value = ''
  loading.value = true
  try {
    await authStore.loginWithPasskey()
    await router.replace(destination())
  } catch (error) {
    errorMessage.value = describeError(error)
  } finally {
    loading.value = false
  }
}

function resetCredentials() {
  stage.value = 'credentials'
  tempToken.value = ''
  totpCode.value = ''
  errorMessage.value = ''
}
</script>
