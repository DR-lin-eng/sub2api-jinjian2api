import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'

import HomePage from '../HomePage.vue'

const { appStore, authStore } = vi.hoisted(() => ({
  appStore: {
    cachedPublicSettings: {} as Record<string, unknown>,
    siteName: 'Fallback site',
    siteLogo: '',
    docUrl: '',
    publicSettingsLoaded: true,
    fetchPublicSettings: vi.fn(),
  },
  authStore: {
    isAuthenticated: false,
    isAdmin: false,
    user: null as { email?: string } | null,
  },
}))

vi.mock('@/core/stores/appStore', () => ({
  useAppStore: () => appStore,
}))

vi.mock('@/features/auth/presentation/stores/authStore', () => ({
  useAuthStore: () => authStore,
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

function mountHome(settings: Record<string, unknown> = {}) {
  appStore.cachedPublicSettings = {
    site_name: 'Test site',
    site_subtitle: 'Test subtitle',
    ...settings,
  }

  return mount(HomePage, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
        LocaleSwitcher: { template: '<div data-testid="locale-switcher" />' },
        Icon: { template: '<span data-testid="icon" />' },
      },
    },
  })
}

function compactDestination(wrapper: ReturnType<typeof mountHome>) {
  return wrapper.get('[data-testid="compact-home"]').findComponent(RouterLinkStub).props('to')
}

describe('HomePage compact mode', () => {
  beforeEach(() => {
    authStore.isAuthenticated = false
    authStore.isAdmin = false
    authStore.user = null
    appStore.fetchPublicSettings.mockClear()
    localStorage.clear()
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList)
  })

  it('keeps custom HTML and URL content ahead of compact mode', () => {
    const html = mountHome({
      compact_home_enabled: true,
      home_content: '<section id="custom-home">Custom home</section>',
    })
    expect(html.get('#custom-home').text()).toBe('Custom home')
    expect(html.find('[data-testid="compact-home"]').exists()).toBe(false)

    const url = mountHome({
      compact_home_enabled: true,
      home_content: ' https://example.com/home ',
    })
    expect(url.get('iframe').attributes('src')).toBe('https://example.com/home')
  })

  it('treats whitespace-only custom content as empty', () => {
    const wrapper = mountHome({ compact_home_enabled: true, home_content: ' \n\t ' })
    expect(wrapper.get('[data-testid="compact-home"]').text()).toContain('Test site')
  })

  it.each([undefined, false])('uses the default home when compact mode is %s', (enabled) => {
    const settings = enabled === undefined ? {} : { compact_home_enabled: enabled }
    const wrapper = mountHome(settings)
    expect(wrapper.find('[data-testid="compact-home"]').exists()).toBe(false)
    expect(wrapper.find('.terminal-container').exists()).toBe(true)
  })

  it('routes visitors and authenticated users to the appropriate entry point', () => {
    expect(compactDestination(mountHome({ compact_home_enabled: true }))).toBe('/login')

    authStore.isAuthenticated = true
    expect(compactDestination(mountHome({ compact_home_enabled: true }))).toBe('/dashboard')

    authStore.isAdmin = true
    expect(compactDestination(mountHome({ compact_home_enabled: true }))).toBe('/admin/dashboard')
  })

  it('shows the model plaza entry in both built-in home layouts when enabled', () => {
    const compact = mountHome({
      compact_home_enabled: true,
      model_plaza_enabled: true,
    })
    expect(
      compact.get('[data-testid="compact-model-plaza-link"]').findComponent(RouterLinkStub).props('to'),
    ).toBe('/model-plaza')

    const defaultHome = mountHome({ model_plaza_enabled: true })
    expect(
      defaultHome.get('[data-testid="default-model-plaza-link"]').findComponent(RouterLinkStub).props('to'),
    ).toBe('/model-plaza')
  })

  it.each([undefined, false])('hides the model plaza entry when the feature flag is %s', (enabled) => {
    const settings = enabled === undefined ? {} : { model_plaza_enabled: enabled }
    const compact = mountHome({ compact_home_enabled: true, ...settings })
    const defaultHome = mountHome(settings)

    expect(compact.find('[data-testid="compact-model-plaza-link"]').exists()).toBe(false)
    expect(defaultHome.find('[data-testid="default-model-plaza-link"]').exists()).toBe(false)
  })
})
