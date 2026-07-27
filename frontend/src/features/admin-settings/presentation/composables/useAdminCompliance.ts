import { computed, ref } from 'vue'
import { useAdminSettingsQueryStore } from '@/features/admin-settings/presentation/stores/adminSettingsQueryStore'
import { useAdminSettingsActionStore } from '@/features/admin-settings/presentation/stores/adminSettingsActionStore'
import type { AdminComplianceStatus } from '@/features/admin-settings/domain/models/adminComplianceStatus'
import { getLocale } from '@/core/i18n'

const FALLBACK_ZH_PHRASE = '我已阅读、理解并同意 Sub2API 部署与运营合规承诺'
const FALLBACK_EN_PHRASE = 'I have read, understood, and agree to the Sub2API Deployment and Operation Compliance Commitment'

const status = ref<AdminComplianceStatus | null>(null)
const initialized = ref(false)
const forceVisible = ref(false)

export function useAdminCompliance() {
  const queryStore = useAdminSettingsQueryStore()
  const actionStore = useAdminSettingsActionStore()

  const required = computed(() => status.value?.required === true)
  const shouldShow = computed(() => required.value || forceVisible.value)
  const currentLocale = computed(() => getLocale())
  const expectedPhrase = computed(() => {
    if (currentLocale.value === 'zh') {
      return status.value?.ackPhraseZh || FALLBACK_ZH_PHRASE
    }
    return status.value?.ackPhraseEn || FALLBACK_EN_PHRASE
  })

  const fetchLoading = computed(() => queryStore.loading['getComplianceStatus'])
  const acceptLoading = computed(() => actionStore.loading['acceptCompliance'])

  async function fetchStatus(): Promise<AdminComplianceStatus> {
    const nextStatus = await queryStore.getComplianceStatus()
    status.value = nextStatus
    initialized.value = true
    forceVisible.value = nextStatus.required
    return nextStatus
  }

  async function accept(phrase: string): Promise<AdminComplianceStatus> {
    const nextStatus = await actionStore.acceptCompliance({
      phrase,
      language: currentLocale.value,
    })
    status.value = nextStatus
    forceVisible.value = nextStatus.required
    return nextStatus
  }

  function requireAcknowledgement(partialStatus?: Partial<AdminComplianceStatus>): void {
    status.value = {
      required: true,
      version: partialStatus?.version || status.value?.version || 'v2026.06.10',
      documentPathZh: partialStatus?.documentPathZh || status.value?.documentPathZh || 'docs/legal/admin-compliance.zh.md',
      documentPathEn: partialStatus?.documentPathEn || status.value?.documentPathEn || 'docs/legal/admin-compliance.en.md',
      documentUrlZh: partialStatus?.documentUrlZh || status.value?.documentUrlZh || 'https://github.com/Wei-Shaw/sub2api/blob/main/docs/legal/admin-compliance.zh.md',
      documentUrlEn: partialStatus?.documentUrlEn || status.value?.documentUrlEn || 'https://github.com/Wei-Shaw/sub2api/blob/main/docs/legal/admin-compliance.en.md',
      ackPhraseZh: partialStatus?.ackPhraseZh || status.value?.ackPhraseZh || FALLBACK_ZH_PHRASE,
      ackPhraseEn: partialStatus?.ackPhraseEn || status.value?.ackPhraseEn || FALLBACK_EN_PHRASE,
      acknowledgement: status.value?.acknowledgement,
    }
    initialized.value = true
    forceVisible.value = true
  }

  function reset(): void {
    status.value = null
    initialized.value = false
    forceVisible.value = false
  }

  return {
    status,
    initialized,
    required,
    shouldShow,
    expectedPhrase,
    fetchLoading,
    acceptLoading,
    fetchStatus,
    accept,
    requireAcknowledgement,
    reset,
  }
}
