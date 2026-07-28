import { reactive, ref } from 'vue'
import type { useI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import type { AdminGroup } from '@/types'
import { useRiskControlOptions } from '@/features/admin-risk-control/presentation/composables/useRiskControlOptions'

const t = ((key: string) => key) as ReturnType<typeof useI18n>['t']

describe('risk control filter options', () => {
  it('preserves backend query values and group labels from the legacy page', () => {
    const groups = ref([
      { id: 7, name: 'Primary', platform: 'openai' } as AdminGroup,
    ])
    const config = reactive({
      mode: 'pre_block' as const,
      keyword_blocking_mode: 'keyword_and_api' as const,
    })
    const options = useRiskControlOptions(t, groups, config)

    expect(options.resultOptions.value.map((option) => option.value)).toEqual([
      '',
      'hit',
      'blocked',
      'pass',
      'error',
    ])
    expect(options.endpointOptions.value.map((option) => option.value)).toEqual([
      '',
      '/v1/messages',
      '/v1/responses',
      '/v1/chat/completions',
      '/v1beta/models',
      '/v1/images/generations',
      '/v1/images/edits',
    ])
    expect(options.groupFilterOptions.value[1]).toEqual({
      value: 7,
      label: 'Primary (openai)',
    })
  })
})
