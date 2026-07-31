/* Feature barrel per spec §1. */
/* MUST only export: Page components + route fragment.                      */
/* MUST NOT export: store / composable / repository / datasource / widget.  */
import type { RouteRecordRaw } from 'vue-router'


// BackupPage is mounted inside SettingsPage as a child component; no top-level route.
export const adminBackupRoutes: RouteRecordRaw[] = []
