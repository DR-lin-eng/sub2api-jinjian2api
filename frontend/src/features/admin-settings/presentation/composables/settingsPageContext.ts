import { inject, provide, type InjectionKey } from 'vue'
import type { SettingsPageContext } from './useSettingsPage'

const settingsPageContextKey: InjectionKey<SettingsPageContext> = Symbol('settings-page-context')

export function provideSettingsPageContext(context: SettingsPageContext): void {
  provide(settingsPageContextKey, context)
}

export function useSettingsPageContext(): SettingsPageContext {
  const context = inject(settingsPageContextKey)
  if (!context) {
    throw new Error('Settings page context is unavailable')
  }
  return context
}
