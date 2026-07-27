// Stable common-widget entry point. Domain-specific components stay in features.
export { default as DataTable } from './data/DataTable.vue'
export { default as Pagination } from './data/Pagination.vue'
export { default as StatCard } from './data/StatCard.vue'
export { default as LocaleSwitcher } from './data/LocaleSwitcher.vue'
export { default as BaseDialog } from './feedback/BaseDialog.vue'
export { default as ConfirmDialog } from './feedback/ConfirmDialog.vue'
export { default as Toast } from './feedback/Toast.vue'
export { default as LoadingSpinner } from './feedback/LoadingSpinner.vue'
export { default as EmptyState } from './feedback/EmptyState.vue'
export { default as ExportProgressDialog } from './feedback/ExportProgressDialog.vue'

// Export types
export type { Column } from '../types/uiTypes'
