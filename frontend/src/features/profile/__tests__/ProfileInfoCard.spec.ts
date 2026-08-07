import { describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ProfileInfoCard from '@/features/profile/presentation/widgets/ProfileInfoCard.vue'
import type { User } from '@/types'

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) =>
        ({
          'profile.administrator': 'Administrator',
          'profile.memberSince': 'Member Since'
        })[key] || key
    })
  }
})

const administrator: User = {
  id: 1,
  username: 'alice',
  email: 'alice@example.com',
  role: 'admin',
  status: 'active',
  created_at: '2026-04-20T00:00:00Z',
  updated_at: '2026-04-20T00:00:00Z'
}

describe('ProfileInfoCard', () => {
  it('renders the local administrator identity', () => {
    const wrapper = shallowMount(ProfileInfoCard, {
      props: { user: administrator }
    })

    expect(wrapper.text()).toContain('alice')
    expect(wrapper.text()).toContain('alice@example.com')
    expect(wrapper.text()).toContain('Administrator')
    expect(wrapper.text()).toContain('Member Since')
    expect(wrapper.get('[data-testid="profile-overview"]').exists()).toBe(true)
  })

  it('keeps avatar and display-name editors in the overview', () => {
    const wrapper = shallowMount(ProfileInfoCard, {
      props: { user: administrator }
    })

    expect(wrapper.findComponent({ name: 'ProfileAvatarCard' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ProfileEditForm' }).exists()).toBe(true)
  })
})
