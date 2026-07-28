<template>
  <div v-if="isOAuthFlow" class="mb-6 flex items-center justify-center">
    <div class="flex items-center space-x-4">
      <div class="flex items-center">
        <div
          :class="[
            'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
            step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-dark-600'
          ]"
        >
          1
        </div>
        <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('admin.accounts.oauth.authMethod') }}
        </span>
      </div>
      <div class="h-0.5 w-8 bg-gray-300 dark:bg-dark-600" />
      <div class="flex items-center">
        <div
          :class="[
            'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
            step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-dark-600'
          ]"
        >
          2
        </div>
        <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ oauthStepTitle }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateAccountStepIndicatorContext } from '../../accountEditorContext'

const props = defineProps<{ context: CreateAccountStepIndicatorContext }>()
const { isOAuthFlow, oauthStepTitle, step, t } = props.context
</script>
