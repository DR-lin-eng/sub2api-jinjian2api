import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PaymentMethodSelector from '@/features/billing/presentation/widgets/PaymentMethodSelector.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}))

describe('PaymentMethodSelector', () => {
  it('shows the configured display name for custom EasyPay methods', () => {
    const wrapper = mount(PaymentMethodSelector, {
      props: {
        selected: 'ldc',
        methods: [{ type: 'ldc', display_name: 'LDC Pay', fee_rate: 0, available: true }],
      },
    })

    expect(wrapper.text()).toContain('LDC Pay')
    expect(wrapper.text()).not.toContain('ldc')
    expect(wrapper.text()).not.toContain('payment.methods.ldc')
  })

  it('uses the generic selected style for custom methods that contain built-in names', () => {
    const wrapper = mount(PaymentMethodSelector, {
      props: {
        selected: 'card_alipay',
        methods: [{ type: 'card_alipay', display_name: 'Card Pay', fee_rate: 0, available: true }],
      },
    })

    const button = wrapper.get('button')
    expect(button.classes()).toContain('border-primary-500')
    expect(button.classes()).not.toContain('border-[#02A9F1]')
  })

  it('keeps long custom names inside a bounded responsive grid', () => {
    const name = 'A very long custom payment method name that must not resize the selector'
    const wrapper = mount(PaymentMethodSelector, {
      props: {
        selected: 'long_custom_method',
        methods: [{ type: 'long_custom_method', display_name: name, fee_rate: 0, available: true }],
      },
    })

    expect(wrapper.get('[data-testid="payment-method-grid"]').classes()).toEqual(expect.arrayContaining([
      'grid-cols-2',
      'sm:grid-cols-3',
      'lg:grid-cols-4',
    ]))
    const button = wrapper.get('button')
    expect(button.attributes('title')).toBe(name)
    expect(button.classes()).toContain('min-w-0')
    expect(wrapper.get('[data-testid="payment-method-label"]').classes()).toEqual(expect.arrayContaining([
      'w-full',
      'truncate',
    ]))
  })
})
