// Each entry grants exactly one existing runtime import. Remove the entry in
// the same change that migrates the import; never add entries for new code.
module.exports = {
  legacyBarrelImports: {
    '@/api': [
      'src/features/admin-audit/presentation/pages/AuditLogPage.vue',
      'src/features/admin-backup/presentation/pages/BackupPage.vue',
      'src/features/admin-ops/presentation/widgets/OpsAlertRulesCard.vue',
      'src/features/auth/presentation/widgets/TotpStepUpDialog.vue',
      'src/features/keys/presentation/pages/KeysPage.vue',
      'src/features/profile/presentation/widgets/ProfileAvatarCard.vue',
      'src/features/profile/presentation/widgets/ProfileEditForm.vue',
      'src/features/profile/presentation/widgets/ProfilePasswordForm.vue',
      'src/features/profile/presentation/widgets/ProfileTotpCard.vue',
      'src/features/profile/presentation/widgets/TotpDisableDialog.vue',
      'src/features/profile/presentation/widgets/TotpSetupDialog.vue',
      'src/features/usage/presentation/pages/UsagePage.vue',
    ],
    '@/api/admin': [
      'src/common/widgets/data/ProxySelector.vue',
      'src/features/admin-audit/presentation/pages/AuditLogPage.vue',
      'src/features/admin-channel-monitor/presentation/pages/ChannelMonitorPage.vue',
      'src/features/admin-channel-monitor/presentation/widgets/MonitorFormDialog.vue',
      'src/features/admin-channel-monitor/presentation/widgets/MonitorTemplateApplyPickerDialog.vue',
      'src/features/admin-channel-monitor/presentation/widgets/MonitorTemplateManagerDialog.vue',
      'src/features/admin-channels/presentation/pages/ChannelsPage.vue',
      'src/features/admin-cluster/presentation/pages/MultiInstancePage.vue',
      'src/features/admin-groups/presentation/widgets/CompositeRoutesDialog.vue',
      'src/features/admin-proxies/presentation/widgets/ImportDataDialog.vue',
      'src/features/admin-risk-control/presentation/pages/RiskControlPage.vue',
    ],
    '@/stores': [
      'src/App.vue',
      'src/common/widgets/data/VersionBadge.vue',
      'src/common/widgets/layout/AppHeader.vue',
      'src/common/widgets/layout/AppLayout.vue',
      'src/common/widgets/layout/AppSidebar.vue',
      'src/features/admin-audit/presentation/pages/AuditLogPage.vue',
      'src/features/admin-backup/presentation/pages/BackupPage.vue',
      'src/features/admin-ops/presentation/pages/OpsDashboardPage.vue',
      'src/features/admin-ops/presentation/widgets/OpsErrorDetailDialog.vue',
      'src/features/admin-ops/presentation/widgets/OpsRequestDetailsDialog.vue',
      'src/features/admin-ops/presentation/widgets/OpsSystemLogTable.vue',
      'src/features/auth/presentation/widgets/TotpStepUpDialog.vue',
    ],
  },
  crossFeaturePresentationImports: {
    'src/features/admin-accounts/presentation/pages/AccountsPage.vue': [
      '@/features/admin-settings/presentation/widgets/ErrorPassthroughRulesDialog.vue',
      '@/features/admin-settings/presentation/widgets/TLSFingerprintProfilesDialog.vue',
      '@/features/auth/presentation/stores/authStore',
      '@/features/auth/presentation/widgets/TotpStepUpDialog.vue',
    ],
    'src/features/admin-backup/presentation/pages/BackupPage.vue': [
      '@/features/auth/presentation/widgets/TotpStepUpDialog.vue',
    ],
    'src/features/admin-channel-monitor/presentation/widgets/MonitorFormDialog.vue': [
      '@/features/admin-channels/presentation/adminChannelSignals',
      '@/features/admin-channels/presentation/widgets/ModelTagInput.vue',
    ],
    'src/features/admin-ops/presentation/composables/useOpsRealtimeTraffic.ts': [
      '@/features/admin-settings/presentation/stores/adminSettingsStore',
    ],
    'src/features/admin-risk-control/presentation/pages/RiskControlPage.vue': [
      '@/features/admin-accounts/presentation/widgets/ModelWhitelistSelector.vue',
    ],
    'src/features/admin-settings/presentation/composables/useSettingsStructuredEditors.ts': [
      '@/features/admin-accounts/presentation/codexFingerprintSignals',
    ],
    'src/features/admin-settings/presentation/pages/SettingsPage.vue': [
      '@/features/auth/presentation/widgets/TotpStepUpDialog.vue',
    ],
    'src/features/admin-settings/presentation/widgets/settings-tabs/SettingsBackupTab.vue': [
      '@/features/admin-backup/presentation/pages/BackupPage.vue',
    ],
    'src/features/profile/presentation/pages/ProfilePage.vue': [
      '@/features/auth/presentation/stores/authStore',
      '@/features/passkeys/presentation/widgets/ProfilePasskeyCard.vue',
    ],
    'src/features/profile/presentation/widgets/ProfileAvatarCard.vue': [
      '@/features/auth/presentation/stores/authStore',
    ],
    'src/features/profile/presentation/widgets/ProfileEditForm.vue': [
      '@/features/auth/presentation/stores/authStore',
    ],
    'src/features/usage/presentation/pages/UsagePage.vue': [
      '@/features/admin-usage/presentation/widgets/UsageStatsCards.vue',
      '@/features/admin-usage/presentation/widgets/UsageTable.vue',
    ],
  },
}
