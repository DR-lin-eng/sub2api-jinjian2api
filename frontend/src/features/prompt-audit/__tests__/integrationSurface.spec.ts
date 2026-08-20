import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import en from '@/core/i18n/locales/en'
import zh from '@/core/i18n/locales/zh'

const here = dirname(fileURLToPath(import.meta.url))
const read = (path: string) => readFileSync(resolve(here, path), 'utf8')

describe('Prompt Audit integration surface', () => {
  it('registers an authenticated admin route', () => {
    const router = read('../../../core/routes/index.ts')
    expect(router).toContain("path: '/admin/prompt-audit'")
    const route = router.slice(router.indexOf("path: '/admin/prompt-audit'"), router.indexOf("path: '/admin/usage'"))
    expect(route).toContain('requiresAuth: true')
    expect(route).toContain('requiresAdmin: true')
  })

  it('keeps Prompt Audit available to the local administrator', () => {
    const sidebar = read('../../../common/widgets/layout/AppSidebar.vue')
    expect(sidebar).toContain("path: '/admin/prompt-audit'")
    expect(sidebar).not.toContain("path: '/admin/risk-control'")
    expect(sidebar).not.toContain("path: '/admin/security-audit/ingress'")
  })

  it('keeps Prompt Audit locale trees symmetric and all operational controls named', () => {
    expect(Object.keys(zh.admin.promptAudit)).toEqual(Object.keys(en.admin.promptAudit))
    const endpoint = read('../presentation/widgets/EndpointPool.vue')
    const events = read('../presentation/widgets/EventWorkspace.vue')
    expect(endpoint).toContain('aria-label')
    expect(events).toContain('aria-label')
    expect(events).toContain('overflow-x-auto')
    expect(events).toContain('sm:grid-cols-2')
  })
})
