<script setup lang="ts">
import { useI18n } from "vue-i18n";
import ConfirmDialog from "@/common/widgets/feedback/ConfirmDialog.vue";
import type { AdminGroup } from "@/types";
import CompositeRoutesDialog from "./CompositeRoutesDialog.vue";
import GroupSortOrderDialog from "./GroupSortOrderDialog.vue";

defineProps<{
  showDelete: boolean;
  deleteConfirmMessage: string;
  showUnsupportedLive: boolean;
  showSort: boolean;
  sortableGroups: AdminGroup[];
  sortSubmitting: boolean;
  showCompositeRoutes: boolean;
  compositeRoutesGroup: AdminGroup | null;
}>();

const emit = defineEmits<{
  (event: "confirmDelete"): void;
  (event: "closeDelete"): void;
  (event: "confirmUnsupportedLive"): void;
  (event: "cancelUnsupportedLive"): void;
  (event: "update:sortableGroups", value: AdminGroup[]): void;
  (event: "closeSort"): void;
  (event: "saveSort"): void;
  (event: "closeCompositeRoutes"): void;
}>();

const { t } = useI18n();
</script>

<template>
  <ConfirmDialog
    :show="showDelete"
    :title="t('admin.groups.deleteGroup')"
    :message="deleteConfirmMessage"
    :confirm-text="t('common.delete')"
    :cancel-text="t('common.cancel')"
    :danger="true"
    @confirm="emit('confirmDelete')"
    @cancel="emit('closeDelete')"
  />

  <ConfirmDialog
    :show="showUnsupportedLive"
    :title="t('admin.groups.openaiLive.unsupportedTitle')"
    :message="t('admin.groups.openaiLive.unsupportedMessage')"
    :confirm-text="t('admin.groups.openaiLive.enableAnyway')"
    :cancel-text="t('common.cancel')"
    :danger="true"
    @confirm="emit('confirmUnsupportedLive')"
    @cancel="emit('cancelUnsupportedLive')"
  />

  <GroupSortOrderDialog
    :model-value="sortableGroups"
    :show="showSort"
    :submitting="sortSubmitting"
    @update:model-value="emit('update:sortableGroups', $event)"
    @close="emit('closeSort')"
    @save="emit('saveSort')"
  />

  <CompositeRoutesDialog
    :show="showCompositeRoutes"
    :group="compositeRoutesGroup"
    @close="emit('closeCompositeRoutes')"
  />
</template>
