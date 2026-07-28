<script setup lang="ts">
import type { GroupEditorDialogContext } from "../groupEditorContext";
import GroupEditorDialog from "./GroupEditorDialog.vue";

defineProps<{
  context: GroupEditorDialogContext;
}>();
</script>

<template>
  <GroupEditorDialog mode="create" :context="context" />
</template>
