import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import SettingsSecurityTab from '@/features/admin-settings/presentation/pages/tabs/SettingsSecurityTab.vue'

const {
  getAdminApiKey,
  listAdminApiKeys,
  createAdminApiKey,
  updateAdminApiKey,
  rotateAdminApiKey,
  revokeAdminApiKey,
  regenerateAdminApiKey,
  deleteAdminApiKey,
  showError,
  showSuccess,
} = vi.hoisted(() => ({
  getAdminApiKey: vi.fn().mockResolvedValue({ exists: false, maskedKey: '' }),
  listAdminApiKeys: vi.fn().mockResolvedValue({ items: [] }),
  createAdminApiKey: vi.fn(),
  updateAdminApiKey: vi.fn(),
  rotateAdminApiKey: vi.fn(),
  revokeAdminApiKey: vi.fn(),
  regenerateAdminApiKey: vi.fn(),
  deleteAdminApiKey: vi.fn(),
  showError: vi.fn(),
  showSuccess: vi.fn(),
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: Record<string, unknown>) => {
        if (params) return `${key} ${Object.values(params).join(' ')}`
        return key
      },
    }),
  }
})

vi.mock('@/features/admin-settings/presentation/composables/useAdminSettings', () => ({
  useAdminSettings: () => ({
    getAdminApiKey,
    listAdminApiKeys,
    createAdminApiKey,
    updateAdminApiKey,
    rotateAdminApiKey,
    revokeAdminApiKey,
    regenerateAdminApiKey,
    deleteAdminApiKey,
  }),
}))

vi.mock('@/core/stores/appStore', () => ({
  useAppStore: () => ({
    showError,
    showSuccess,
  }),
}))

const ToggleStub = defineComponent({
  name: 'Toggle',
  props: {
    modelValue: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    return () => h('input', {
      ...attrs,
      type: 'checkbox',
      checked: props.modelValue,
      disabled: props.disabled,
      onChange: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).checked),
    })
  },
})

function mountTab(formOverrides: Record<string, unknown>) {
  return mount(SettingsSecurityTab, {
    props: {
      form: {
        passwordResetEnabled: false,
        totpEnabled: false,
        totpEncryptionKeyConfigured: false,
        stepUpEnabled: false,
        clientIpResolutionMode: 'direct',
        clientIpResolutionStatus: {
          mode: 'direct',
          customPrefixCount: 0,
          trustedProxyCidrs: [],
          remoteAddr: '',
          resolvedClientIp: '',
        },
        trustedProxyCidrs: [],
        turnstileEnabled: false,
        recaptchaEnabled: false,
        capEnabled: false,
        localCaptchaEnabled: false,
        passkeyEnabled: false,
        passkeyConfigured: false,
        passkeyRpId: '',
        passkeyRpOrigins: [],
        ...formOverrides,
      },
      saving: false,
      loadFailed: false,
    },
    global: {
      stubs: {
        Toggle: ToggleStub,
        Select: true,
        Icon: true,
      },
    },
  })
}

describe('SettingsSecurityTab passkey settings', () => {
  it('shows valid passkey RP configuration and enables the sign-in toggle', async () => {
    const wrapper = mountTab({
      passkeyEnabled: true,
      passkeyConfigured: true,
      passkeyRpId: 'sub3.nebula-spaces.com',
      passkeyRpOrigins: ['https://sub3.nebula-spaces.com'],
    })

    await flushPromises()

    const settings = wrapper.get('[data-testid="passkey-settings"]')
    const toggle = settings.get('[data-testid="passkey-toggle"]')
    expect(toggle.attributes('disabled')).toBeUndefined()
    expect(settings.text()).toContain('sub3.nebula-spaces.com')
    expect(settings.text()).toContain('https://sub3.nebula-spaces.com')
    expect(settings.text()).not.toContain('admin.settings.security.passkeyDeploymentHint')
  })

  it('disables passkey sign-in when RP configuration is unavailable', async () => {
    const wrapper = mountTab({
      passkeyEnabled: false,
      passkeyConfigured: false,
      passkeyRpId: '',
      passkeyRpOrigins: [],
    })

    await flushPromises()

    const settings = wrapper.get('[data-testid="passkey-settings"]')
    expect(settings.get('[data-testid="passkey-toggle"]').attributes('disabled')).toBeDefined()
    const status = settings.get('[data-testid="passkey-config-status"]')
    expect(status.text()).toContain('admin.settings.security.passkeyNotConfigured')
    expect(status.text()).toContain('admin.settings.security.passkeyDeploymentHint')
  })
})
