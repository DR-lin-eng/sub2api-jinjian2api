import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

const { updateAccountMock, checkMixedChannelRiskMock, showErrorMock } = vi.hoisted(() => ({
  updateAccountMock: vi.fn(),
  checkMixedChannelRiskMock: vi.fn(),
  showErrorMock: vi.fn()
}))

vi.mock('@/stores/app', () => ({
  useAppStore: () => ({
    showError: showErrorMock,
    showSuccess: vi.fn(),
    showInfo: vi.fn()
  })
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ isSimpleMode: true })
}))

vi.mock('@/api/admin', () => ({
  adminAPI: {
    accounts: {
      update: updateAccountMock,
      checkMixedChannelRisk: checkMixedChannelRiskMock
    },
    settings: {
      getWebSearchEmulationConfig: vi.fn().mockResolvedValue({ enabled: false, providers: [] }),
      getSettings: vi.fn().mockResolvedValue({})
    },
    tlsFingerprintProfiles: {
      list: vi.fn().mockResolvedValue([])
    }
  }
}))

vi.mock('@/api/admin/accounts', () => ({
  getAntigravityDefaultModelMapping: vi.fn()
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key })
  }
})

import EditAccountModal from '../EditAccountModal.vue'

const BaseDialogStub = defineComponent({
  name: 'BaseDialog',
  props: { show: { type: Boolean, default: false } },
  template: '<div v-if="show"><slot /><slot name="footer" /></div>'
})

function buildAccount(overrides: Record<string, unknown> = {}) {
  return {
    id: 9,
    name: 'CPA pool',
    notes: '',
    platform: 'openai',
    type: 'apikey',
    credentials: {
      base_url: 'http://cpa:8317/v1',
      cpa_mode: true,
      cpa_management_url: 'http://cpa:8317',
      cpa_concurrency_per_credential: 2
    },
    credentials_status: { has_api_key: true, has_cpa_management_key: true },
    extra: {},
    proxy_id: null,
    concurrency: 100,
    priority: 1,
    rate_multiplier: 1,
    status: 'active',
    group_ids: [],
    expires_at: null,
    auto_pause_on_expired: false,
    ...overrides
  } as any
}

function mountModal(account = buildAccount()) {
  return mount(EditAccountModal, {
    props: { show: true, account, proxies: [], groups: [] },
    global: {
      stubs: {
        BaseDialog: BaseDialogStub,
        Select: true,
        Icon: true,
        ProxySelector: true,
        GroupSelector: true,
        ModelWhitelistSelector: true
      }
    }
  })
}

describe('EditAccountModal CPA concurrency sync', () => {
  beforeEach(() => {
    updateAccountMock.mockReset()
    updateAccountMock.mockResolvedValue(buildAccount())
    checkMixedChannelRiskMock.mockReset()
    checkMixedChannelRiskMock.mockResolvedValue({ has_risk: false })
    showErrorMock.mockReset()
  })

  it('loads CPA settings and keeps the redacted management key on save', async () => {
    const wrapper = mountModal()
    expect(wrapper.get('[data-testid="cpa-mode-toggle"]').attributes('aria-checked')).toBe('true')
    expect((wrapper.get('[data-testid="cpa-management-url"]').element as HTMLInputElement).value).toBe('http://cpa:8317')
    expect((wrapper.get('[data-testid="cpa-concurrency-per-credential"]').element as HTMLInputElement).value).toBe('2')

    await wrapper.get('form#edit-account-form').trigger('submit.prevent')
    await vi.waitFor(() => expect(updateAccountMock).toHaveBeenCalledTimes(1))

    const payload = updateAccountMock.mock.calls[0]?.[1]
    expect(payload.credentials).toMatchObject({
      cpa_mode: true,
      cpa_management_url: 'http://cpa:8317',
      cpa_concurrency_per_credential: 2
    })
    expect(payload.credentials).not.toHaveProperty('cpa_management_key')
  })

  it('allows rotating the management key and clears CPA settings when disabled', async () => {
    const wrapper = mountModal()
    await wrapper.get('[data-testid="cpa-management-key"]').setValue('rotated-key')
    await wrapper.get('form#edit-account-form').trigger('submit.prevent')
    await vi.waitFor(() => expect(updateAccountMock).toHaveBeenCalledTimes(1))
    expect(updateAccountMock.mock.calls[0]?.[1]?.credentials?.cpa_management_key).toBe('rotated-key')

    updateAccountMock.mockClear()
    await wrapper.get('[data-testid="cpa-mode-toggle"]').trigger('click')
    await wrapper.get('form#edit-account-form').trigger('submit.prevent')
    await vi.waitFor(() => expect(updateAccountMock).toHaveBeenCalledTimes(1))
    expect(updateAccountMock.mock.calls[0]?.[1]?.credentials).toMatchObject({
      cpa_mode: false,
      cpa_management_key: ''
    })
  })
})
