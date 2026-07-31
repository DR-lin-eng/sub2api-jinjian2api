import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ModelSquarePage from '@/features/model-square/presentation/pages/ModelSquarePage.vue'

const { showError, showSuccess } = vi.hoisted(() => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
}))

vi.mock('@/core/stores/appStore', () => ({
  useAppStore: () => ({ showError, showSuccess }),
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: Record<string, unknown>) => params?.count !== undefined
        ? `${key}:${params.count}`
        : key,
    }),
  }
})

const ModelSquareCardStub = {
  props: ['model'],
  emits: ['toggle-compare'],
  template: `
    <button class="model-card" type="button" @click="$emit('toggle-compare', model.id)">
      {{ model.name }}
    </button>
  `,
}

describe('ModelSquarePage', () => {
  beforeEach(() => {
    showError.mockReset()
    showSuccess.mockReset()
  })

  it('filters mock models and coordinates comparison selection', async () => {
    const wrapper = mount(ModelSquarePage, {
      global: {
        stubs: {
          AppLayout: { template: '<div><slot /></div>' },
          EmptyState: true,
          SearchInput: true,
          Select: true,
          Icon: true,
          ModelSquareCard: ModelSquareCardStub,
          ModelDetailDialog: true,
          ModelCompareDialog: true,
        },
      },
    })

    expect(wrapper.findAll('.model-card')).toHaveLength(8)

    const setupState = (wrapper.vm as any).$?.setupState
    setupState.providerFilter = 'google'
    await nextTick()

    expect(wrapper.findAll('.model-card')).toHaveLength(2)
    expect(wrapper.text()).toContain('Gemini 2.5 Pro')
    expect(wrapper.text()).toContain('Veo 3')

    await wrapper.findAll('.model-card')[0].trigger('click')
    await wrapper.findAll('.model-card')[1].trigger('click')

    expect(setupState.compareIds).toEqual(['gemini-2.5-pro', 'veo-3'])
    expect(wrapper.text()).toContain('modelSquare.compare.selected:2')
  })
})
