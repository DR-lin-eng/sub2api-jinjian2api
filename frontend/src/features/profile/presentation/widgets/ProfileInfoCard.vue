<template>
  <section class="card overflow-hidden" data-testid="profile-overview">
    <header class="border-b border-gray-100 px-6 py-5 dark:border-dark-700">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ displayName }}
          </h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ user?.email || '-' }}
          </p>
        </div>
        <span class="badge badge-primary">{{ t('profile.administrator') }}</span>
      </div>
    </header>

    <div class="grid gap-0 md:grid-cols-2 md:divide-x md:divide-gray-100 md:dark:divide-dark-700">
      <div class="p-6">
        <ProfileAvatarCard :user="user" embedded />
      </div>
      <div class="border-t border-gray-100 p-6 dark:border-dark-700 md:border-t-0">
        <ProfileEditForm :initial-username="user?.username || ''" embedded />
        <p class="mt-5 text-xs text-gray-500 dark:text-gray-400">
          {{ t('profile.memberSince') }}: {{ memberSinceLabel }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProfileAvatarCard from '@/features/profile/presentation/widgets/ProfileAvatarCard.vue'
import ProfileEditForm from '@/features/profile/presentation/widgets/ProfileEditForm.vue'
import type { User } from '@/types'

const props = defineProps<{
  user: User | null
}>()

const { t } = useI18n()
const displayName = computed(
  () => props.user?.username?.trim() || props.user?.email?.trim() || t('profile.administrator')
)
const memberSinceLabel = computed(() => {
  const raw = props.user?.created_at?.trim()
  if (!raw) return '-'
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
})
</script>
