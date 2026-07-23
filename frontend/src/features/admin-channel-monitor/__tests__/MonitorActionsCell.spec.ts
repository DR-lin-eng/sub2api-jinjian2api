import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import type { ChannelMonitor } from '@/features/admin-channel-monitor/domain/models/channelMonitor'
import MonitorActionsCell from '@/features/admin-channel-monitor/presentation/widgets/MonitorActionsCell.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

function makeMonitor(overrides: Partial<ChannelMonitor> = {}): ChannelMonitor {
  return {
    id: 42,
    name: 'primary',
    provider: 'openai',
    monitorMode: 'active',
    channelId: null,
    groupId: null,
    apiMode: 'chat_completions',
    endpoint: 'https://api.example.com',
    apiKeyMasked: 'sk-t***',
    apiKeyDecryptFailed: false,
    primaryModel: 'gpt-4o-mini',
    extraModels: [],
    groupName: '',
    enabled: true,
    intervalSeconds: 60,
    jitterSeconds: 0,
    lastCheckedAt: null,
    createdBy: 1,
    createdAt: '2026-07-16T00:00:00Z',
    updatedAt: '2026-07-16T00:00:00Z',
    primaryStatus: '',
    primaryLatencyMs: null,
    availability7d: 0,
    extraModelsStatus: [],
    templateId: null,
    extraHeaders: {},
    bodyOverrideMode: 'off',
    bodyOverride: null,
    ...overrides,
  }
}

describe('MonitorActionsCell duplicate action', () => {
  it('emits the selected monitor when duplicate is clicked', async () => {
    const row = makeMonitor()
    const wrapper = mount(MonitorActionsCell, {
      props: { row, running: false, duplicating: false },
    })

    await wrapper.get('[data-testid="monitor-duplicate"]').trigger('click')

    expect(wrapper.emitted('duplicate')).toEqual([[row]])
  })

  it('disables the action while the same monitor is being duplicated', () => {
    const wrapper = mount(MonitorActionsCell, {
      props: { row: makeMonitor(), running: false, duplicating: true },
    })
    const button = wrapper.get('[data-testid="monitor-duplicate"]')

    expect(button.attributes('disabled')).toBeDefined()
    expect(button.attributes('title')).toBe('admin.channelMonitor.duplicating')
    expect(button.text()).toContain('admin.channelMonitor.duplicating')
  })

  it('disables the action when the stored API key cannot be decrypted', () => {
    const wrapper = mount(MonitorActionsCell, {
      props: {
        row: makeMonitor({ apiKeyDecryptFailed: true }),
        running: false,
        duplicating: false,
      },
    })
    const button = wrapper.get('[data-testid="monitor-duplicate"]')

    expect(button.attributes('disabled')).toBeDefined()
    expect(button.attributes('title')).toBe('admin.channelMonitor.duplicateKeyUnavailable')
  })
})
