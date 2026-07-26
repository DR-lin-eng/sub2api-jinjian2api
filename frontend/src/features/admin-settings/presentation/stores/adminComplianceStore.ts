import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { complianceQueryRepository } from '@/features/admin-settings/data/repositories/complianceQueryRepositoryImpl'
import { complianceActionRepository } from '@/features/admin-settings/data/repositories/complianceActionRepositoryImpl'
import type { AdminComplianceStatus } from '@/features/admin-settings/domain/models/adminComplianceStatus'
import { getLocale } from '@/core/i18n'

const FALLBACK_ZH_PHRASE = '我已阅读、理解并同意 Sub2API 部署与运营合规承诺'
const FALLBACK_EN_PHRASE = 'I have read, understood, and agree to the Sub2API Deployment and Operation Compliance Commitment'

export const useAdminComplianceStore = defineStore('adminCompliance', () => {
  const status = ref<AdminComplianceStatus | null>(null)
  const loading = ref(false)
  const submitting = ref(false)
  const initialized = ref(false)
  const forceVisible = ref(false)

  const required = computed(() => status.value?.required === true)
  const shouldShow = computed(() => required.value || forceVisible.value)
  const currentLocale = computed(() => getLocale())
  const expectedPhrase = computed(() => {
    if (currentLocale.value === 'zh') {
      return status.value?.ackPhraseZh || FALLBACK_ZH_PHRASE
    }
    return status.value?.ackPhraseEn || FALLBACK_EN_PHRASE
  })

  async function fetchStatus(): Promise<AdminComplianceStatus> {
    loading.value = true
    try {
      const nextStatus = await complianceQueryRepository.getStatus()
      status.value = nextStatus
      initialized.value = true
      forceVisible.value = nextStatus.required
      return nextStatus
    } finally {
      loading.value = false
    }
  }

  async function accept(phrase: string): Promise<AdminComplianceStatus> {
    submitting.value = true
    try {
      const nextStatus = await complianceActionRepository.accept({
        phrase,
        language: currentLocale.value
      })
      status.value = nextStatus
      forceVisible.value = nextStatus.required
      return nextStatus
    } finally {
      submitting.value = false
    }
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
      acknowledgement: status.value?.acknowledgement
    }
    initialized.value = true
    forceVisible.value = true
  }

  function reset(): void {
    status.value = null
    loading.value = false
    submitting.value = false
    initialized.value = false
    forceVisible.value = false
  }

  return {
    status,
    loading,
    submitting,
    initialized,
    required,
    shouldShow,
    expectedPhrase,
    fetchStatus,
    accept,
    requireAcknowledgement,
    reset
  }
})
