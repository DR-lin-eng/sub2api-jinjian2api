import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SyncFromCrsDialog from '@/features/admin-accounts/presentation/widgets/SyncFromCrsDialog.vue'

const { previewFromCrs, showError, showSuccess, syncFromCrs } = vi.hoisted(() => ({
  previewFromCrs: vi.fn(),
  showError: vi.fn(),
  showSuccess: vi.fn(),
  syncFromCrs: vi.fn()
}))

vi.mock('@/features/admin-accounts/data/datasources/adminAccountQueries', () => ({
  previewFromCrs
}))

vi.mock('@/features/admin-accounts/data/datasources/adminAccountActions', () => ({
  syncFromCrs
}))

vi.mock('@/core/stores/appStore', () => ({
  useAppStore: () => ({ showError, showSuccess })
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

const mountDialog = () => mount(SyncFromCrsDialog, {
  props: { show: true },
  global: {
    stubs: {
      BaseDialog: { template: '<div><slot /><slot name="footer" /></div>' }
    }
  }
})

const fillCredentials = async (wrapper: ReturnType<typeof mountDialog>) => {
  await wrapper.find('#crs-base-url').setValue(' https://crs.example.com/ ')
  await wrapper.find('#crs-username').setValue(' admin ')
  await wrapper.find('#crs-password').setValue('secret')
}

describe('SyncFromCrsDialog', () => {
  beforeEach(() => {
    previewFromCrs.mockReset()
    syncFromCrs.mockReset()
    showError.mockReset()
    showSuccess.mockReset()
  })

  it('requires all CRS credentials before previewing', async () => {
    const wrapper = mountDialog()

    await wrapper.find('form').trigger('submit')

    expect(showError).toHaveBeenCalledWith('admin.accounts.syncMissingFields')
    expect(previewFromCrs).not.toHaveBeenCalled()
  })

  it('previews, auto-selects new accounts, and preserves the selected sync payload', async () => {
    previewFromCrs.mockResolvedValue({
      new_accounts: [
        { crs_account_id: 'crs-1', kind: 'openai', name: 'One', platform: 'openai', type: 'oauth' },
        { crs_account_id: 'crs-2', kind: 'claude', name: 'Two', platform: 'anthropic', type: 'oauth' }
      ],
      existing_accounts: [
        { crs_account_id: 'crs-3', kind: 'gemini', name: 'Existing', platform: 'gemini', type: 'oauth' }
      ]
    })
    syncFromCrs.mockResolvedValue({
      created: 1,
      updated: 1,
      skipped: 1,
      failed: 0,
      items: []
    })
    const wrapper = mountDialog()
    await fillCredentials(wrapper)

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(previewFromCrs).toHaveBeenCalledWith({
      base_url: 'https://crs.example.com/',
      username: 'admin',
      password: 'secret'
    })
    const accountCheckboxes = wrapper.findAll('input[type="checkbox"]')
    expect(accountCheckboxes).toHaveLength(2)
    expect(accountCheckboxes.every((checkbox) => (checkbox.element as HTMLInputElement).checked)).toBe(true)

    await accountCheckboxes[1]!.trigger('change')
    await wrapper.find('button.btn-primary').trigger('click')
    await flushPromises()

    expect(syncFromCrs).toHaveBeenCalledWith({
      base_url: 'https://crs.example.com/',
      username: 'admin',
      password: 'secret',
      sync_proxies: true,
      selected_account_ids: ['crs-1']
    })
    expect(showSuccess).toHaveBeenCalledWith('admin.accounts.syncCompleted')
    expect(wrapper.emitted('synced')).toHaveLength(1)
  })

  it('disables sync when new accounts exist but none are selected', async () => {
    previewFromCrs.mockResolvedValue({
      new_accounts: [
        { crs_account_id: 'crs-1', kind: 'openai', name: 'One', platform: 'openai', type: 'oauth' }
      ],
      existing_accounts: []
    })
    const wrapper = mountDialog()
    await fillCredentials(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    const selectNone = wrapper.findAll('button').find(
      (button) => button.text() === 'admin.accounts.crsSelectNone'
    )
    expect(selectNone).toBeDefined()
    await selectNone!.trigger('click')

    expect(wrapper.find('button.btn-primary').attributes('disabled')).toBeDefined()
    expect(syncFromCrs).not.toHaveBeenCalled()
  })
})
