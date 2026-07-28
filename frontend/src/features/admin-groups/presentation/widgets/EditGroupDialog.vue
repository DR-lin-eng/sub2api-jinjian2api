<script setup lang="ts">
import type { EditGroupDialogContext } from "../groupEditorContext";
import GroupEditorDialog from "./GroupEditorDialog.vue";

defineProps<{
  context: EditGroupDialogContext;
}>();
</script>

<template>
  <GroupEditorDialog mode="edit" :context="context" />
</template>
