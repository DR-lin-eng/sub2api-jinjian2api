<template>
  <div>
    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
    <div class="flex items-center gap-2">
      <input
        v-bind="$attrs"
        :value="modelValue"
        type="number"
        min="0"
        max="100000"
        class="input w-32"
        @input="emitValue"
        @keydown.enter.stop.prevent="emit('submit')"
      />
      <span class="text-sm text-gray-500 dark:text-gray-400">{{ unit }}</span>
    </div>
    <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  modelValue: number
  label: string
  hint: string
  unit: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
  (event: 'submit'): void
}>()

function emitValue(event: Event): void {
  emit('update:modelValue', Number((event.target as HTMLInputElement).value))
}
</script>
