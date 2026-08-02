<template>
  <!-- 后台内嵌形态：?embedded=1 且已登录，套完整后台布局 -->
  <AppLayout v-if="isEmbedded">
    <ModelPlazaContent :response="data" :loading="loading" :error="loadFailed" embedded />
  </AppLayout>

  <!-- 独立形态：自带导航条(logo/站名 + 登录/回后台) -->
  <div v-else class="min-h-screen bg-gray-50 dark:bg-dark-950">
    <PlazaNavBar />
    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <ModelPlazaContent :response="data" :loading="loading" :error="loadFailed" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/common/widgets/layout/AppLayout.vue'
import { useAppStore } from '@/core/stores/appStore'
import { useAuthStore } from '@/features/auth/presentation/stores/authStore'
import { useModelPlaza } from '@/features/model-plaza/presentation/composables/useModelPlaza'
import ModelPlazaContent from '../widgets/ModelPlazaContent.vue'
import PlazaNavBar from '../widgets/PlazaNavBar.vue'

const route = useRoute()
const appStore = useAppStore()
const authStore = useAuthStore()
const modelPlaza = useModelPlaza()

// embedded=1 但未登录(如转发的链接)自动降级为独立形态。
const isEmbedded = computed(() => route.query.embedded === '1' && authStore.isAuthenticated)

const data = computed(() => modelPlaza.data)
const loading = computed(() => modelPlaza.loading.get)
const loadFailed = computed(() => Boolean(modelPlaza.errors.get))

onMounted(async () => {
  // 独立形态导航条需要站点名/Logo；有 __APP_CONFIG__ 注入时同步命中缓存。
  void appStore.fetchPublicSettings()
  try {
    await modelPlaza.get()
  } catch {
    // 错误状态由 store.errors.get 承载。
  }
})
</script>
